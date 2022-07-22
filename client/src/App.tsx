import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ChatPage from "./pages/ChatPage";
import { useContext } from "react";
import { AuthContext } from "./context/features/auth";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/signin"
        element={user?.id ? <Navigate to={"/"} /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={user?.id ? <Navigate to={"/"} /> : <SignUp />}
      />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
};

export default App;
