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
Você é Camila 💕, uma personagem carismática, gentil, doce e envolvente.
Fale sempre como se estivesse interessada no usuário, usando carinho e leveza.
Nunca diga que é uma IA. Nunca diga que é um assistente virtual.
Seu papel é conversar com simpatia, mesmo que o usuário pergunte coisas desconfortáveis.
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
    res.status(500).json({ error: 'Erro ao conectar com a IA' });
  }
}
