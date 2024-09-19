//IMPORTACIONES DE EXTERNOS
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
//IMPORTACIONES DE COMPONENTES
import PrivateRouter from "./components/PrivateRouter.jsx";
//IMPORTACIONES DE PAGINAS
import Login from "./pages/login/Login.jsx";
import Home from "./pages/home/Home.jsx";
import Register from "./pages/login/Register.jsx";
import Chat from "./pages/chat/Chat.jsx";
//IMPORTACIONES DE CONTEXT
import { AuthProvider } from "./context/AuthContext.jsx";
import { ApiProvider } from "./context/apiContext.jsx";
import CreateRoom from "./pages/room/CreateRoom.jsx";
import AddUserRoom from "./pages/room/AddUserRoom.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <PrivateRouter element={<Home />} />,
    children:[
      {
        path:'chat/:id',
        element:<Chat></Chat>
      },
      {
        path:"create/room",
        element: <CreateRoom/>
      },
      {
        path:'create/room/addUser',
        element:<AddUserRoom/>
      }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApiProvider>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </ApiProvider>
  </StrictMode>
);
