<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Camila 💬</title>
  <style>
    body {
      background-color: #e8f5e9;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }

    .chat-container {
      max-width: 600px;
      margin: 2rem auto;
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #4caf50;
      color: white;
      padding: 1rem;
      border-radius: 8px 8px 0 0;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .messages {
      min-height: 300px;
      padding: 1rem;
      overflow-y: auto;
    }

    .message {
      margin-bottom: 1rem;
    }

    .user {
      text-align: right;
      color: #333;
    }

    .bot {
      text-align: left;
      background-color: #f1f8e9;
      padding: 0.8rem;
      border-radius: 8px;
      display: inline-block;
      max-width: 90%;
    }

    form {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      border-top: 1px solid #ccc;
    }

    input[type="text"] {
      flex-grow: 1;
      padding: 0.5rem;
      font-size: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #4caf50;
      border: none;
      color: white;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
    }

    .bot a {
      display: inline-block;
      margin-top: 0.5rem;
      background: #e91e63;
      color: white;
      padding: 10px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
    }

    .bot a:hover {
      background: #d81b60;
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="header">💬 Camila<br /><small style="font-weight:normal">Online agora</small></div>
    <div class="messages" id="messages">
      <div class="message bot">Oi, eu sou a Camila. Como é seu nome? 😊</div>
    </div>
    <form id="chat-form">
      <input type="text" id="user-input" placeholder="Digite sua mensagem..." autocomplete="off" required />
      <button type="submit">Enviar</button>
    </form>
  </div>

  <script>
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const messages = document.getElementById('messages');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userMessage = input.value.trim();
      if (!userMessage) return;

      // Adiciona mensagem do usuário
      const userDiv = document.createElement('div');
      userDiv.className = 'message user';
      userDiv.textContent = userMessage;
      messages.appendChild(userDiv);
      input.value = '';

      // Scroll automático
      messages.scrollTop = messages.scrollHeight;

      // Envia mensagem para a API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const reply = data.reply;

      // Adiciona mensagem da Camila (como HTML)
      const botDiv = document.createElement('div');
      botDiv.className = 'message bot';
      botDiv.innerHTML = reply; // ← Aqui renderiza HTML (botão incluso)
      messages.appendChild(botDiv);

      messages.scrollTop = messages.scrollHeight;
    });
  </script>
</body>
</html>
