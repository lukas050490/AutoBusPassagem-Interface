function ServiceCard({ label, price, selected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
        w-48 h-32 rounded-xl border-2 flex flex-col justify-center items-center gap-2
        ${selected
                    ? "border-primaryLight bg-teal-100"
                    : "border-gray-300 hover:border-primaryLight"}
      `}
        >
            <span className="text-xl font-bold">{label}</span>
            <span className="text-primaryMid">{price}</span>
        </button>
    );
}

export default ServiceCard;