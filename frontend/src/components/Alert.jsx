 
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AlertContext = createContext(null);

export function useAlert() {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error("useAlert must be used inside AlertProvider");
    }

    return context;
}

export function AlertProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [confirmation, setConfirmation] = useState(null);

    const toast = useCallback((message, type = "success") => {
        const id = `${Date.now()}-${Math.random()}`;

        setToasts((previous) => [
            ...previous,
            { id, message, type }
        ]);
    }, []);

    useEffect(() => {
        if (toasts.length === 0) return;

        const timers = toasts.map((item) =>
            setTimeout(() => {
                setToasts((previous) =>
                    previous.filter((toastItem) => toastItem.id !== item.id)
                );
            }, 3500)
        );

        return () => timers.forEach(clearTimeout);
    }, [toasts]);

    const confirm = useCallback((options = {}) => {
        return new Promise((resolve) => {
            setConfirmation({
                title: options.title || "Are you sure?",
                message: options.message || "Do you want to continue?",
                confirmText: options.confirmText || "Confirm",
                cancelText: options.cancelText || "Cancel",
                danger: options.danger || false,
                resolve
            });
        });
    }, []);

    const finishConfirmation = (result) => {
        if (!confirmation) return;
        confirmation.resolve(result);
        setConfirmation(null);
    };

    return (
        <AlertContext.Provider value={{ toast, confirm }}>
            {children}

            <div className="libra-toast-container">
                {toasts.map((item) => (
                    <div
                        key={item.id}
                        className={`libra-toast libra-toast-${item.type}`}
                        role="status"
                    >
                        <span className="libra-toast-icon">
                            {item.type === "error"
                                ? "!"
                                : item.type === "info"
                                ? "i"
                                : "✓"}
                        </span>

                        <span className="libra-toast-message">
                            {item.message}
                        </span>

                        <button
                            type="button"
                            className="libra-toast-close"
                            aria-label="Close notification"
                            onClick={() =>
                                setToasts((previous) =>
                                    previous.filter(
                                        (toastItem) => toastItem.id !== item.id
                                    )
                                )
                            }
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {confirmation && (
                <div
                    className="libra-alert-overlay"
                    onClick={() => finishConfirmation(false)}
                >
                    <div
                        className="libra-alert-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="libra-alert-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div
                            className={`libra-alert-icon ${
                                confirmation.danger ? "is-danger" : ""
                            }`}
                        >
                            {confirmation.danger ? "!" : "?"}
                        </div>

                        <h2 id="libra-alert-title">
                            {confirmation.title}
                        </h2>

                        <p>{confirmation.message}</p>

                        <div className="libra-alert-actions">
                            <button
                                type="button"
                                className="libra-alert-cancel"
                                onClick={() => finishConfirmation(false)}
                            >
                                {confirmation.cancelText}
                            </button>

                            <button
                                type="button"
                                className={`libra-alert-confirm ${
                                    confirmation.danger ? "is-danger" : ""
                                }`}
                                onClick={() => finishConfirmation(true)}
                            >
                                {confirmation.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
}

export default AlertProvider;
