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
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/Layout";
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
      { path: "/cut-list", element: <CutList /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
