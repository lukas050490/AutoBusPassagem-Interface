import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CentralButton from '../../components/centralButton';

function AdminsManagement() {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
        company_id: ''
    });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Pegar o usuário logado do localStorage
        const storedUser = localStorage.getItem('@BusTicket:user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        fetchAdmins();
        fetchCompanies();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await api.get('/admins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Erro ao carregar administradores:', error);
            alert('Erro ao carregar administradores');
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
            resetForm();
            fetchAdmins();
            alert('Administrador criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar administrador:', error);
            alert(error.response?.data?.error || 'Erro ao criar administrador');
        }
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            password: '', // Senha fica vazia para não precisar redefinir
            role: admin.role,
            company_id: admin.company_id
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Verificar se está tentando editar o próprio usuário
        if (currentUser && selectedAdmin.id === currentUser.id) {
            alert('Você não pode editar seu próprio usuário!');
            return;
        }

        try {
            // Se a senha estiver vazia, remove do objeto para não atualizar
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            await api.put(`/admins/${selectedAdmin.id}`, updateData);
            setShowModal(false);
            resetForm();
            fetchAdmins();
            alert('Administrador atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar administrador:', error);
            alert(error.response?.data?.error || 'Erro ao atualizar administrador');
        }
    };

    const confirmDelete = (admin) => {
        // Verificar se está tentando excluir o próprio usuário
        if (currentUser && admin.id === currentUser.id) {
            alert('Você não pode excluir seu próprio usuário!');
            return;
        }
        setSelectedAdmin(admin);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/admins/${selectedAdmin.id}`);
            setShowDeleteModal(false);
            setSelectedAdmin(null);
            fetchAdmins();
            alert('Administrador excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir administrador:', error);
            alert(error.response?.data?.error || 'Erro ao excluir administrador');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'ADMIN',
            company_id: ''
        });
        setIsEditing(false);
        setSelectedAdmin(null);
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
                            Gerenciar Administradores
                        </h1>
                        <div className="flex gap-4">
                            <CentralButton onClick={() => navigate('/super-admin/dashboard')}>
                                Voltar
                            </CentralButton>
                            <CentralButton onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}>
                                + Novo Administrador
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {admin.name}
                                            {currentUser && admin.id === currentUser.id && (
                                                <span className="ml-2 text-xs text-gray-500">(Você)</span>
                                            )}
                                        </td>
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
                                            <button
                                                onClick={() => handleEdit(admin)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                disabled={currentUser && admin.id === currentUser.id}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(admin)}
                                                className="text-red-600 hover:text-red-900"
                                                disabled={currentUser && admin.id === currentUser.id}
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
                            {isEditing ? 'Editar Administrador' : 'Novo Administrador'}
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
                                <label className="block text-gray-700 font-semibold mb-2">E-mail</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Senha {isEditing && '(deixe em branco para manter a atual)'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                    required={!isEditing}
                                    placeholder={isEditing ? "Nova senha (opcional)" : "********"}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Função</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
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
            {showDeleteModal && selectedAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Confirmar Exclusão</h2>
                        <p className="text-gray-700 mb-6">
                            Tem certeza que deseja excluir o administrador <strong>{selectedAdmin.name}</strong>?
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

export default AdminsManagement;