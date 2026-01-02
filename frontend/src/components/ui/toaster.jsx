import { useToast } from "../../hooks/use-toast"
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "./toast"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts && toasts.map(({ id, title, description, action, ...props }) => {
                return (
                    <Toast key={id} {...props}>
                        <div className="grid gap-1">
                            {title && <ToastTitle>{typeof title === 'string' ? title : String(title)}</ToastTitle>}
                            {description && (
                                <ToastDescription>{typeof description === 'string' ? description : String(description)}</ToastDescription>
                            )}
                        </div>
                        {action && typeof action === 'object' && action.$$typeof ? action : null}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
