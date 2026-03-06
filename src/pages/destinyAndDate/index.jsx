
import CentralButton from "../../components/centralButton/index.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from '../../services/api';

function DestinyAndDate() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const companyId = state?.companyId;
    const companyName = state?.companyName;

    const [trips, setTrips] = useState([]);
    const [origin, setOrigin] = useState("");
    const [destinations, setDestinations] = useState([]);
    const [destination, setDestination] = useState("");
    const [dateGo, setDateGo] = useState("");
    const [onlyGo, setOnlyGo] = useState(false);
    const [dateReturn, setDateReturn] = useState("");
    const origins = [...new Set(trips.map(trip => trip.origin))];

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get(`/auth/trips?companyId=${companyId}`);

                setTrips(response.data);
            } catch (error) {
                console.error('Erro ao buscar viagens:', error);
            }
        };
        if (companyId) fetchTrips();
    }, [companyId]);

    const handleOriginChange = (e) => {
        const selectedOrigin = e.target.value;
        setOrigin(selectedOrigin);
        setDestination("");

        const availableDestinations = trips
            .filter(trip => trip.origin === selectedOrigin)
            .map(trip => trip.destination);
        setDestinations([...new Set(availableDestinations)]);
    };

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
    };

    const handleDateGoChange = (e) => {
        setDateGo(e.target.value);
    };

    const handleDateReturnChange = (e) => {
        setDateReturn(e.target.value);
    };

    const handleOnlyGoChange = (e) => {
        const checked = e.target.checked;
        setOnlyGo(checked);

        if (checked) {
            setDateReturn("");
        }
    };

    const handleNavigateToHours = () => {
        // Validar se campos obrigatórios estão preenchidos
        if (!origin || !destination || !dateGo) {
            alert("Preencha origem, destino e data de ida!");
            return;
        }

        // Se não é só ida, validar data de volta
        if (!onlyGo && !dateReturn) {
            alert("Preencha a data de volta!");
            return;
        }
        // Passar dados para a próxima tela via state
        navigate("/horario-disponivel", {
            state: {
                companyId,
                companyName,
                origin,
                destination,
                dateGo,
                dateReturn: onlyGo ? null : dateReturn,
                onlyGo
            }
        });
    };


    return (
        <>
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-10 p-10"
                style={{
                    backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
                     `,
                    backgroundSize: "100% 100%",
                }}>
                <h1 className=" text-4xl font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">Escolha o Destino e Data</h1>
                <div className="flex gap-10">
                    <div className=" flex flex-col gap-4 ">
                        <label className="text-primaryMid font-bold">Origem</label>
                        <select value={origin} onChange={handleOriginChange}
                            className=" w-80 h-10 border-2 border-b-cyan-800 rounded-lg p-2 hover:border-primaryLight focus:outline-none focus:ring-2 focus:ring-primaryLight"
                        >
                            <option value="">Selecione...</option>
                            {origins.map((o) => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                    </div>
                    <div className=" flex flex-col gap-4 ">
                        <label className="text-primaryMid font-bold">Destino</label>
                        <select value={destination} onChange={handleDestinationChange} disabled={!origin}
                            className=" w-80 h-10 border-2 border-b-cyan-800 rounded-lg p-2 hover:border-primaryLight focus:outline-none focus:ring-2 focus:ring-primaryLight"
                        >
                            <option value="">Selecione...</option>
                            {destinations.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-10">
                    <div className=" flex flex-col gap-4 ">
                        <label className="text-primaryMid font-bold">Data de Ida</label>
                        <input
                            type="date"
                            value={dateGo}
                            onChange={handleDateGoChange}
                            className="w-52 h-20 border-2 border-b-cyan-800 rounded-lg p-2 hover:border-primaryLight focus:outline-none focus:ring-2 focus:ring-primaryLight " />
                    </div>
                    <div className=" flex flex-col gap-4">
                        <label className="text-primaryMid font-bold">Data de Volta</label>
                        <input
                            min={dateGo}
                            type="date"
                            value={dateReturn}
                            onChange={handleDateReturnChange}
                            disabled={onlyGo}
                            className="w-52 h-20 border-2 border-b-cyan-800 rounded-lg p-2 hover:border-primaryLight focus:outline-none focus:ring-2 focus:ring-primaryLight " />
                    </div>
                </div>
                <div className=" flex gap-4">
                    <label className="text-primaryMid font-bold">Apenas Ida</label>
                    <input
                        type="checkbox"
                        checked={onlyGo}
                        onChange={handleOnlyGoChange}
                        className="w-10 h-5 rounded-2xl border-2 border-b-cyan-800" />
                </div>
                <div className=" flex gap-4">
                    <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
                    <CentralButton onClick={handleNavigateToHours}>Seguir</CentralButton>
                </div>
            </div>

        </>
    )
}
export default DestinyAndDate;