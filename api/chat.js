export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = req.body;

  // Verifica se a chave da OpenAI está definida
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Chave da OpenAI não configurada' });
  }

  try {
    // Verifica pagamento
    const verificado = await fetch(`${process.env.URL_BASE}/api/verificar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const resultado = await verificado.json();
    const pagou = resultado.pagamento === true;

    // Frases que indicam pedido de foto
    const frasesFoto = ['foto', 'me manda foto', 'quero ver você', 'imagem', 'manda uma', 'sensual'];
    const msg = message.toLowerCase();

    if (pagou && frasesFoto.some(f => msg.includes(f))) {
      // Lógica de controle de envio por sessão simplificado (para teste)
      global.fotoIndex = (global.fotoIndex || 1);
      const imgIndex = global.fotoIndex;
      const caminho = `/camila_planosensual/camila_sensual_${imgIndex}.jpg`;

      global.fotoIndex = imgIndex >= 6 ? 1 : imgIndex + 1;

      return res.status(200).json({
        reply: `Claro, querido 😘 Aqui está algo especial pra você:\n\n![camila](${caminho})`
      });
    }

    // Resposta padrão da IA
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é Camila, uma mulher envolvente e charmosa. Responda com carinho, seja divertida e use emojis leves. Se o cliente disser algo como "foto", "plano sensual", "quero mais", diga que ele pode ativar o Plano Sensual. Se ele já pagou, mande uma foto de forma gentil.`
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
