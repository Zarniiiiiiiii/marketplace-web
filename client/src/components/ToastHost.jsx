import { useEffect, useState } from 'react';

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handleToast(event) {
      const id = Date.now() + Math.random();
      const toast = {
        id,
        message: event.detail?.message || 'Operațiune finalizată.',
        type: event.detail?.type || 'success'
      };

      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 3000);
    }

    window.addEventListener('app:toast', handleToast);
    return () => window.removeEventListener('app:toast', handleToast);
  }, []);

  return (
    <div className="toast-host">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}