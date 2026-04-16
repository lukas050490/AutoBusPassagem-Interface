// src/pages/pagesAdmins/ReportsManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import CentralButton from '../../components/centralButton';

function ReportsManagement() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalReservations: 0,
        totalPaid: 0,
        totalRevenue: 0,
        occupancyRate: 0
    });
    const [recentReservations, setRecentReservations] = useState([]);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Primeiro dia do mês
        end: new Date().toISOString().split('T')[0] // Hoje
    });

    useEffect(() => {
        fetchReports();
    }, [dateRange]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reports', {
                params: {
                    company_id: user?.company_id,
                    start_date: dateRange.start,
                    end_date: dateRange.end
                }
            });

            setStats(response.data.stats);
            setRecentReservations(response.data.recentReservations);
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
            alert('Erro ao carregar relatórios');
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async () => {
        try {
            const response = await api.get('/reports/export', {
                params: {
                    company_id: user?.company_id,
                    start_date: dateRange.start,
                    end_date: dateRange.end
                },
                responseType: 'blob'
            });

            // Criar link para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio_${dateRange.start}_a_${dateRange.end}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            alert('Relatório exportado com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
            alert('Erro ao exportar relatório');
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
                            Relatórios
                        </h1>
                        <div className="flex gap-4">
                            <CentralButton onClick={() => navigate('/admin/dashboard')}>
                                Voltar
                            </CentralButton>
                            <CentralButton onClick={exportReport}>
                                Exportar Relatório
                            </CentralButton>
                        </div>
                    </div>

                    {/* Filtro de Data */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h2 className="font-semibold mb-3">Período</h2>
                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Data Inicial</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Data Final</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="flex items-end">
                                <CentralButton onClick={fetchReports}>
                                    Atualizar
                                </CentralButton>
                            </div>
                        </div>
                    </div>

                    {/* Cards de Estatísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Total de Viagens</p>
                            <p className="text-2xl font-bold">{stats.totalTrips}</p>
                        </div>
                        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Total de Reservas</p>
                            <p className="text-2xl font-bold">{stats.totalReservations}</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Reservas Pagas</p>
                            <p className="text-2xl font-bold">{stats.totalPaid}</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Faturamento Total</p>
                            <p className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Taxa de Ocupação</p>
                            <p className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</p>
                        </div>
                    </div>

                    {/* Tabela de Reservas Recentes */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Reservas Recentes</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            CPF
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Origem/Destino
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentReservations.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(reservation.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.passenger_cpf}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {reservation.trip?.origin} → {reservation.trip?.destination}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                R$ {reservation.amount?.toFixed(2) || '0.00'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reservation.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {reservation.status === 'PAID' ? 'Pago' : 'Pendente'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportsManagement;