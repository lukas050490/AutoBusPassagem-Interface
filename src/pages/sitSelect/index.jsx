import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CentralButton from "../../components/centralButton";
import { formatDateBR } from "../../utils/formatDate";
import api from "../../services/api";

function SeatSelect() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [tripSeats, setTripSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(true);

    const {
        outboundSelection,
        returnSelection,
        companyName,
        origin,
        destination,
        dateGo,
        dateReturn,
        onlyGo,
    } = state || {};

    // Inicializar com os dados recebidos
    const [localOutbound, setLocalOutbound] = useState(outboundSelection || null);
    const [localReturn, setLocalReturn] = useState(returnSelection || null);

    // 🔥 CORREÇÃO: Definir currentSide baseado no que já foi selecionado
    const [currentSide, setCurrentSide] = useState(() => {
        if (!localOutbound?.selectedSeats?.length) return "outbound";
        if (!onlyGo && !localReturn?.selectedSeats?.length) return "return";
        return "outbound";
    });

    const [selectedSeatsOutbound, setSelectedSeatsOutbound] = useState(localOutbound?.selectedSeats || []);
    const [selectedSeatsReturn, setSelectedSeatsReturn] = useState(localReturn?.selectedSeats || []);

    // 🔥 CORREÇÃO: Criar um objeto separado para a viagem de volta
    const returnTripData = {
        tripId: returnSelection?.tripId,
        hour: returnSelection?.hour,
        serviceType: returnSelection?.serviceType,
        price: returnSelection?.price,
        platform: returnSelection?.platform,
        date: dateReturn,
        origin: destination, // Inverte origem/destino para volta
        destination: origin,
    };

    // 🔥 CORREÇÃO: Definir currentSelection baseado no side
    const currentSelection = currentSide === "return"
        ? (localReturn || returnTripData)  // Usa dados da volta
        : (localOutbound || outboundSelection);  // Usa dados da ida

    console.log("CurrentSide:", currentSide);
    console.log("CurrentSelection:", currentSelection);
    console.log("returnTripData:", returnTripData);

    const tripId = currentSelection?.tripId;

    useEffect(() => {
        async function fetchSeats() {
            if (!tripId) {
                console.log("Sem tripId para buscar assentos");
                return;
            }

            try {
                setLoadingSeats(true);
                console.log("Buscando assentos para tripId:", tripId);

                const response = await api.get(`/auth/trips/${tripId}/available`);

                const formattedSeats = response.data.map((seat) => ({
                    id: seat.id,
                    number: seat.seat_number,
                    available: true,
                }));

                setTripSeats(formattedSeats);
            } catch (error) {
                console.error("Erro ao buscar assentos:", error);
            } finally {
                setLoadingSeats(false);
            }
        }

        fetchSeats();
    }, [tripId]);

    if (loadingSeats) {
        return <p>Carregando assentos...</p>;
    }

    if (!currentSelection) {
        return <p>Dados da viagem não encontrados</p>;
    }

    function toggleSeat(seat) {
        if (currentSide === "outbound") {
            setSelectedSeatsOutbound((prev) => {
                const isSelected = prev.some(s => s.id === seat.id);
                if (isSelected) {
                    return prev.filter(s => s.id !== seat.id);
                } else {
                    return [...prev, { id: seat.id, number: seat.number }];
                }
            });
        } else {
            setSelectedSeatsReturn((prev) => {
                const isSelected = prev.some(s => s.id === seat.id);
                if (isSelected) {
                    return prev.filter(s => s.id !== seat.id);
                } else {
                    return [...prev, { id: seat.id, number: seat.number }];
                }
            });
        }
    }

    function handleContinue() {
        const activeSelected = currentSide === "outbound" ? selectedSeatsOutbound : selectedSeatsReturn;

        if (activeSelected.length === 0) {
            alert("Selecione pelo menos um assento");
            return;
        }

        if (currentSide === "outbound") {
            const updatedOutbound = {
                ...(localOutbound || outboundSelection),
                tripId: currentSelection.tripId,
                selectedSeats: selectedSeatsOutbound,
                totalPrice:
                    (localOutbound?.price || outboundSelection?.price || 0) *
                    selectedSeatsOutbound.length,
            };

            console.log("Updated outbound:", updatedOutbound);
            setLocalOutbound(updatedOutbound);

            if (dateReturn && !onlyGo) {
                setCurrentSide("return");
                return;
            }

            const nextState = {
                ...state,
                outboundSelection: updatedOutbound,
                returnSelection: localReturn
            };
            navigate("/identificacao", { state: nextState });
            return;
        }

        // currentSide === 'return'
        // 🔥 CORREÇÃO: Usar returnTripData para pegar o tripId correto
        const updatedReturn = {
            ...(localReturn || returnSelection),
            tripId: returnSelection?.tripId,  // Pega o tripId do returnSelection original
            selectedSeats: selectedSeatsReturn,
            totalPrice:
                (localReturn?.price || returnSelection?.price || 0) *
                selectedSeatsReturn.length,
        };

        console.log("Updated return:", updatedReturn);
        setLocalReturn(updatedReturn);

        const nextState = {
            ...state,
            outboundSelection: localOutbound || outboundSelection,
            returnSelection: updatedReturn
        };

        console.log("Navegando com nextState:", nextState);
        navigate("/identificacao", { state: nextState });
    }

    return (
        <div className="min-h-screen flex flex-col items-center gap-8 p-10 bg-linear-to-b from-white to-teal-400">
            <h1 className="text-4xl font-bold text-primaryLight">
                Escolha seus assentos
            </h1>

            <div className="text-center text-primaryMid">
                <p><strong>{companyName}</strong></p>
                <p>{currentSide === "outbound" ? origin : destination} → {currentSide === "outbound" ? destination : origin}</p>
                <p>Data: {currentSide === "outbound" ? formatDateBR(dateGo) : formatDateBR(dateReturn)}</p>
                <p>Horário: <strong>{currentSelection?.hour}</strong></p>
                <p>Serviço: <strong>{currentSelection?.serviceType}</strong></p>
                <p className="mt-2 font-medium">Selecionando: <strong>{currentSide === "outbound" ? "Ida" : "Volta"}</strong></p>
            </div>

            <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded-xl">
                {tripSeats.map((seat) => {
                    const isSelected = currentSide === "outbound"
                        ? selectedSeatsOutbound.some(s => s.id === seat.id)
                        : selectedSeatsReturn.some(s => s.id === seat.id);

                    return (
                        <button
                            key={seat.id}
                            disabled={!seat.available}
                            onClick={() => toggleSeat(seat)}
                            className={`w-12 h-12 rounded-lg font-bold
                                ${!seat.available
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isSelected
                                        ? "bg-blue-500 text-white"
                                        : "bg-teal-500 text-white"
                                }`}
                        >
                            {seat.number}
                        </button>
                    );
                })}
            </div>

            <div className="text-center">
                <p className="text-lg">Total Ida: R$ {(((localOutbound?.price || outboundSelection?.price) || 0) * selectedSeatsOutbound.length).toFixed(2)}</p>
                <p className="text-lg">Total Volta: R$ {(((localReturn?.price || returnSelection?.price) || 0) * selectedSeatsReturn.length).toFixed(2)}</p>
                <p className="text-xl font-bold text-primaryLight">Total Geral: R$ {((((localOutbound?.price || outboundSelection?.price) || 0) * selectedSeatsOutbound.length)
                    + (((localReturn?.price || returnSelection?.price) || 0) * selectedSeatsReturn.length)).toFixed(2)}</p>
            </div>

            <div className="flex gap-4">
                <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
                <CentralButton onClick={handleContinue}>Continuar</CentralButton>
            </div>
        </div>
    );
}

export default SeatSelect;