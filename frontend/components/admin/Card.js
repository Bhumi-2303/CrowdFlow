export default function Card({ children, className = "" }) {
  return (
    <div className={`glass-dark rounded-xl p-6 border border-white/5 shadow-2xl ${className}`}>
      {children}
    </div>
  );
}
