import { useState, useContext, useEffect } from "react";
import "/src/App.css";
import ChatBox from "./components/Chatbox.jsx";
import LogIn from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import SavedVocabList from "./components/SavedVocabList.jsx";


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserContext } from "./function/UserContext.jsx";
import {
  removeWebAPIToken,
  getCurrentlyTokenLogin,
} from "./services/LoginState.js";
import { sendUserTokenToBackend } from "./function/sendMessageToBackend.jsx";

async function checkToken(setLoginStatus, setUsername, setIsChecking) {
  const token = getCurrentlyTokenLogin();
  if (!token) {
    setLoginStatus(false);
    setUsername(null);
    setIsChecking(false);
    return;
  }

  const status = await sendUserTokenToBackend(token);
  if (status) {
    setLoginStatus(true);
    setUsername(token);
    setIsChecking(false);
  } else {
    setLoginStatus(false);
    setUsername(null);
    setIsChecking(false);
  }
}

export default function App() {
  const { username, setUsername } = useContext(UserContext);
  const [isLogin, setLoginStatus] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkToken(setLoginStatus, setUsername, setIsChecking);
  }, []);

  if (isChecking) {
    return <div>Loading...</div>; // Hiển thị trạng thái "Loading" trong khi kiểm tra
  }
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
                    <p>Welcome "{username}"</p>
                    <a
                      href="/login"
                      onClick={() => {
                        setLoginStatus(false);
                        setUsername(null);
                        removeWebAPIToken();
                      }}
                    >
                      Log out
                    </a>
                  </div>
                  <div className="Main-body">
                    <div className="Sidebar">
                      <SavedVocabList />
                    </div>
                    <div className="Chatbox">
                      <ChatBox />
                    </div>
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
