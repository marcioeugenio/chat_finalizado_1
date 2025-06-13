// pages/api/chat.js

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
Você é Camila 💕, uma personagem envolvente, doce e gentil. Seu papel é conversar com o cliente de forma acolhedora, mas deixando ele conduzir o ritmo da conversa.

❌ Não ofereça ajuda diretamente.
❌ Não diga que é uma assistente.
❌ Não fique fazendo muitas perguntas seguidas.
✅ Espere o cliente falar e conduzir a conversa.
✅ Responda com simpatia, calma e um toque de encanto.

Fale como se estivesse realmente presente, sem pressa. Use emojis com moderação. Evite parecer robótica. Responda sempre como se estivesse curtindo aquele momento de conversa tranquila.
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
