
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CentralButton from '../../components/centralButton';

function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();

    // Se ainda estiver carregando, mostrar loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    // Se não tiver usuário, redirecionar
    if (!user) {
        navigate('/admin/login');
        return null;
    }

    const menuItems = [
        {
            title: 'Gerenciar Viagens',
            description: 'Criar e gerenciar viagens da sua empresa',
            icon: '🚌',
            path: '/admin/trips',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Reservas',
            description: 'Visualizar e gerenciar reservas',
            icon: '📅',
            path: '/admin/reservations',
            color: 'from-teal-500 to-teal-600'
        },
        {
            title: 'Relatórios',
            description: 'Relatórios de vendas e ocupação',
            icon: '📈',
            path: '/admin/reports',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
                backgroundSize: "100% 100%",
            }}
        >
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">
                                Bem-vindo, {user?.name}!
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Administrador - Gerencie as viagens da sua empresa
                            </p>
                            {user?.company_id && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Empresa ID: {user.company_id}
                                </p>
                            )}
                        </div>
                        <CentralButton onClick={handleLogout}>
                            Sair
                        </CentralButton>
                    </div>
                </div>

                {/* Menu Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
                        >
                            <div className={`text-4xl mb-4 bg-gradient-to-r ${item.color} inline-block p-3 rounded-full`}>
                                {item.icon}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;