async function sendMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  if (!userText) return;

  // Add user message to chat
  addMessage(userText, "user");
  input.value = "";

  // Show "Typing..." while waiting for AI response
  const typing = addMessage("Typing...", "bot");

  try {
    const response = await fetch("https://strike-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    // Parse JSON
    const data = await response.json();

    typing.remove();

    if (!response.ok) {
      // Show friendly server error messages
      addMessage(data.reply || `Server error: ${response.status}`, "bot");
    } else {
      addMessage(data.reply, "bot");
    }

  } catch (error) {
    typing.remove();
    // Show network / unexpected errors
    addMessage(`❌ Error: ${error.message}`, "bot");
    console.error("Chatbot fetch error:", error);
  }
}

// Function to add a message to the chat box
function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
