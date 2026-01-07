import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CentralButton from "../../components/centralButton";
import { seatsMock } from "../../data/seatsMock";
import { formatDateBR } from "../../utils/formatDate";
function SeatSelect() {
    const navigate = useNavigate();
    const { state } = useLocation();
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

    // allow selecting outbound then return on same screen
    const [localOutbound, setLocalOutbound] = useState(outboundSelection || null);
    const [localReturn, setLocalReturn] = useState(returnSelection || null);

    // Sempre começa pela ida, depois pela volta
    const initialSide = !localOutbound || !localOutbound.selectedSeats ? "outbound" : !localReturn || !localReturn.selectedSeats ? "return" : "outbound";
    const [currentSide, setCurrentSide] = useState(initialSide);

    const [selectedSeatsOutbound, setSelectedSeatsOutbound] = useState(localOutbound?.selectedSeats || []);
    const [selectedSeatsReturn, setSelectedSeatsReturn] = useState(localReturn?.selectedSeats || []);

    const currentSelection = currentSide === "return" ? (localReturn || returnSelection) : (localOutbound || outboundSelection);

    if (!currentSelection) {
        return <p>Dados da viagem não encontrados</p>;
    }

    const tripId = currentSelection.tripId;
    const hour = currentSelection.hour;

    const tripSeats =
        seatsMock.find((t) => t.tripId === Number(tripId)) ||
        // fallback: generate default seats if mock doesn't have this tripId
        {
            tripId: Number(tripId),
            seats: Array.from({ length: 40 }, (_, i) => ({
                number: i + 1,
                available: true,
            })),
        };

    function toggleSeat(seatNumber) {
        if (currentSide === "outbound") {
            setSelectedSeatsOutbound((prev) =>
                prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
            );
        } else {
            setSelectedSeatsReturn((prev) =>
                prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
            );
        }
    }

    function handleContinue() {
        const activeSelected = currentSide === "outbound" ? selectedSeatsOutbound : selectedSeatsReturn;

        if (activeSelected.length === 0) {
            alert("Selecione pelo menos um assento");
            return;
        }

        if (currentSide === "outbound") {
            const updatedOutbound = { ...(localOutbound || outboundSelection), selectedSeats: selectedSeatsOutbound, totalPrice: (localOutbound?.basePrice || outboundSelection?.basePrice || 0) * selectedSeatsOutbound.length };
            setLocalOutbound(updatedOutbound);

            // if there's a return to choose, switch to it
            if (dateReturn && !onlyGo) {
                setCurrentSide("return");
                return;
            }

            // no return -> proceed
            const nextState = { ...state, outboundSelection: updatedOutbound, returnSelection: localReturn };
            navigate("/identificacao", { state: nextState });
            return;
        }

        // currentSide === 'return'
        const updatedReturn = { ...(localReturn || returnSelection), selectedSeats: selectedSeatsReturn, totalPrice: (localReturn?.basePrice || returnSelection?.basePrice || 0) * selectedSeatsReturn.length };
        setLocalReturn(updatedReturn);

        const nextState = { ...state, outboundSelection: localOutbound || outboundSelection, returnSelection: updatedReturn };
        navigate("/identificacao", { state: nextState });
    }

    return (
        <div className="min-h-screen flex flex-col items-center gap-8 p-10 bg-linear-to-b from-white to-teal-400">
            <h1 className="text-4xl font-bold text-primaryLight">
                Escolha seus assentos
            </h1>

            <div className="text-center text-primaryMid">
                <p><strong>{companyName}</strong></p>
                <p>{origin} → {destination}</p>
                <p>Data: {currentSide === "outbound" ? formatDateBR(dateGo) : formatDateBR(dateReturn)}</p>
                <p>Horário: <strong>{hour}</strong></p>
                <p>Serviço: <strong>{currentSelection.serviceType}</strong></p>
                <p className="mt-2 font-medium">Selecionando: <strong>{currentSide === "outbound" ? "Ida" : "Volta"}</strong></p>
            </div>

            <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded-xl">
                {tripSeats.seats.map((seat) => {
                    const isSelected = currentSide === "outbound" ? selectedSeatsOutbound.includes(seat.number) : selectedSeatsReturn.includes(seat.number);

                    return (
                        <button
                            key={seat.number}
                            disabled={!seat.available}
                            onClick={() => toggleSeat(seat.number)}
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
                <p className="text-lg">Total Ida: R$ {(((localOutbound?.basePrice || outboundSelection?.basePrice) || 0) * selectedSeatsOutbound.length).toFixed(2)}</p>
                <p className="text-lg">Total Volta: R$ {(((localReturn?.basePrice || returnSelection?.basePrice) || 0) * selectedSeatsReturn.length).toFixed(2)}</p>
                <p className="text-xl font-bold text-primaryLight">Total Geral: R$ {((((localOutbound?.basePrice || outboundSelection?.basePrice) || 0) * selectedSeatsOutbound.length) + (((localReturn?.basePrice || returnSelection?.basePrice) || 0) * selectedSeatsReturn.length)).toFixed(2)}</p>
            </div>

            <div className="flex gap-4">
                <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
                <CentralButton onClick={handleContinue}>Continuar</CentralButton>
            </div>
        </div>
    );
}

export default SeatSelect;
