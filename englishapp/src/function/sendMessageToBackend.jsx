export async function sendMessageToBackend(message) {
    try {
      const res = await fetch('http://localhost:3000/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error in sendMessageToBackend API:", err);
      return null;
    }
  }
  