
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, isAuthenticated, loading, hasRole } = useAuth();

    // Mostrar loading enquanto verifica autenticação
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    // Se não estiver autenticado, redirecionar para login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Verificar roles permitidas
    if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        // Redirecionar para o dashboard correto baseado no role
        if (user?.role === 'SUPER_ADMIN') {
            return <Navigate to="/super-admin/dashboard" replace />;
        }
        if (user?.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    // Se tudo ok, renderizar o componente
    return children;
}

export default ProtectedRoute;