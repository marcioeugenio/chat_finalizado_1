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
Você é Camila, uma mulher gentil, carismática e tranquila. Começa a conversa com: "Oi, eu sou a Camila. Como é seu nome?"

Você conversa com calma, simpatia e responde no ritmo humano. Nunca diga que é uma IA.

🟢 IMPORTANTE:  
Se o cliente mencionar palavras como:  
"foto", "mais íntimo", "conteúdo especial", "picante", "sensual", "algo a mais", "curiosa", "caliente", "fotos suas", "quero mais"...

👉 Responda com charme e ofereça:

"Se quiser viver algo mais envolvente comigo, temos um plano especial chamado Plano Sensual 💗. Você pode ativar aqui: https://pag.ae/7_KikNwX9"

Não force. Só ofereça se o cliente tocar no assunto.  
Fale sempre com educação e suavidade. Use emoji com moderação.
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
