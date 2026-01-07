function ButtonHours({ hour, disabled, onClick, platform }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-6 py-3 rounded-lg font-bold flex flex-col items-center
        ${disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                }
      `}
        >
            <div>
                {hour}
                {disabled && <span className="ml-2">(Lotado)</span>}
            </div>
            {platform && <div className="text-xs mt-1">Plataforma {platform}</div>}
        </button>
    );
}

export default ButtonHours;

