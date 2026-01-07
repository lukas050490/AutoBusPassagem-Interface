import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PaymentCard from "../../components/paymentCards";
import CentralButton from "../../components/centralButton";


function Confirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { paymentMethod, paymentStatus } = state || {};

  useEffect(() => {
    if (!state || paymentStatus !== "paid") {
      navigate("/");
    }
  }, [state, paymentStatus, navigate]);


  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gray-100"
        style={{
          backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
                     `,
          backgroundSize: "100% 100%",
        }}
      >
        <h1 className=" text-4xl text-center font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">PAGAMENTO CONFIRMADO!</h1>
        <h3 className="text-lg text-gray-600">SUA COMPRA FOI CONCLUIDA COM SUCESSO!</h3>
        <div className="flex gap-10">
          <PaymentCard
            title="Cartão"
            description="Pagamento realizado com sucesso"
            selected={paymentMethod === "card"}
            mode="confirm"
          />

          <PaymentCard
            title="PIX"
            description="Pagamento realizado com sucesso"
            selected={paymentMethod === "pix"}
            mode="confirm"
          />

        </div>
        <p className="text-lg text-gray-600">RETIRE SUA PASSAGEM NA ABERTURA.</p>
        <CentralButton onClick={() => navigate("/")}>
          Voltar ao inicio
        </CentralButton>
      </div>
    </>
  )
}

export default Confirmation;