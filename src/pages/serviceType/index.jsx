import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CentralButton from "../../components/centralButton";
import ServiceCard from "../../components/serviceCard";

function ServiceType() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { outboundSelection, returnSelection } = state || {};

  // local copies so user can choose ida then volta on same screen
  const [localOutbound, setLocalOutbound] = useState(outboundSelection || null);
  const [localReturn, setLocalReturn] = useState(returnSelection || null);

  // determine which side the user should choose first
  const initialSide = localOutbound && !localOutbound.serviceType ? "outbound" : localReturn && !localReturn.serviceType ? "return" : "outbound";
  const [currentSide, setCurrentSide] = useState(initialSide);

  const [serviceType, setServiceType] = useState(
    currentSide === "outbound" ? (localOutbound?.serviceType || "") : (localReturn?.serviceType || "")
  );


  const SERVICE_PRICES = {
    convencional: 80,
    "semi-leito": 120,
    leito: 160,
  };

  function handleContinue() {
    if (!serviceType) {
      alert("Selecione o tipo de serviço");
      return;
    }

    const basePrice = SERVICE_PRICES[serviceType];

    if (currentSide === "outbound") {
      const updatedOutbound = { ...(localOutbound || outboundSelection), serviceType, basePrice };
      setLocalOutbound(updatedOutbound);

      // if there is a return to choose, switch to it
      if (localReturn) {
        setCurrentSide("return");
        setServiceType(localReturn.serviceType || "");
        return;
      }

      // no return -> proceed to seats
      const nextState = { ...state, outboundSelection: updatedOutbound, returnSelection: localReturn };
      navigate("/assentos-disponiveis", { state: nextState });
      return;
    }

    // currentSide === 'return'
    const updatedReturn = { ...(localReturn || returnSelection), serviceType, basePrice };
    setLocalReturn(updatedReturn);

    // both chosen -> proceed to seats
    const nextState = { ...state, outboundSelection: localOutbound || outboundSelection, returnSelection: updatedReturn };
    navigate("/assentos-disponiveis", { state: nextState });


  }



  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-10"
      style={{
        backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
                     `,
        backgroundSize: "100% 100%",
      }}
    >
      <h1 className=" text-4xl font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">
        Tipo de Serviço - {currentSide === "outbound" ? "Ida" : "Volta"}
      </h1>

      <div className="flex gap-6">
        <ServiceCard
          label="Convencional"
          price="R$ 80,00"
          selected={serviceType === "convencional"}
          onClick={() => setServiceType("convencional")}
        />

        <ServiceCard
          label="Semi-leito"
          price="R$ 120,00"
          selected={serviceType === "semi-leito"}
          onClick={() => setServiceType("semi-leito")}
        />

        <ServiceCard
          label="Leito"
          price="R$ 160,00"
          selected={serviceType === "leito"}
          onClick={() => setServiceType("leito")}
        />
      </div>

      <div className="flex gap-4">
        <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
        <CentralButton onClick={handleContinue}>Continuar</CentralButton>
      </div>
    </div>
  );
}


export default ServiceType;
