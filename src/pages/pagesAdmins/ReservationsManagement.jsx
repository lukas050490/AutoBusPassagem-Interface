// src/pages/pagesAdmins/ReservationsManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiBusPassages from '../../services/api';
import CentralButton from '../../components/centralButton';

function ReservationsManagement() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, paid, cancelled
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            // Buscar reservas apenas das viagens da empresa do admin
            const response = await apiBusPassages.get('/reservations', {
                params: { company_id: user?.company_id }
            });
            setReservations(response.data);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            alert('Erro ao carregar reservas');
        } finally {
            setLoading(false);
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'PAID':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'EXPIRED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Pendente';
            case 'PAID':
                return 'Pago';
            case 'CANCELLED':
                return 'Cancelado';
            case 'EXPIRED':
                return 'Expirado';
            default:
                return status;
        }
    };

    const viewDetails = (reservation) => {
        setSelectedReservation(reservation);
        setShowDetailsModal(true);
    };

    const updateStatus = async (id, status) => {
        try {
            await apiBusPassages.put(`/reservations/${id}/status`, { status });
            fetchReservations();
            alert(`Reserva ${status === 'PAID' ? 'confirmada' : 'cancelada'} com sucesso!`);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert(error.response?.data?.error || 'Erro ao atualizar status');
        }
    };

    const filteredReservations = reservations.filter(res => {
        if (filter === 'all') return true;
        return res.status === filter;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    // Adicione estas funções auxiliares no componente
    const formatDate = (date) => {
        if (!date) return 'N/A';
        try {
            // Se for string ISO, converte para Date
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            // Verifica se a data é válida
            if (isNaN(dateObj.getTime())) return 'Data inválida';
            return dateObj.toLocaleDateString('pt-BR');
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

    const formatDateTime = (date) => {
        if (!date) return 'N/A';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return 'Data inválida';
            return dateObj.toLocaleString('pt-BR');
        } catch (error) {
            console.error('Erro ao formatar data/hora:', error);
            return 'Data inválida';
        }
    };

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
                            Gerenciar Reservas
                        </h1>
                        <CentralButton onClick={() => navigate('/admin/dashboard')}>
                            Voltar
                        </CentralButton>
                    </div>

                    {/* Filtros */}
                    <div className="mb-6 flex gap-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFilter('PENDING')}
                            className={`px-4 py-2 rounded-lg ${filter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Pendentes
                        </button>
                        <button
                            onClick={() => setFilter('PAID')}
                            className={`px-4 py-2 rounded-lg ${filter === 'PAID' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Pagas
                        </button>
                        <button
                            onClick={() => setFilter('CANCELLED')}
                            className={`px-4 py-2 rounded-lg ${filter === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Canceladas
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reserva ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CPF Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expira em
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReservations.map((reservation) => (
                                    <tr key={reservation.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                                            {reservation.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.passenger_cpf}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                                {getStatusText(reservation.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatDate(reservation.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatDateTime(reservation.expires_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => viewDetails(reservation)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Detalhes
                                            </button>
                                            {reservation.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(reservation.id, 'PAID')}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                    >
                                                        Confirmar
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(reservation.id, 'CANCELLED')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de detalhes */}
            {showDetailsModal && selectedReservation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Detalhes da Reserva</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700">Informações Gerais</h3>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <p className="text-sm text-gray-500">ID da Reserva</p>
                                        <p className="font-mono text-sm">{selectedReservation.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">CPF do Passageiro</p>
                                        <p>{selectedReservation.passenger_cpf}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedReservation.status)}`}>
                                            {getStatusText(selectedReservation.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Data da Reserva</p>
                                        <p>{new Date(selectedReservation.created_at).toLocaleString('pt-BR')}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700">Assentos Reservados</h3>
                                <div className="mt-2 space-y-2">
                                    {selectedReservation.seats?.map((seat, index) => (
                                        <div key={index} className="border rounded-lg p-3">
                                            <p><strong>Viagem:</strong> {seat.trip?.origin} → {seat.trip?.destination}</p>
                                            <p><strong>Assento:</strong> {seat.seat?.number}</p>
                                            <p><strong>Data/Hora:</strong> {seat.trip?.date ? new Date(seat.trip.date).toLocaleString('pt-BR') : 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-6">
                            <CentralButton onClick={() => setShowDetailsModal(false)}>
                                Fechar
                            </CentralButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReservationsManagement;