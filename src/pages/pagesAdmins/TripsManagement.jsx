
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import CentralButton from '../../components/centralButton';

function TripsManagement() {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        date: '',
        time: '',
        price: '',
        company_id: user?.company_id || '',
        total_seats: 40
    });

    useEffect(() => {
        fetchTrips();
        if (user?.role === 'SUPER_ADMIN') {
            fetchCompanies();
        }
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await api.get('/trips');
            setTrips(response.data);
        } catch (error) {
            console.error('Erro ao carregar viagens:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error('Erro ao carregar empresas:', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/trips', {
                ...formData,
                date: `${formData.date} ${formData.time}`
            });
            setShowModal(false);
            setFormData({
                origin: '',
                destination: '',
                date: '',
                time: '',
                price: '',
                company_id: user?.company_id || '',
                total_seats: 40
            });
            fetchTrips();
        } catch (error) {
            console.error('Erro ao criar viagem:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen p-8"
            style={{
                backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
                backgroundSize: "100% 100%",
            }}
        >
            <div className="container mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">
                            Gerenciar Viagens
                        </h1>
                        <CentralButton onClick={() => setShowModal(true)}>
                            + Nova Viagem
                        </CentralButton>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Origem
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Destino
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data/Hora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Preço
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assentos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trips.map((trip) => (
                                    <tr key={trip.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{trip.origin}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{trip.destination}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(trip.date).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            R$ {trip.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {trip.available_seats}/{trip.total_seats}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                Editar
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
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

            {/* Modal de criação */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Nova Viagem</h2>
                        <form onSubmit={handleCreate}>
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

                            <div className="flex gap-4 justify-end">
                                <CentralButton onClick={() => setShowModal(false)} variant="secondary">
                                    Cancelar
                                </CentralButton>
                                <CentralButton type="submit">
                                    Criar
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