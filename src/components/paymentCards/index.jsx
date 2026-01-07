function PaymentCard({
  title,
  description,
  selected,
  onClick,
  mode = "select",
}) {
  const isConfirm = mode === "confirm";

  return (
    <button
      onClick={!isConfirm ? onClick : undefined}
      disabled={isConfirm}
      className={`
        relative w-64 h-40 rounded-xl border-2 flex flex-col items-center justify-center gap-2
        transition-all duration-500
        ${selected
          ? "border-primaryLight bg-teal-100 scale-105 shadow-lg"
          : "border-gray-300 hover:border-primaryLight"
        }
        ${isConfirm && !selected ? "opacity-40" : ""}
      `}
    >
      {isConfirm && selected && (
        <span className="absolute top-3 right-3 w-8 h-8 bg-primaryLight text-white rounded-full flex items-center justify-center text-lg animate-bounce">
          ✓
        </span>
      )}

      <span className="text-xl font-bold">{title}</span>
      <span className="text-primaryMid text-center">{description}</span>

      {isConfirm && selected && (
        <span className="text-primaryLight font-semibold mt-1 animate-fade-in">
          Pagamento confirmado
        </span>
      )}
    </button>
  );
}

export default PaymentCard;
