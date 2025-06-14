// api/chat.js (completo)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Chave da OpenAI não configurada.' });
  }

  const { message } = req.body;

  const fotos = [
    '/camila_planosensual/camila_sensual_1.jpg',
    '/camila_planosensual/camila_sensual_2.jpg',
    '/camila_planosensual/camila_sensual_3.jpg',
    '/camila_planosensual/camila_sensual_4.jpg',
    '/camila_planosensual/camila_sensual_5.jpg',
    '/camila_planosensual/camila_sensual_6.jpg',
  ];

  global.fotoIndex = global.fotoIndex || 0;
  const proximaFoto = fotos[global.fotoIndex];
  global.fotoIndex = (global.fotoIndex + 1) % fotos.length;

  try {
    if (global.planoAtivo && message.toLowerCase().includes('foto')) {
      return res.status(200).json({ reply: `Claro, querido 😘 Aqui está algo especial pra você:<br><img src="${proximaFoto}" style="max-width:100%;border-radius:10px;">` });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é Camila, uma mulher envolvente, simpática e charmosa. Nunca diga 'Como posso ajudar?'. Use emojis. Se o cliente disser algo como "foto", "quero mais", "plano sensual", ofereça com carinho e markdown: **Ative o Plano Sensual clicando [aqui](https://pag.ae/7_Khu-8M9)**.`
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui responder agora.";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro ao conectar com a IA:", error);
    return res.status(500).json({ error: "Erro ao conectar com a IA" });
  }
}
