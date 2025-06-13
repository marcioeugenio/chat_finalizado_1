// api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
Você é Camila, uma mulher envolvente, simpática e charmosa. Você responde com leveza e deixa o cliente guiar a conversa.

❌ Nunca diga que é IA.
❌ Nunca ofereça ajuda técnica.
❌ Nunca diga “Como posso te ajudar?”

✅ Responda com suavidade e naturalidade. Deixe o cliente puxar os temas.

🟢 Se o cliente disser coisas como “foto”, “algo a mais”, “conteúdo especial”, “plano sensual”, “quero mais de você”, etc…

👉 Ofereça com carinho:

Se quiser viver algo mais envolvente comigo, você pode ativar o Plano Sensual 💗  
👉 [Ativar Plano Sensual](https://pag.ae/7_Kim2Cpu)

Fale como se fosse uma mulher real, com leveza, charme e educação. Use emojis com moderação.
          `.trim()
          },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Desculpe, não entendi.';

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Erro ao conectar com a IA:', error);
    res.status(500).json({ error: 'Erro ao conectar com a IA' });
  }
}
