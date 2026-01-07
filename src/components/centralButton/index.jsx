function CentralButton({ children, ...props }) {
    return <button
        type="button"
        {...props}
        className="w-52 h-15 p-0.5 flex items-center justify-center text-primaryMid border-2 border-b-cyan-800 cursor-pointer rounded-2xl hover:bg-primaryLight hover:text-white font-bold hover:border-0"
    >{children}</button>;
}
export default CentralButton;