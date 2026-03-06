import { GiEagleEmblem, GiThreeLeaves } from "react-icons/gi";
import { TbTrain } from "react-icons/tb";
import { FaRegSun, FaBuilding } from "react-icons/fa";
import { MdOutlineRealEstateAgent } from "react-icons/md";

function CompanyCard({ company, onClick }) {
    const icons = {
        aguia: GiEagleEmblem,
        natureza: GiThreeLeaves,
        expresso: TbTrain,
        nascente: FaRegSun,
        urbano: FaBuilding,
        real: MdOutlineRealEstateAgent,
    };

    const iconClasses = {
        aguia: "text-blue-600 text-4xl",
        natureza: "text-primaryLight text-4xl",
        expresso: "text-blue-950 text-4xl",
        nascente: "text-amber-400 text-4xl",
        urbano: "text-cyan-400 text-4xl",
        real: "text-primaryLight text-4xl",
    };

    const getIconKey = (name) => {
        if (name.includes('Aguia')) return 'aguia';
        if (name.includes('Natureza')) return 'natureza';
        if (name.includes('Expresso')) return 'expresso';
        if (name.includes('Nascente')) return 'nascente';
        if (name.includes('Urbana')) return 'urbano';
        if (name.includes('Real')) return 'real';
        return null;
    };

    const iconKey = getIconKey(company.name);
    const IconComponent = icons[iconKey];

    if (!IconComponent) return null;

    return (
        <div
            className="flex flex-col items-center justify-center w-40 h-32 border-secondaryLight border-2 shadow-2xl shadow-primaryLight rounded-lg p-4 hover:scale-105 hover:shadow-lg hover:shadow-primaryLight transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <IconComponent className={iconClasses[iconKey]} />
            <p className="font-bold text-primaryMid">{company.name}</p>
        </div>
    );
}

export default CompanyCard;