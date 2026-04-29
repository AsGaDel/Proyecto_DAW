import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // espera a que termine la animación
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const typeStyles = {
    success: "bg-white border-green-500 text-gray-700",
    error:   "bg-white border-red-500   text-gray-700",
    info:    "bg-white border-blue-500  text-gray-700",
  };

  const iconStyles = {
    success: "text-green-500",
    error:   "text-red-500",
    info:    "text-blue-500",
  };

  const icons = {
    success: (
      <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-md text-sm lg:text-base font-medium
      transition-all duration-300 ${typeStyles[type]}
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    > 
      <span className={iconStyles[type]}>{icons[type]}</span>
      <span>{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}