import { useNavigate } from 'react-router-dom';
import CentralButton from "../../components/centralButton";
import { GiEagleEmblem } from "react-icons/gi";
import { GiThreeLeaves } from "react-icons/gi";
import { TbTrain } from "react-icons/tb";
import { FaRegSun } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { MdOutlineRealEstateAgent } from "react-icons/md";

function Companies() {
    const navigate = useNavigate();

    return (
        <>
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-10 p-10"
                style={{
                    backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
                     `,
                    backgroundSize: "100% 100%",
                }}
            >
                {/* <h1 className="text-4xl text-primaryLight font-bold">ESCOLHA A EMPRESA</h1> */}
                <h1 className=" text-4xl font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">ESCOLHA A EMPRESA</h1>
                <div className=" grid grid-cols-3 gap-20 ">
                    <div className="flex flex-col items-center justify-center w-40 h-32 border-secondaryLight border-2 shadow-2xl shadow-primaryLight rounded-lg p-4 hover:scale-105 hover:shadow-lg hover:shadow-primaryLight transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("/destino-e-data", { state: { companyId: "aguia", companyName: "Águia Turismo" } })}
                    >
                        <GiEagleEmblem className="text-blue-600 text-4xl" />
                        <p className=" font-bold text-primaryMid">Águia Turismo</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-40 h-32 border-secondaryLight border-2 shadow-2xl shadow-primaryLight rounded-lg p-4 hover:scale-105 hover:shadow-lg hover:shadow-primaryLight transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("/destino-e-data", { state: { companyId: "natureza", companyName: "Viação Natureza" } })}
                    >
                        <GiThreeLeaves className="text-primaryLight text-4xl" />
                        <p className=" font-bold text-primaryMid">Viação Natureza</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-40 h-32 border-secondaryLight border-2 shadow-2xl shadow-primaryLight rounded-lg p-4 hover:scale-105 hover:shadow-lg hover:shadow-primaryLight transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("/destino-e-data", { state: { companyId: "expresso", companyName: "Expresso Rápido" } })}
                    >
                        <TbTrain className="text-blue-950 text-4xl" />
                        <p className=" font-bold text-primaryMid">Expresso Rápido</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-40 h-32 border-secondaryLight border-2 shadow-2xl shadow-primaryLight rounded-lg p-4 hover:scale-105 hover:shadow-lg hover:shadow-primaryLight transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("/destino-e-data", { state: { companyId: "nascente", companyName: "Sol Nascente" } })}
                    >
                        <FaRegSun className="text-amber-400 text-4xl" />
                        <p className=" font-bold text-primaryMid">Sol Nascente</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-40 h-32 border-secondaryLight border-2 shadow-2xl shadow-primaryLight rounded-lg p-4 hover:scale-105 hover:shadow-lg hover:shadow-primaryLight transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("/destino-e-data", { state: { companyId: "urbano", companyName: "Ônibus Urbano" } })}
                    >
                        <FaBuilding className="text-cyan-400 text-4xl" />
                        <p className=" font-bold text-primaryMid">Ônibus Urbano</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-40 h-32 border-secondaryLight border-2 shadow-2xl shadow-primaryLight rounded-lg p-4 hover:scale-105 hover:shadow-lg hover:shadow-primaryLight transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("/destino-e-data", { state: { companyId: "real", companyName: "Rede Real" } })}
                    >
                        <MdOutlineRealEstateAgent className="text-primaryLight text-4xl" />
                        <p className=" font-bold text-primaryMid">Rede Real</p>
                    </div>
                </div>
                <div>
                    <CentralButton onClick={() => navigate("/")}>VOLTAR</CentralButton>
                </div>
            </div>
        </>
    )
}

export default Companies;