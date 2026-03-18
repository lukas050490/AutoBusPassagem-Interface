import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import CentralButton from "../../components/centralButton";
import { formatDateBR } from "../../utils/formatDate";
import { useSession } from "../../hooks/useSession";
import api from "../../services/api";

function SeatSelect() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { sessionId, loading: sessionLoading } = useSession();

    const [tripSeats, setTripSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(true);
    const [reservingSeat, setReservingSeat] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());

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

    // Estados locais
    const [localOutbound, setLocalOutbound] = useState(outboundSelection || null);
    const [localReturn, setLocalReturn] = useState(returnSelection || null);
    const [selectedSeatsOutbound, setSelectedSeatsOutbound] = useState(localOutbound?.selectedSeats || []);
    const [selectedSeatsReturn, setSelectedSeatsReturn] = useState(localReturn?.selectedSeats || []);

    // Controla qual lado está sendo selecionado
    const [currentSide, setCurrentSide] = useState(() => {
        if (!localOutbound?.selectedSeats?.length) return "outbound";
        if (!onlyGo && !localReturn?.selectedSeats?.length) return "return";
        return "outbound";
    });

    // Dados da viagem de volta
    const returnTripData = {
        tripId: returnSelection?.tripId,
        hour: returnSelection?.hour,
        serviceType: returnSelection?.serviceType,
        price: returnSelection?.price,
        platform: returnSelection?.platform,
        date: dateReturn,
        origin: destination,
        destination: origin,
    };

    const currentSelection = currentSide === "return"
        ? (localReturn || returnTripData)
        : (localOutbound || outboundSelection);

    const tripId = currentSelection?.tripId;

    // Função para buscar assentos disponíveis
    const fetchSeats = useCallback(async () => {
        if (!tripId || !sessionId) {
            return;
        }

        try {
            setLoadingSeats(true);

            const response = await api.get(`/trips/${tripId}/available`, {
                params: { sessionId }
            });

            setTripSeats(response.data);
            setLastUpdate(new Date());

            // Verificar se algum assento selecionado não está mais disponível
            const currentSelected = currentSide === "outbound" ? selectedSeatsOutbound : selectedSeatsReturn;

            const unavailableSelected = currentSelected.filter(selected => {
                const seat = response.data.find(s => s.id === selected.id);
                return !seat || !seat.available;
            });

            if (unavailableSelected.length > 0) {
                setError(`Os assentos ${unavailableSelected.map(s => s.number).join(', ')} não estão mais disponíveis e foram removidos da sua seleção.`);

                // Remove os assentos indisponíveis da seleção
                if (currentSide === "outbound") {
                    setSelectedSeatsOutbound(prev =>
                        prev.filter(s => response.data.find(seat => seat.id === s.id)?.available)
                    );
                } else {
                    setSelectedSeatsReturn(prev =>
                        prev.filter(s => response.data.find(seat => seat.id === s.id)?.available)
                    );
                }
            }

        } catch (error) {
            console.error("Erro ao buscar assentos:", error);
            setError("Erro ao carregar assentos. Tente novamente.");
        } finally {
            setLoadingSeats(false);
        }
    }, [tripId, sessionId, currentSide, selectedSeatsOutbound, selectedSeatsReturn]);

    // Busca assentos quando tripId ou sessionId mudar
    useEffect(() => {
        if (sessionId && tripId) {
            fetchSeats();
        }
    }, [tripId, sessionId, fetchSeats]);

    // Configura intervalo para atualizar assentos periodicamente
    // useEffect(() => {
    //     if (!tripId || !sessionId) return;

    //      const interval = setInterval(fetchSeats, 10000); // Atualiza a cada 10 segundos

    //     return () => clearInterval(interval);
    // }, [tripId, sessionId, fetchSeats]);

    // Função para reservar/liberar assento
    const toggleSeat = async (seat) => {
        if (reservingSeat || !sessionId) return;

        // Verifica se o assento está disponível
        if (!seat.available) {
            if (seat.reservedByCurrentSession) {
                // Se está reservado pela sessão atual, permite desmarcar
                // Continua o fluxo normal
            } else {
                alert("Este assento não está disponível");
                return;
            }
        }

        const isSelected = currentSide === "outbound"
            ? selectedSeatsOutbound.some(s => s.id === seat.id)
            : selectedSeatsReturn.some(s => s.id === seat.id);

        const action = isSelected ? 'release' : 'reserve';

        try {
            setReservingSeat(true);
            setError(null);

            if (action === 'reserve') {
                await api.post(`/trips/${tripId}/seats/reserve`, {
                    seatId: seat.id,
                    sessionId
                });
            } else {
                await api.post(`/trips/${tripId}/seats/release`, {
                    seatId: seat.id,
                    sessionId
                });
            }

            // Atualiza o estado local
            if (currentSide === "outbound") {
                setSelectedSeatsOutbound((prev) => {
                    if (action === 'release') {
                        return prev.filter(s => s.id !== seat.id);
                    } else {
                        return [...prev, { id: seat.id, number: seat.seat_number }];
                    }
                });
            } else {
                setSelectedSeatsReturn((prev) => {
                    if (action === 'release') {
                        return prev.filter(s => s.id !== seat.id);
                    } else {
                        return [...prev, { id: seat.id, number: seat.seat_number }];
                    }
                });
            }
            
            // Atualiza a lista de assentos
            await fetchSeats();

        } catch (error) {
            console.error(`Erro ao ${action} assento:`, error);

            let errorMessage = `Erro ao ${action === 'reserve' ? 'reservar' : 'liberar'} assento. `;

            if (error.response?.status === 409) {
                if (error.response.data.code === 'SEAT_SOLD') {
                    errorMessage = "Este assento já foi vendido.";
                } else {
                    errorMessage = "Este assento foi reservado por outro usuário. Por favor, escolha outro.";
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            setError(errorMessage);
            await fetchSeats(); // Recarrega para garantir consistência
        } finally {
            setReservingSeat(false);
        }
    };

    // Função para confirmar reservas e prosseguir
    const handleContinue = async () => {
        if (!sessionId) return;

        const activeSelected = currentSide === "outbound" ? selectedSeatsOutbound : selectedSeatsReturn;

        if (activeSelected.length === 0) {
            alert("Selecione pelo menos um assento");
            return;
        }

        try {
            setReservingSeat(true);
            setError(null);

            // Confirma as reservas
            await api.post(`/trips/${tripId}/seats/confirm`, {
                seatIds: activeSelected.map(s => s.id),
                sessionId
            });

            if (currentSide === "outbound") {
                const updatedOutbound = {
                    ...(localOutbound || outboundSelection),
                    tripId: currentSelection.tripId,
                    selectedSeats: selectedSeatsOutbound.map(seat => ({
                        id: seat.id,
                        number: seat.number // 👈 Garanta que está aqui
                    })),
                    totalPrice:
                        (localOutbound?.price || outboundSelection?.price || 0) *
                        selectedSeatsOutbound.length,
                };

                setLocalOutbound(updatedOutbound);

                if (dateReturn && !onlyGo) {
                    setCurrentSide("return");
                    setReservingSeat(false);
                    return;
                }

                const nextState = {
                    ...state,
                    outboundSelection: updatedOutbound,
                    returnSelection: localReturn,
                    sessionId,
                };

                navigate("/identificacao", { state: nextState });
                return;
            }

            // currentSide === 'return'
            const updatedReturn = {
                ...(localReturn || returnSelection),
                tripId: returnSelection?.tripId,
                selectedSeats: selectedSeatsReturn.map(seat => ({
                    id: seat.id,
                    number: seat.number // 👈 Garanta que está aqui
                })),
                totalPrice:
                    (localReturn?.price || returnSelection?.price || 0) *
                    selectedSeatsReturn.length,
            };

            setLocalReturn(updatedReturn);

            const nextState = {
                ...state,
                outboundSelection: localOutbound || outboundSelection,
                returnSelection: updatedReturn,
                sessionId
            };

            navigate("/identificacao", { state: nextState });

        } catch (error) {
            console.error("Erro ao confirmar assentos:", error);

            if (error.response?.status === 409) {
                setError("Alguns assentos selecionados não estão mais disponíveis. Por favor, revise sua seleção.");
                await fetchSeats();
            } else {
                setError("Erro ao confirmar assentos. Tente novamente.");
            }
        } finally {
            setReservingSeat(false);
        }
    };

    if (sessionLoading || (loadingSeats && tripSeats.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl mb-2">Carregando...</p>
                    <p className="text-sm text-gray-600">Preparando seleção de assentos</p>
                </div>
            </div>
        );
    }

    if (!currentSelection) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-600">Dados da viagem não encontrados</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center gap-8 p-10 bg-linear-to-b from-white to-teal-400">
            <h1 className="text-4xl font-bold text-primaryLight">
                Escolha seus assentos
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-2xl">
                    <span className="block sm:inline">{error}</span>
                    <button
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setError(null)}
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )}

            <div className="text-center text-primaryMid">
                <p><strong>{companyName}</strong></p>
                <p>{currentSide === "outbound" ? origin : destination} → {currentSide === "outbound" ? destination : origin}</p>
                <p>Data: {currentSide === "outbound" ? formatDateBR(dateGo) : formatDateBR(dateReturn)}</p>
                <p>Horário: <strong>{currentSelection?.hour}</strong></p>
                <p>Serviço: <strong>{currentSelection?.serviceType}</strong></p>
                <p className="mt-2 font-medium">Selecionando: <strong>{currentSide === "outbound" ? "Ida" : "Volta"}</strong></p>
            </div>

            {/* Legenda */}
            <div className="flex gap-6 text-sm flex-wrap justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-500 rounded"></div>
                    <span>Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Sua seleção</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Reservado (outro usuário)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Vendido</span>
                </div>
            </div>

            {/* Info de atualização */}
            <div className="text-sm text-gray-600">
                <p>Última atualização: {lastUpdate.toLocaleTimeString()}</p>
                <p>Você tem 15 minutos para completar a reserva</p>
            </div>

            <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded-xl">
                {tripSeats.map((seat) => {
                    const isSelected = currentSide === "outbound"
                        ? selectedSeatsOutbound.some(s => s.id === seat.id)
                        : selectedSeatsReturn.some(s => s.id === seat.id);

                    // Determina a cor do botão
                    let buttonColor = "bg-teal-500"; // disponível
                    let isDisabled = false;

                    if (seat.status === 'sold') {
                        buttonColor = "bg-gray-400";
                        isDisabled = true;
                    } else if (seat.status === 'reserved' && !seat.reservedByCurrentSession) {
                        buttonColor = "bg-yellow-500";
                        isDisabled = true;
                    } else if (isSelected || seat.reservedByCurrentSession) {
                        buttonColor = "bg-blue-500";
                    }

                    return (
                        <button
                            key={seat.id}
                            disabled={isDisabled || reservingSeat}
                            onClick={() => toggleSeat(seat)}
                            className={`w-12 h-12 rounded-lg font-bold text-white
                                ${buttonColor}
                                ${reservingSeat ? 'opacity-50 cursor-wait' : ''}
                                ${!isDisabled ? 'hover:opacity-90' : ''}
                                transition-all
                                relative
                            `}
                            title={seat.reservedUntil
                                ? `Reservado até: ${new Date(seat.reservedUntil).toLocaleTimeString()}`
                                : seat.status === 'sold'
                                    ? 'Assento vendido'
                                    : ''
                            }
                        >
                            {seat.seat_number}
                            {seat.reservedByCurrentSession && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="text-center">
                <p className="text-lg">Total Ida: R$ {(((localOutbound?.price || outboundSelection?.price) || 0) * selectedSeatsOutbound.length).toFixed(2)}</p>
                {!onlyGo && (
                    <p className="text-lg">Total Volta: R$ {(((localReturn?.price || returnSelection?.price) || 0) * selectedSeatsReturn.length).toFixed(2)}</p>
                )}
                <p className="text-xl font-bold text-primaryLight">
                    Total Geral: R$ {(
                        (((localOutbound?.price || outboundSelection?.price) || 0) * selectedSeatsOutbound.length) +
                        (((localReturn?.price || returnSelection?.price) || 0) * selectedSeatsReturn.length)
                    ).toFixed(2)}
                </p>
            </div>

            <div className="flex gap-4">
                <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
                <CentralButton
                    onClick={handleContinue}
                    disabled={reservingSeat}
                >
                    {reservingSeat ? 'Processando...' : 'Continuar'}
                </CentralButton>
            </div>
        </div>
    );
}

export default SeatSelect;