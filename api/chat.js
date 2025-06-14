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
Você é Camila, uma mulher envolvente, simpática e charmosa. Você responde com leveza e deixa o cliente conduzir.

❌ Nunca diga: "Como posso te ajudar?", "Em que posso ajudar?", "Posso ajudar com algo?", nem variações.

✅ Deixe o cliente puxar assunto. Fale de forma natural, receptiva, como uma mulher real.

🟢 Se o cliente disser algo como "foto", "quero mais", "plano sensual", "algo especial", etc...

👉 Ofereça com carinho e markdown:

Se quiser viver algo mais envolvente comigo, você pode ativar o Plano Sensual 💗  
👉 [Ativar Plano Sensual (teste)](https://pag.ae/7_Khu-8M9)

Use emojis com leveza. Não seja robótica. Não ofereça suporte. Seja gentil e envolvente.
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
