
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CentralButton from '../../components/centralButton';

function AdminsManagement() {
    const [admins, setAdmins] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
        company_id: ''
    });

    useEffect(() => {
        fetchAdmins();
        fetchCompanies();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await api.get('/admins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Erro ao carregar administradores:', error);
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
            await api.post('/admins', formData);
            setShowModal(false);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'ADMIN',
                company_id: ''
            });
            fetchAdmins();
        } catch (error) {
            console.error('Erro ao criar administrador:', error);
            alert(error.response?.data?.error || 'Erro ao criar administrador');
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
                            Gerenciar Administradores
                        </h1>
                        <CentralButton onClick={() => setShowModal(true)}>
                            + Novo Administrador
                        </CentralButton>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        E-mail
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Função
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Empresa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {admins.map((admin) => (
                                    <tr key={admin.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.role === 'SUPER_ADMIN'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {companies.find(c => c.id === admin.company_id)?.name || admin.company_id}
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
                    <div className="bg-white rounded-xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Novo Administrador</h2>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">E-mail</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Senha</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Função</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="ADMIN">Administrador</option>
                                    <option value="SUPER_ADMIN">Super Administrador</option>
                                </select>
                            </div>

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

export default AdminsManagement;