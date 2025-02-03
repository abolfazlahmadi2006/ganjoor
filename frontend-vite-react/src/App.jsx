import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import CutCreateForm from "./pages/CutCreate";
import CutList from "./pages/CutList";
import CutDetail from "./pages/CutDetail";
import CutUpdate from "./pages/CutUpdate";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import { UserProvider } from "./pages/UserContext";
import LogoutPage from "./pages/LogoutPage";
import Page from "@/app/dashboard/page";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/cut-create", element: <CutCreateForm /> },
      { path: "/cut-detail/:cutId", element: <CutDetail /> },
      { path: "/cut-update/:cutId", element: <CutUpdate /> },
      { path: "/cut-list", element: <CutList /> },
      { path: "/login", element: <AuthPage /> },
      { path: "/logout", element: <LogoutPage /> },
      { path: "/sidebar", element: <Page /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
