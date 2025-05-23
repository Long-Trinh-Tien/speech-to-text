export async function sendMessageToBackend(message) {
  try {
    const res = await fetch("http://localhost:3000/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error in sendMessageToBackend API:", err);
    return null;
  }
}

export async function sendLoginMessageToBackend(username, password) {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error in sendLoginMessageToBackend");
    return false;
  }
}
export async function sendRegisterMessageToBackend(username, password) {
  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    return res; // trả thẳng về response để bên Register.jsx xử lý tiếp
  } catch (err) {
    console.error("Error in sendRegisterMessageToBackend:", err);
    throw err; // ném lỗi ra ngoài cho Register.jsx catch
  }
}

export async function sendUserTokenToBackend(token) {
  try {
    const res = await fetch("http://localhost:3000/user-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error in sendLoginMessageToBackend");
    return false;
  }
}
