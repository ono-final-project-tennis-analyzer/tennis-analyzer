import { PrivateRoute } from "@/components/utils/PrivateRoute.tsx";
import DashboardLayoutRoot from "./components/DashboardLayoutRoot";

export default function DashboardLayout() {
  return (
    <PrivateRoute>
      <DashboardLayoutRoot />
    </PrivateRoute>
  );
}
