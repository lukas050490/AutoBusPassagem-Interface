import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CentralButton from "../../components/centralButton";
import PaymentCard from "../../components/paymentCards";

function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state) {
            navigate("/");
        }
    }, [state, navigate]);

    const { total } = state || {};

    const [paymentMethod, setPaymentMethod] = useState("");
    const [processing, setProcessing] = useState(false);

    function handlePay() {
        if (!paymentMethod) {
            alert("Selecione a forma de pagamento");
            return;
        }

        setProcessing(true);

        // simulação de processamento
        setTimeout(() => {
            navigate("/confirmacao", {
                state: {
                    ...state,
                    paymentMethod,
                    paymentStatus: "paid",
                },
            });
        }, 2000);
    }

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-10 "
            style={{
                backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
                     `,
                backgroundSize: "100% 100%",
            }}
        >
            <h1 className=" text-4xl text-center font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">
                Forma de Pagamento
            </h1>

            <p className="text-xl font-semibold">
                Total a pagar: R$ {total?.toFixed(2) || "0.00"}
            </p>

            <div className="flex gap-8">
                <PaymentCard
                    title="Cartao"
                    description="Insira ou aproxime o cartão"
                    selected={paymentMethod === "card"}
                    onClick={() => setPaymentMethod("card")}
                />

                <PaymentCard
                    title="PIX"
                    description="Escaneie o QR Code"
                    selected={paymentMethod === "pix"}
                    onClick={() => setPaymentMethod("pix")}
                />
            </div>

            <div className="flex gap-4">
                <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
                <CentralButton onClick={handlePay} disabled={processing}>
                    {processing ? "Processando..." : "Pagar"}
                </CentralButton>
            </div>
        </div>
    );
}



export default Payment;
