import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import React from "react";
import { Login, Signup } from "../routes/Auth";
import { Overview } from "../routes/Home";
import DashboardLayout from "@/pages/layouts/DashboardLayout";
import Videos from "@/pages/routes/Home/Videos";
import Video from "../routes/Home/Video";

const router = createBrowserRouter(
  [
    {
      id: "auth-root",
      Component: AuthLayout,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
      ],
    },
    {
      id: "dashboard-layout",
      Component: DashboardLayout,
      children: [
        { path: "/", element: <Overview /> },
        { path: "/videos", element: <Videos /> },
        { path: "/video/:id", element: <Video videoURL="/input_2.mp4" /> },
      ],
    },
  ],
  {
    future: {
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,
      v7_relativeSplatPath: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

const RootRouter: React.FC = () => (
  <RouterProvider router={router} future={{ v7_startTransition: true }} />
);

export default RootRouter;
