import { useLocation, useNavigate } from "react-router-dom";
import CentralButton from "../../components/centralButton";
import { formatDateBR } from "../../utils/formatDate";


function SummaryBuy() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const {
        companyName,
        origin,
        destination,
        dateGo,
        dateReturn,
        hour,
        selectedSeats,
        serviceType,
        passenger,
        outboundSelection,
        returnSelection,
    } = state || {};
    console.log(state)

    const SERVICE_PRICES = {
        convencional: 80,
        "semi-leito": 120,
        leito: 160,
    };

    const BOARDING_FEE = 6.5;

    const outbound = {
        origin: outboundSelection?.origin || origin,
        destination: outboundSelection?.destination || destination,
        dateGo: outboundSelection?.dateGo || outboundSelection?.date || dateGo,
        hour: outboundSelection?.hour || hour,
        platform: outboundSelection?.platform || undefined,
        serviceType: outboundSelection?.serviceType || serviceType,
        selectedSeats: outboundSelection?.selectedSeats || selectedSeats || [],
    };

    const outboundCount = outbound.selectedSeats?.length || 0;
    const outboundFare = SERVICE_PRICES[outbound.serviceType] || 0;
    const outboundTotal = outboundFare * outboundCount;

    let returnTotal = 0;
    let returnCount = 0;
    let returnFare = 0;

    if (returnSelection) {
        returnCount = returnSelection.selectedSeats?.length || 0;
        returnFare = SERVICE_PRICES[returnSelection.serviceType] || 0;
        returnTotal = returnFare * returnCount;
    }

    const totalFare = outboundTotal + returnTotal;
    const total = totalFare + BOARDING_FEE;

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-start p-10 overflow-auto"
            style={{
                backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
                backgroundSize: "100% 100%",
            }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl flex flex-col gap-4">
                <h1 className=" text-4xl text-center font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">Resumo da Compra</h1>

                <ResumoItem label="Empresa" value={companyName || ""} />
                <ResumoItem label="CPF Cliente" value={passenger.cpf || ""} />

                <div className="border-t pt-4 mt-4">
                    <h2 className="font-bold text-primaryLight mb-2">IDA</h2>
                    <ResumoItem label="Origem" value={outbound.origin || ""} />
                    <ResumoItem label="Destino" value={outbound.destination || ""} />
                    <ResumoItem label="Data / Hora" value={`${formatDateBR(outbound.dateGo)}${outbound.hour ? ` - ${outbound.hour}` : ""}`} />
                    <ResumoItem label="Plataforma" value={outbound.platform || ""} />
                    <ResumoItem label="Poltrona(s)" value={(outbound.selectedSeats || []).join(", ")} />
                    <ResumoItem label="Serviço" value={outbound.serviceType || ""} />
                    <ResumoItem label="Tarifa" value={`R$ ${outboundFare.toFixed(2)} × ${outboundCount}`} />
                    <ResumoItem label="Subtotal Ida" value={`R$ ${outboundTotal.toFixed(2)}`} />
                </div>

                {returnSelection && (
                    <div className="border-t pt-4 mt-4">
                        <h2 className="font-bold text-primaryLight mb-2">VOLTA</h2>
                        <ResumoItem label="Origem" value={returnSelection.origin || destination || ""} />
                        <ResumoItem label="Destino" value={returnSelection.destination || origin || ""} />
                        <ResumoItem label="Data / Hora" value={`${formatDateBR(returnSelection.dateGo || returnSelection.date || dateReturn)}${returnSelection.hour ? ` - ${returnSelection.hour}` : ""}`} />
                        <ResumoItem label="Plataforma" value={returnSelection.platform || ""} />
                        <ResumoItem label="Poltrona(s)" value={(returnSelection.selectedSeats || []).join(", ")} />
                        <ResumoItem label="Serviço" value={returnSelection.serviceType || ""} />
                        <ResumoItem label="Tarifa" value={`R$ ${returnFare.toFixed(2)} × ${returnCount}`} />
                        <ResumoItem label="Subtotal Volta" value={`R$ ${returnTotal.toFixed(2)}`} />
                    </div>
                )}

                <ResumoItem label="Taxa de embarque" value={`R$ ${BOARDING_FEE.toFixed(2)}`} />

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total a pagar</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>

                <div className="flex gap-4 justify-center mt-6">
                    <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
                    <CentralButton
                        onClick={() =>
                            navigate("/pagamento", {
                                state: {
                                    ...state,
                                    total,
                                    outboundSelection,
                                    returnSelection,
                                },
                            })
                        }
                    >
                        Confirmar Compra
                    </CentralButton>
                </div>
            </div>
        </div>
    );
}

function ResumoItem({ label, value }) {
    return (
        <div className="flex justify-between text-primaryMid">
            <span className="font-semibold">{label}</span>
            <span>{value}</span>
        </div>
    );
}

export default SummaryBuy;
