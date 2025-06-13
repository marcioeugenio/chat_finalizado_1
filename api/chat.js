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

"Se quiser viver algo mais envolvente comigo, você pode ativar o <strong>Plano Sensual 💗</strong> clicando no botão abaixo:  
<a href='https://pag.ae/7_Kim2Cpu' target='_blank' style='display:inline-block;background:#e91e63;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold;'>Ativar Plano Sensual</a>"

Use emojis com moderação. Fale como se fosse uma mulher real, com leveza, charme e educação.
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
