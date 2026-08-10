import { BrowserRouter } from "react-router-dom";
import { SessionProvider } from "@/app/session";
import { AppDataProvider } from "@/app/store";
import { ToastProvider } from "@/app/toast";
import { AppRoutes } from "@/routes";

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppDataProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AppDataProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
