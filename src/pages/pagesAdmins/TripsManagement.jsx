import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import CentralButton from '../../components/centralButton';

function TripsManagement() {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // 🔥 Controla se é edição
    const [editingTripId, setEditingTripId] = useState(null); // 🔥 ID da viagem sendo editada
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        date: '',
        time: '',
        price: '',
        company_id: user?.company_id || '',
        total_seats: 50,
        service_type: 'CONVENCIONAL'
    });

    const navigate = useNavigate();

    const isFetchingRef = useRef(false);
    const isMountedRef = useRef(true);

    const normalizeDateString = (dateStr) => {
        if (!dateStr) return null;
        const normalized = String(dateStr).replace(' ', 'T');
        const date = new Date(normalized);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    // 🔥 Função para formatar data e hora para o formulário
    const formatDateTimeForForm = (dateTimeStr) => {
        if (!dateTimeStr) return { date: '', time: '' };
        const date = new Date(dateTimeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`
        };
    };

    const fetchTripSeats = async (tripId) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await api.get(`/trips/${tripId}/available`, {
                timeout: 30000,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (Array.isArray(response.data)) {
                const seats = response.data;
                const total_seats = seats.length;
                const available_seats = seats.filter(seat => seat.available === true).length;
                return { available_seats, total_seats };
            }

            return {
                available_seats: response.data.available_seats ?? response.data.availableSeats ?? 0,
                total_seats: response.data.total_seats ?? response.data.totalSeats ?? 0
            };
        } catch (error) {
            console.error(`[SEAT] ✗ Erro trip ${tripId}:`, error.message);
            return { available_seats: 0, total_seats: 0 };
        }
    };

    const fetchTrips = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            const response = await api.get('/trips');
            const tripsData = response.data || [];
            console.log(`[TRIPS] Total de viagens: ${tripsData.length}`);

            const seatResults = [];
            for (let i = 0; i < tripsData.length; i += 5) {
                const batch = tripsData.slice(i, i + 5);
                const batchResults = await Promise.allSettled(
                    batch.map(trip => fetchTripSeats(trip.id))
                );
                seatResults.push(...batchResults);
            }

            const normalizedTrips = tripsData.map((trip, index) => {
                const seatInfo = seatResults[index]?.status === 'fulfilled'
                    ? seatResults[index].value
                    : { available_seats: 0, total_seats: 0 };

                return {
                    ...trip,
                    parsedDate: normalizeDateString(trip.departure_time ?? trip.date ?? trip.createdAt),
                    parsedPrice: Number(trip.price ?? trip.fare ?? 0),
                    parsedAvailableSeats: Number(seatInfo.available_seats ?? 0),
                    parsedTotalSeats: Number(seatInfo.total_seats ?? 0),
                };
            });

            if (isMountedRef.current) {
                setTrips(normalizedTrips);
                setLoading(false);
            }
        } catch (error) {
            console.error('Erro ao carregar viagens:', error);
            if (isMountedRef.current) setLoading(false);
        } finally {
            isFetchingRef.current = false;
        }
    }, []);

    const fetchCompanies = useCallback(async () => {
        try {
            const response = await api.get('/companies');
            if (isMountedRef.current) setCompanies(response.data);
        } catch (error) {
            console.error('Erro ao carregar empresas:', error);
        }
    }, []);

    useEffect(() => {
        isMountedRef.current = true;
        fetchTrips();
        if (user?.role === 'SUPER_ADMIN') fetchCompanies();
        return () => { isMountedRef.current = false; };
    }, [user?.role, fetchTrips, fetchCompanies]);

    // 🔥 Função para abrir modal de edição
    const handleEdit = (trip) => {
        console.log("Editando viagem:", trip);

        const { date, time } = formatDateTimeForForm(trip.departure_time);

        setFormData({
            origin: trip.origin,
            destination: trip.destination,
            date: date,
            time: time,
            price: trip.price,
            company_id: trip.company_id || user?.company_id || '',
            total_seats: trip.parsedTotalSeats || 50,
            service_type: trip.service_type || 'CONVENCIONAL'
        });

        setIsEditing(true);
        setEditingTripId(trip.id);
        setShowModal(true);
    };

    // 🔥 Função para excluir viagem
    const handleDelete = async (tripId) => {
        if (!confirm("Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            await api.delete(`/trips/${tripId}`);
            alert("Viagem excluída com sucesso!");
            await fetchTrips(); // Recarregar a lista
        } catch (error) {
            console.error("Erro ao excluir viagem:", error);
            alert(error.response?.data?.error || "Erro ao excluir viagem");
        }
    };

    // 🔥 Função para criar/atualizar viagem
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.origin || !formData.destination || !formData.date || !formData.time || !formData.price) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const departureDateTime = new Date(`${formData.date}T${formData.time}`);
            const arrivalDateTime = new Date(departureDateTime);
            arrivalDateTime.setHours(arrivalDateTime.getHours() + 4);

            const tripData = {
                origin: formData.origin,
                destination: formData.destination,
                departure_time: departureDateTime.toISOString(),
                arrival_time: arrivalDateTime.toISOString(),
                service_type: formData.service_type,
                price: parseFloat(formData.price),
                total_seats: parseInt(formData.total_seats),
                company_id: user?.role === 'SUPER_ADMIN' ? formData.company_id : user?.company_id
            };



            if (isEditing && editingTripId) {
                // 🔥 PUT - Atualizar viagem existente
                await api.put(`/trips/${editingTripId}`, tripData);
                alert("Viagem atualizada com sucesso!");
            } else {
                // 🔥 POST - Criar nova viagem
                await api.post('/trips', tripData);
                alert("Viagem criada com sucesso!");
            }

            // Fechar modal e resetar formulário
            setShowModal(false);
            resetForm();
            await fetchTrips();

        } catch (error) {
            console.error('Erro ao salvar viagem:', error);
            alert(error.response?.data?.error || "Erro ao salvar viagem");
        }
    };

    // 🔥 Resetar formulário
    const resetForm = () => {
        setFormData({
            origin: '',
            destination: '',
            date: '',
            time: '',
            price: '',
            company_id: user?.company_id || '',
            total_seats: 50,
            service_type: 'CONVENCIONAL'
        });
        setIsEditing(false);
        setEditingTripId(null);
    };

    // 🔥 Fechar modal e resetar
    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8" style={{
            backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
            backgroundSize: "100% 100%",
        }}>
            <div className="container mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">
                            Gerenciar Viagens
                        </h1>
                        <CentralButton onClick={() => navigate('/super-admin/dashboard')}>
                            Voltar
                        </CentralButton>
                        <CentralButton onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}>
                            + Nova Viagem
                        </CentralButton>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assentos</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trips.map((trip) => (
                                    <tr key={trip.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{trip.origin}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{trip.destination}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {trip.parsedDate ? trip.parsedDate.toLocaleString() : (trip.departure_time || 'Data inválida')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            R$ {trip.parsedPrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {trip.parsedAvailableSeats} / {trip.parsedTotalSeats}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(trip)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(trip.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de criação/edição */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">
                            {isEditing ? "Editar Viagem" : "Nova Viagem"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {user?.role === 'SUPER_ADMIN' && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Empresa</label>
                                    <select
                                        value={formData.company_id}
                                        onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    >
                                        <option value="">Selecione uma empresa</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Origem</label>
                                <input
                                    type="text"
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Destino</label>
                                <input
                                    type="text"
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Data</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Horário</label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Tipo de Serviço</label>
                                <select
                                    value={formData.service_type}
                                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="CONVENCIONAL">Convencional</option>
                                    <option value="SEMI_LEITO">Semi-Leito</option>
                                    <option value="LEITO">Leito</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Preço (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Total de Assentos</label>
                                <input
                                    type="number"
                                    value={formData.total_seats}
                                    onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 justify-end">
                                <CentralButton onClick={handleCloseModal} variant="secondary">
                                    Cancelar
                                </CentralButton>
                                <CentralButton type="submit">
                                    {isEditing ? "Atualizar" : "Criar"}
                                </CentralButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TripsManagement;