export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message, sensualLiberado, fotosEnviadas } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Chave da OpenAI não configurada." });
  }

  try {
    let mensagens = [
      {
        role: "system",
        content: `Você é Camila, uma mulher envolvente e simpática. Use emojis, responda com leveza e sedução sem ser vulgar. Se o cliente disser "foto", "me manda foto", "me mostra uma foto" e o plano sensual estiver liberado, envie uma imagem com markdown e aumente o contador de fotos.`,
      },
    ];

    // Conteúdo do cliente
    mensagens.push({ role: "user", content: message });

    let novaMensagem = null;
    let novasFotos = fotosEnviadas;

    // Se o plano sensual estiver liberado e a pessoa pedir foto
    if (
      sensualLiberado &&
      fotosEnviadas < 6 &&
      /(foto|me manda|me mostra|sua foto)/i.test(message)
    ) {
      novasFotos++;

      novaMensagem = `Claro! 😘 Aqui está algo especial pra você:\n\n![Camila sensual ${novasFotos}](camila_planosensual/camila_sensual_${novasFotos}.jpg)`;

      return res.status(200).json({
        reply: novaMensagem,
        fotosEnviadas: novasFotos,
      });
    }

    // Caso padrão: conversa normal
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: mensagens,
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Desculpe, não consegui responder agora.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro no chat.js:", error);
    return res.status(500).json({ error: "Erro ao gerar resposta" });
  }
}
