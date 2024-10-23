import { toast } from "@/components/ui/use-toast";

class PromiseHandler extends Error {
  public code: string | undefined;
  public details: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;

    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, PromiseHandler.prototype);

    // Show toast notification
    this.showNotification();
  }

  private showNotification() {
    return toast({ variant: "destructive" ,  title: this.code, description: this.message , duration: import.meta.env.VITE_TOAST_DURATION})
  }
}
  
  export default PromiseHandler;
  