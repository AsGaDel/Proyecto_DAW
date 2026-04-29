import { useState, useCallback, createContext, useContext } from "react";
import Toast from "./Toast";

// ─── Contexto ─────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = "success", duration = 3000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* Contenedor fijo en la esquina inferior derecha */}
      <div className="fixed bottom-24 lg:bottom-6 right-4 z-[300] flex flex-col gap-2 items-end">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const addToast = useContext(ToastContext);
  if (!addToast) throw new Error("useToast debe usarse dentro de ToastProvider");
  return addToast;
}