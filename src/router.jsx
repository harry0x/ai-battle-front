import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

/**
 * Application router configuration.
 * Auth pages use AuthLayout, protected pages use AppLayout.
 */
const router = createBrowserRouter([
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  // Public App Routes (Guest chat allowed)
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <ChatPage /> },
    ],
  },
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/chat/:chatId", element: <ChatPage /> },
          { path: "/history", element: <HistoryPage /> },
        ],
      },
    ],
  },
  // 404
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
