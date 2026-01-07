import { useNavigate } from 'react-router-dom';
import busImage from '../../assets/bus.svg';
import video from '../../assets/video-background.mp4'
import CentralButton from "../../components/centralButton";


function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div className="relative h-screen overflow-hidden">
                <video autoPlay loop muted playsInline src={video} class="absolute top-0 left-0 w-full h-full object-cover z-0">
                    Seu navegador não suporta a tag de vídeo.
                </video>
                <div className="relative z-10 flex items-center justify-center h-full text-white">
                    <div className="text-center p-10 gap-10 flex justify-center flex-col items-center">
                        <h1 className=" text-4xl font-bold bg-linear-to-t from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text">BEM-VINDO</h1>
                        <h2 className="text-amber-50 text-2xl font-bold">COMPRE SUA PASSAGEM</h2>
                        <img src={busImage} alt="Home" className="w-48" />
                        <CentralButton
                            onClick={() => navigate("/empresas")}
                        >COMPRAR PASSAGEM</CentralButton>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Home;