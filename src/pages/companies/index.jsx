import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import CentralButton from "../../components/centralButton/index.jsx";
import CompanyCard from "../../components/companyCard/index.jsx";

function Companies() {
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await api.get('/auth/companies');
                setCompanies(response.data);
            } catch (error) {
                console.error('Erro ao buscar empresas:', error);
                setError(error.message || 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    return (
        <>
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-10 p-10"
                style={{
                    backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
                     `,
                    backgroundSize: "100% 100%",
                }}
            >
                {/* <h1 className="text-4xl text-primaryLight font-bold">ESCOLHA A EMPRESA</h1> */}
                <h1 className=" text-4xl font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">ESCOLHA A EMPRESA</h1>
                <div className=" grid grid-cols-3 gap-20 ">
                    {loading ? (
                        <p className="text-lg text-gray-700">Carregando empresas...</p>
                    ) : companies.length > 0 ? (
                        companies.map(company => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                onClick={() => navigate("/destino-e-data", { state: { companyId: company.id, companyName: company.name } })}
                            />
                        ))
                    ) : (
                        <p className="text-lg text-gray-700">Nenhuma empresa encontrada.</p>
                    )}
                </div>
                {error && <p className="text-red-500">Erro ao carregar empresas: {error}</p>}
                <div>
                    <CentralButton onClick={() => navigate("/")}>VOLTAR</CentralButton>
                </div>
            </div>
        </>
    )
}

export default Companies;