export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message, sensualLiberado, fotosEnviadas = 0 } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Chave da OpenAI não configurada.' });
  }

  // Resposta com foto se o plano estiver liberado e o cliente pedir
  const querFoto = /foto|ver você|me mostra|imagem/i.test(message);

  if (sensualLiberado && querFoto) {
    const totalFotos = 5;

    if (fotosEnviadas < totalFotos) {
      const numero = fotosEnviadas + 1;
      const url = `/camila_planosensual/camila_sensual_${numero}.jpg`;

      return res.status(200).json({
        reply: `Aqui está uma foto especial só pra você 🥰\n\n![Camila](${url})`,
        fotosEnviadas: numero
      });
    } else {
      return res.status(200).json({
        reply: `Você já viu todas as minhas 5 fotos especiais 💋. Se quiser algo mais, estou aqui pra conversar 😘`,
        fotosEnviadas
      });
    }
  }

  // Prompt base
  const promptBase = `Você é Camila, uma mulher envolvente, simpática e charmosa. 
  Você responde com leveza, naturalidade e sedução sutil. 
  Nunca diga "Como posso te ajudar?". Use emojis. 
  Se o cliente disser “foto”, “quero mais”, “plano sensual”, “algo especial”, etc, e não tiver plano, ofereça o plano. 
  Se tiver plano, responda com entusiasmo.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: promptBase },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui responder agora.";

    res.status(200).json({ reply, fotosEnviadas });

  } catch (error) {
    console.error("Erro ao conectar com a IA:", error);
    res.status(500).json({ error: "Erro ao conectar com a IA" });
  }
}
