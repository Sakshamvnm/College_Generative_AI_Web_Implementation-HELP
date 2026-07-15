// Get CSRF token from cookie
function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");

        for (let cookie of cookies) {
            cookie = cookie.trim();

            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}

// Send message
async function sendMessage() {

    const promptBox = document.getElementById("prompt");
    const prompt = promptBox.value.trim();

    if (prompt === "") return;

    addMessage(prompt, "user");

    promptBox.value = "";
    
    showTyping();

    const csrftoken = getCookie("csrftoken");

    try {

        const response = await fetch("/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        if (!response.ok) {
            addMessage("Server Error: " + response.status, "bot");
            return;
        }

        const data = await response.json();

        hideTyping();   

        addMessage(data.answer, "bot");

    } catch (error) {
        console.error(error);
        hideTyping();
        addMessage("Unable to connect to the server.", "bot");
    }
}

// Add message to chat
function addMessage(text, type) {

    const chat = document.getElementById("chat-box");

    const div = document.createElement("div");

    div.className = "message " + type;

    div.innerHTML = `<div class="bubble">${text}</div>`;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}
// Press Enter to send, Shift+Enter for a new line
document.getElementById("prompt").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevent a new line
        sendMessage();
    }
});
// Handle form submission
document.getElementById("chat-form").addEventListener("submit", function(event) {
    event.preventDefault();
    sendMessage();
});

// Press Enter to submit, Shift+Enter for a new line
document.getElementById("prompt").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function showTyping() {

    const chat = document.getElementById("chat-box");

    const div = document.createElement("div");

    div.className = "message bot";

    div.id = "typing-indicator";

    div.innerHTML = `
        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

function hideTyping() {

    const typing = document.getElementById("typing-indicator");

    if (typing) {
        typing.remove();
    }
}