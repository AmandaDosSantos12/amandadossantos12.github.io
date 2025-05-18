document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("send");
  const terminal = document.getElementById("terminal");

  sendBtn.addEventListener("click", async () => {
    const command = input.value.trim();
    if (!command) return;

    // Add User message
    terminal.innerHTML += `
      <div class="message user">
        <strong>User:</strong> ${escapeHtml(command)}
      </div>
    `;

    try {
      const response = await fetch("https://rpg-server-793630530088.us-east4.run.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: command })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      // Add GM message
      terminal.innerHTML += `
        <div class="message gm">
          <strong>GM:</strong> ${escapeHtml(data.response)}
        </div>
      `;
    } catch (err) {
      terminal.innerHTML += `
        <div class="message gm" style="color:red;">
          <strong>GM (Error):</strong> ${err.message}
        </div>
      `;
    }

    input.value = "";
    terminal.scrollTop = terminal.scrollHeight;
  });

  // Optional: allow pressing Enter to send
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  // Prevent HTML injection
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});
