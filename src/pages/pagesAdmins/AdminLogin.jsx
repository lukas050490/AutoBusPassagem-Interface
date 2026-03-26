
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CentralButton from '../../components/centralButton';

function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirecionar baseado no role
            if (result.user.role === 'SUPER_ADMIN') {
                navigate('/super-admin/dashboard');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
                backgroundSize: "100% 100%",
            }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">
                        Área Administrativa
                    </h1>
                    <p className="text-gray-600 mt-2">Faça login para continuar</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            E-mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                            placeholder="admin@empresa.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                            placeholder="********"
                        />
                    </div>

                    <div className="pt-4">
                        <CentralButton
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </CentralButton>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-teal-600 hover:text-teal-700"
                    >
                        ← Voltar para o site
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;