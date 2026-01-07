import { useLocation, useNavigate } from "react-router-dom";
import CentralButton from "../../components/centralButton";
import ButtonHours from "../../components/ButtonHours";
import { hoursMock } from "../../data/hoursMock";
import { formatDateBR } from "../../utils/formatDate";

function HoursAvailable() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const {
        companyId,
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

    const availableHours = hoursMock.filter(
        (item) =>
            item.companyId === companyId &&
            item.origin === currentOrigin &&
            item.destination === currentDestination &&
            item.date === currentDate
    );


    function handleSelectHour(hour) {
        // 1️⃣ Escolha da IDA (e existe volta)
        if (!onlyGo && !isReturn) {
            navigate("/horario-disponivel", {
                state: {
                    ...state,
                    isReturn: true,
                    outboundSelection: {
                        tripId: hour.id,
                        hour: hour.hour,
                        platform: hour.platform,
                    },
                },
            });
            return;
        }

        // 2️⃣ Já escolheu a volta → próxima tela
        if (isReturn) {
            navigate("/tipo-de-servico", {
                state: {
                    ...state,
                    outboundSelection: state.outboundSelection,
                    returnSelection: {
                        tripId: hour.id,
                        hour: hour.hour,
                        platform: hour.platform,
                    },
                },
            });
            return;
        }

        // 3️⃣ Só ida → próxima tela
        navigate("/tipo-de-servico", {
            state: {
                ...state,
                outboundSelection: {
                    tripId: hour.id,
                    hour: hour.hour,
                    platform: hour.platform,
                },
                returnSelection: null,
            },
        });
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
                    <h1 className=" text-4xl font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text"
                    >{isReturn ? "HORÁRIOS DE VOLTA" : "HORÁRIOS DE IDA"}</h1>
                    <p className="text-primaryLight text-2xl">
                        {currentOrigin} → {currentDestination}
                    </p>
                    <p className="text-primaryLight text-xl">
                        {formatDateBR(currentDate)}
                    </p>
                </div>
                <div className="flex flex-wrap gap-4  max-w-xl mx-auto">
                    {availableHours.length === 0 && (
                        <p className="text-primaryMid">
                            Nenhum horário disponível para esta data.
                        </p>
                    )}
                    {availableHours.map((hour) => (
                        <ButtonHours
                            key={hour.id}
                            hour={hour.hour}
                            platform={hour.platform}
                            disabled={hour.availableSeats === 0}
                            onClick={() => handleSelectHour(hour)}
                        />
                    ))}
                </div>

                <div className="flex gap-4">
                    <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
                </div>
            </div>
        </>
    )
}
export default HoursAvailable;