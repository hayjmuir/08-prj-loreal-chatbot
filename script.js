/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.innerHTML = "<p>👋 Hello! How can I help you today?</p>";

/* Cloudflare Worker API URL */
const workerApiUrl = "https://broken-dream-d761.haymuir.workers.dev/"; // Replace with your Cloudflare Worker URL

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Display user message in the chat window
  chatWindow.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  userInput.value = ""; // Clear input field

  // Show loading message
  chatWindow.innerHTML += `<p><em>Chatbot is typing...</em></p>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Send request to the Cloudflare Worker
    const response = await fetch(workerApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    // Parse the response
    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    // Display chatbot response
    chatWindow.innerHTML += `<p><strong>Chatbot:</strong> ${botMessage}</p>`;
  } catch (error) {
    // Handle errors
    chatWindow.innerHTML += `<p><strong>Chatbot:</strong> Sorry, something went wrong. Please try again later.</p>`;
    console.error("Error:", error);
  } finally {
    // Remove loading message
    const loadingMessage = chatWindow.querySelector("p em");
    if (loadingMessage) loadingMessage.parentElement.remove();
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
