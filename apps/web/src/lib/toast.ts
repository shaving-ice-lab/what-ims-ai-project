import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  loading: (message: string) => {
    return toast.loading(message);
  },
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, options);
  },
};

// Alias for easier migration from antd message
export const message = {
  success: (content: string) => showToast.success(content),
  error: (content: string) => showToast.error(content),
  warning: (content: string) => showToast.warning(content),
  info: (content: string) => showToast.info(content),
  loading: (content: string) => showToast.loading(content),
};
