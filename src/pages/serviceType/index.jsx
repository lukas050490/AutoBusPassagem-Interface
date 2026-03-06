import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CentralButton from "../../components/centralButton";
import ServiceCard from "../../components/serviceCard";


function ServiceType() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { outboundSelection, returnSelection } = state || {};


  const [localOutbound, setLocalOutbound] = useState(outboundSelection || null);
  const [localReturn, setLocalReturn] = useState(returnSelection || null);

  const [currentSide, setCurrentSide] = useState(
    localOutbound && !localOutbound.confirmed
      ? "outbound"
      : localReturn && !localReturn.confirmed
        ? "return"
        : "outbound"
  );

  const currentTrip = currentSide === "outbound" ? localOutbound : localReturn;

  const serviceType = currentTrip?.serviceType;
  const price = Number(currentTrip?.price || 0);


  function handleContinue() {
    if (!currentTrip) return;

    const updatedTrip = {
      ...currentTrip,
      confirmed: true,
    };

    if (currentSide === "outbound") {
      setLocalOutbound(updatedTrip);

      if (localReturn) {
        setCurrentSide("return");
        return;
      }

      setLocalReturn(updatedTrip);

      navigate("/assentos-disponiveis", {
        state: {
          ...state,
          outboundSelection: updatedTrip,
          returnSelection: localReturn,
        },
      });

      return;
    }

    // VOLTA
    setLocalReturn(updatedTrip);
    navigate("/assentos-disponiveis", {
      state: {
        ...state,
        outboundSelection: localOutbound,
        returnSelection: updatedTrip,
      },
    });
  }

  function formatServiceLabel(type) {
    switch (type) {
      case "CONVENCIONAL":
        return "Convencional";
      case "SEMI_LEITO":
        return "Semi-Leito";
      case "LEITO":
        return "Leito";
      default:
        return type;
    }
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-10"
      style={{
        backgroundImage: `
          radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
        `,
        backgroundSize: "100% 100%",
      }}
    >
      <h1 className="text-4xl font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">
        Serviço - {currentSide === "outbound" ? "Ida" : "Volta"}
      </h1>

      {currentTrip && (
        <div className="flex gap-6">
          <ServiceCard
            label={formatServiceLabel(serviceType)}
            price={`R$ ${price.toFixed(2)}`}
            selected={true}
          />
        </div>
      )}

      <div className="flex gap-4">
        <CentralButton onClick={() => navigate(-1)}>
          Voltar
        </CentralButton>

        <CentralButton onClick={handleContinue}>
          Continuar
        </CentralButton>
      </div>
    </div>
  );
}

export default ServiceType;
