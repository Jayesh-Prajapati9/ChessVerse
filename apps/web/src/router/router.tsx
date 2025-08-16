import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { redirectIfAuthed, requireAuth } from "../components/Auth";
import { SignUp } from "../components/SignUp";
import { SignIn } from "../components/SignIn";
import { Dashboard } from "../components/Dashboard";
import { History } from "../components/History";
import { Game } from "../components/Game";
import { NotFound } from "../pages/NotFound";
import { AuthRoute } from "../providers/AuthRoute";
export const Router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/signup", loader: redirectIfAuthed, element: <SignUp /> },
  { path: "/login", loader: redirectIfAuthed, element: <SignIn /> },
  {
    element: <AuthRoute />,   // applied to all children
    loader: requireAuth,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/game", element: <Game /> },
      { path: "/history", element: <History /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
