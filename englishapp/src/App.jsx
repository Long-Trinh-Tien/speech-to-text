import { useState } from "react";
import "/src/App.css";
import ChatBox from "./components/Chatbox.jsx";
import LogIn from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

export default function App() {
  const [isLogin, setLoginStatus] = useState(false);
  return (
    <>
      <Router>
        <Routes>
          <Route
            // Path cho Login
            path="/login"
            element={<LogIn loginStatusChange={setLoginStatus} />}
          />

          <Route
            // Path cho Main
            path="/main"
            element={
              isLogin ? (
                <div className="Main-container">
                  <div className="Header">
                    <p>Header</p>
                  </div>

                  <div className="Chatbox">
                    <ChatBox />
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path=""
            element={
              isLogin ? <Navigate to="/main" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </>
  );
  //
}
