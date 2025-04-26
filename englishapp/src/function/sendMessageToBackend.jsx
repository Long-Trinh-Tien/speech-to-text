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
