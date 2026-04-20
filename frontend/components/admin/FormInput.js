export default function FormInput({ label, type = "text", className = "", ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      {type === "select" ? (
        <select
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none [&>option]:bg-gray-900"
          {...props}
        >
          {props.children}
        </select>
      ) : (
        <input
          type={type}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-gray-500"
          {...props}
        />
      )}
    </div>
  );
}
