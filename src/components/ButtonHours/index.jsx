function ButtonHours({ hour, disabled, onClick, platform }) {


    const baseClasses = "px-6 py-3 rounded-lg font-bold flex flex-col items-center justify-center text-white transition-colors";
    const stateClasses = disabled
        ? "bg-gray-400 cursor-not-allowed opacity-70"
        : "bg-teal-500 hover:bg-teal-600";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${stateClasses}`}
        >
            <div className="whitespace-nowrap">
                <span className="block text-lg">{hour}</span>
                {disabled && <span className="text-sm">(Lotado)</span>}
            </div>
            {platform && <div className="text-xs mt-1">Plataforma {platform}</div>}
        </button>
    );
}

export default ButtonHours;

