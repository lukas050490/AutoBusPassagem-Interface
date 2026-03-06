import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CentralButton from "../../components/centralButton";
import ButtonHours from "../../components/ButtonHours";
import api from "../../services/api";
import { formatDateBR } from "../../utils/formatDate";

function HoursAvailable() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const {
        companyId,
        companyName,
        origin,
        destination,
        dateGo,
        dateReturn,
        onlyGo,
        isReturn = false,
    } = state || {};

    const currentOrigin = isReturn ? destination : origin;
    const currentDestination = isReturn ? origin : destination;
    const currentDate = isReturn ? dateReturn : dateGo;

    const [availableHours, setAvailableHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHours = async () => {
            try {
                setLoading(true);

                const response = await api.get('/auth/trips/available-times', {
                    params: {
                        companyId,
                        origin: currentOrigin,
                        destination: currentDestination,
                        date: currentDate,
                    },
                    timeout: 120000,
                });

                // Formatar a hora corretamente
                const transformedData = response.data.map(item => {
                    const departureDate = new Date(item.departure_time);
                    const hours = String(departureDate.getUTCHours()).padStart(2, '0');
                    const minutes = String(departureDate.getUTCMinutes()).padStart(2, '0');
                    const formattedHour = `${hours}:${minutes}`;

                    return {
                        id: item.id,
                        hour: formattedHour,
                        fullDateTime: item.departure_time,
                        availableSeats: item.available_seats,
                        platform: item.platform || 'A',
                        price: item.price,
                        serviceType: item.service_type,
                    };
                });

                console.log("Horários formatados:", transformedData);
                setAvailableHours(transformedData);
            } catch (error) {
                if (error.code === 'ECONNABORTED') {
                    setError('Requisição expirou. O servidor está demorando muito para responder.');
                } else if (error.response) {
                    setError(`Erro do servidor: ${error.response.status}`);
                } else if (error.request) {
                    setError('Nenhuma resposta do servidor');
                } else {
                    setError(error.message || 'Erro desconhecido');
                }
            } finally {
                setLoading(false);
            }
        };

        if (companyId && currentOrigin && currentDestination && currentDate) {
            fetchHours();
        }

    }, [companyId, isReturn, currentOrigin, currentDestination, currentDate]);

    function handleSelectHour(hour) {
        console.log("Horário selecionado:", hour);

        // Escolha da IDA (e existe volta)
        if (!onlyGo && !isReturn) {
            navigate("/horario-disponivel", {
                state: {
                    ...state,
                    isReturn: true,
                    outboundSelection: {
                        tripId: hour.id,
                        hour: hour.hour,
                        fullDateTime: hour.fullDateTime,
                        platform: hour.platform,
                        serviceType: hour.serviceType,
                        price: hour.price,
                        origin: origin,
                        destination: destination,
                        date: dateGo,
                    },
                },
            });
            return;
        }

        // Já escolheu a volta → próxima tela
        if (isReturn) {
            const returnData = {
                tripId: hour.id,
                hour: hour.hour,
                fullDateTime: hour.fullDateTime,
                platform: hour.platform,
                serviceType: hour.serviceType,
                price: hour.price,
                origin: destination,
                destination: origin,
                date: dateReturn,
            };

            console.log("ReturnData:", returnData);

            navigate("/tipo-de-servico", {
                state: {
                    ...state,
                    outboundSelection: state.outboundSelection,
                    returnSelection: returnData,
                },
            });
            return;
        }

        // Só ida → próxima tela
        navigate("/tipo-de-servico", {
            state: {
                ...state,
                outboundSelection: {
                    tripId: hour.id,
                    hour: hour.hour,
                    fullDateTime: hour.fullDateTime,
                    platform: hour.platform,
                    serviceType: hour.serviceType,
                    price: hour.price,
                    origin: origin,
                    destination: destination,
                    date: dateGo,
                },
                returnSelection: null,
            },
        });
    }

    function handleBack() {
        if (isReturn) {

            navigate("/horario-disponivel", {
                state: {
                    ...state,
                    isReturn: false,

                }
            });
        } else {

            navigate("/destino-data", {
                state: {
                    companyId,
                    companyName,
                    origin,
                    destination,
                    dateGo,
                    dateReturn,
                    onlyGo
                }
            });
        }
    }

    return (
        <>
            <div className="absolute inset-0 z-0 flex flex-col gap-10 p-10 items-center justify-center"
                style={{
                    backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
                     `,
                    backgroundSize: "100% 100%",
                }}
            >
                <div>
                    <h1 className="text-4xl font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text"
                    >{isReturn ? "HORÁRIOS DE VOLTA" : "HORÁRIOS DE IDA"}</h1>
                    <p className="text-primaryLight text-2xl">
                        {currentOrigin} → {currentDestination}
                    </p>
                    <p className="text-primaryLight text-xl">
                        {formatDateBR(currentDate)}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 max-w-xl mx-auto">
                    {loading ? (
                        <p className="text-lg text-gray-700">Carregando horários...</p>
                    ) : availableHours.length === 0 ? (
                        <p className="text-primaryMid">
                            Nenhum horário disponível para esta data.
                        </p>
                    ) : (
                        availableHours.map((hour) => (
                            <ButtonHours
                                key={hour.id}
                                hour={hour.hour}
                                platform={hour.platform}
                                disabled={hour.availableSeats === 0}
                                onClick={() => handleSelectHour(hour)}
                            />
                        ))
                    )}
                    {error && <p className="text-red-500">Erro ao carregar horários: {error}</p>}
                </div>

                <div className="flex gap-4">
                    <CentralButton onClick={handleBack}>Voltar</CentralButton>
                </div>
            </div>
        </>
    )
}

export default HoursAvailable;