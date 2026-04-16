import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CentralButton from '../../components/centralButton';

function CompaniesManagement() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error('Erro ao carregar empresas:', error);
            alert('Erro ao carregar empresas');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/companies', formData);
            setShowModal(false);
            resetForm();
            fetchCompanies();
            alert('Empresa criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar empresa:', error);
            alert(error.response?.data?.error || 'Erro ao criar empresa');
        }
    };

    const handleEdit = (company) => {
        setSelectedCompany(company);
        setFormData({
            name: company.name,
            cnpj: company.cnpj,
            status: company.status
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/companies/${selectedCompany.id}`, formData);
            setShowModal(false);
            resetForm();
            fetchCompanies();
            alert('Empresa atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            alert(error.response?.data?.error || 'Erro ao atualizar empresa');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/companies/${selectedCompany.id}`);
            setShowDeleteModal(false);
            setSelectedCompany(null);
            fetchCompanies();
            alert('Empresa excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir empresa:', error);
            alert(error.response?.data?.error || 'Erro ao excluir empresa');
        }
    };

    const confirmDelete = (company) => {
        setSelectedCompany(company);
        setShowDeleteModal(true);
    };

    const resetForm = () => {
        setFormData({ name: '', cnpj: '', status: 'ACTIVE' });
        setIsEditing(false);
        setSelectedCompany(null);
    };

    const closeModal = () => {
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
                            Gerenciar Empresas
                        </h1>
                        <div className="flex gap-4">
                            <CentralButton onClick={() => navigate('/super-admin/dashboard')}>
                                Voltar
                            </CentralButton>
                            <CentralButton onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}>
                                + Nova Empresa
                            </CentralButton>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CNPJ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {companies.map((company) => (
                                    <tr key={company.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{company.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{company.cnpj}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${company.status === 'ACTIVE' || company.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {company.status === 'ACTIVE' || company.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(company)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(company)}
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
                    <div className="bg-white rounded-xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">
                            {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
                        </h2>
                        <form onSubmit={isEditing ? handleUpdate : handleCreate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">CNPJ</label>
                                <input
                                    type="text"
                                    value={formData.cnpj}
                                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                    required
                                    placeholder="00.000.000/0001-00"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                >
                                    <option value="ACTIVE">Ativo</option>
                                    <option value="INACTIVE">Inativo</option>
                                </select>
                            </div>

                            <div className="flex gap-4 justify-end">
                                <CentralButton onClick={closeModal} variant="secondary">
                                    Cancelar
                                </CentralButton>
                                <CentralButton type="submit">
                                    {isEditing ? 'Atualizar' : 'Criar'}
                                </CentralButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmação de exclusão */}
            {showDeleteModal && selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Confirmar Exclusão</h2>
                        <p className="text-gray-700 mb-6">
                            Tem certeza que deseja excluir a empresa <strong>{selectedCompany.name}</strong>?
                            <br />
                            <span className="text-sm text-red-500">Esta ação não pode ser desfeita.</span>
                        </p>
                        <div className="flex gap-4 justify-end">
                            <CentralButton onClick={() => setShowDeleteModal(false)} variant="secondary">
                                Cancelar
                            </CentralButton>
                            <CentralButton onClick={handleDelete} variant="danger">
                                Excluir
                            </CentralButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CompaniesManagement;