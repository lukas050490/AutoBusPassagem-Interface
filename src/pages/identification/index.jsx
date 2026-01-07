import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CentralButton from "../../components/centralButton";

function Identification() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [cpf, setCpf] = useState("");
    const [error, setError] = useState("");

    const { outboundSelection, returnSelection, companyName, origin, destination, dateGo, dateReturn } = state || {};

    if (!outboundSelection) {
        return <p>Dados da viagem não encontrados</p>;
    }

    function selectionTotal(sel) {
        if (!sel) return 0;
        if (typeof sel.totalPrice === 'number') return sel.totalPrice;
        if (sel.basePrice && sel.selectedSeats) return sel.basePrice * sel.selectedSeats.length;
        return 0;
    }

    const outbound = outboundSelection;
    const retorno = returnSelection;
    const outboundTotal = selectionTotal(outbound);
    const returnTotal = selectionTotal(retorno);
    const grandTotal = outboundTotal + returnTotal;

    function maskCPF(value) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            .slice(0, 14);
    }

    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let sum = 0;
        let rest;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf[i - 1]) * (11 - i);
        }

        rest = (sum * 10) % 11;
        if (rest === 10) rest = 0;
        if (rest !== parseInt(cpf[9])) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf[i - 1]) * (12 - i);
        }

        rest = (sum * 10) % 11;
        if (rest === 10) rest = 0;

        return rest === parseInt(cpf[10]);
    }

    function handleContinue() {
        if (!cpf) {
            setError("Informe o CPF");
            return;
        }

        if (!isValidCPF(cpf)) {
            setError("CPF inválido");
            return;
        }

        navigate("/resumo-da-compra", {
            state: {
                ...state,
                passenger: {
                    cpf,
                },
            },
        });
    }

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-10 bg-linear-to-b from-teal-400 to-white">
            <h1 className="text-4xl font-bold text-primaryLight">
                Dados do Passageiro
            </h1>

            <div className="text-center text-primaryMid">
                <p><strong>{companyName}</strong></p>
                <p>{origin} → {destination}</p>
                <h3 className="font-bold mt-2">Ida</h3>
                <p>Data: {outbound.date || dateGo}</p>
                <p>Horário: <strong>{outbound.hour}</strong></p>
                <p>Serviço: <strong>{outbound.serviceType}</strong></p>
                <p>Assentos: <strong>{outbound.selectedSeats?.join(', ')}</strong></p>
                <p className="font-bold">Subtotal Ida: R$ {outboundTotal}</p>

                {retorno && (
                    <>
                        <h3 className="font-bold mt-4">Volta</h3>
                        <p>Data: {retorno.date || dateReturn}</p>
                        <p>Horário: <strong>{retorno.hour}</strong></p>
                        <p>Serviço: <strong>{retorno.serviceType}</strong></p>
                        <p>Assentos: <strong>{retorno.selectedSeats?.join(', ')}</strong></p>
                        <p className="font-bold">Subtotal Volta: R$ {returnTotal}</p>
                    </>
                )}

                <p className="font-bold mt-4">Total Geral: R$ {grandTotal}</p>
            </div>

            <div className="flex flex-col gap-2 w-80">
                <label className="font-bold text-primaryMid">CPF</label>
                <input
                    type="text"
                    value={cpf}
                    onChange={(e) => {
                        setCpf(maskCPF(e.target.value));
                        setError("");
                    }}
                    placeholder="000.000.000-00"
                    className="h-12 border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primaryLight"
                />
                {error && <span className="text-red-500">{error}</span>}
            </div>

            <div className="flex gap-4">
                <CentralButton onClick={() => navigate(-1)}>Voltar</CentralButton>
                <CentralButton onClick={handleContinue}>Continuar</CentralButton>
            </div>
        </div>
    );
}

export default Identification;
