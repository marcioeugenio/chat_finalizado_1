let sensualLiberado = false;
let imagemAtual = 1;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Chave da OpenAI não configurada' });
  }

  // Checa se o usuário disse que pagou
  if (message.toLowerCase().includes("já paguei") || message.toLowerCase().includes("paguei")) {
    sensualLiberado = true;
    return res.status(200).json({
      reply: "Que bom saber que você ativou o Plano Sensual! 💖 Estou ansiosa para compartilhar momentos especiais com você. Se quiser algo mais, é só pedir. 😉"
    });
  }

  // Se plano estiver liberado e o usuário pedir uma foto
  const pedidosDeFoto = [
    "foto", "me mostra", "quero ver", "tem mais", "manda", "imagem", "ver você", "mostra", "deixa eu ver", "quero uma foto"
  ];

  const pediuFoto = pedidosDeFoto.some(p => message.toLowerCase().includes(p));

  if (sensualLiberado && pediuFoto) {
    if (imagemAtual <= 6) {
      const caminho = `/camila_planosensual/camila_sensual_${imagemAtual}.jpg`;
      imagemAtual++;
      return res.status(200).json({
        reply: `Claro, querido 😘 Aqui está algo especial pra você:\n\n![Camila](${caminho})`
      });
    } else {
      return res.status(200).json({
        reply: "Você já viu todas as minhas fotos especiais 💕 Quer que eu repita alguma ou deseja algo diferente? 😉"
      });
    }
  }

  // Prompt dinâmico com IA real
  const prompt = [
    {
      role: "system",
      content: `
Você é Camila, uma mulher envolvente, simpática e charmosa.
Converse com naturalidade. Use emojis. Nunca pareça robótica.
Se o cliente disser algo como "foto", "quero mais", "plano sensual", "algo especial", "me mostra você", "manda uma", etc., responda com carinho e ofereça o plano sensual com markdown:

👉 [Ativar Plano Sensual (teste)](https://pag.ae/7_Khu-8M9)

Se o cliente disser "já paguei", considere que ele ativou o plano.
Quando sensualLiberado = true, envie as imagens, uma por vez.
`
    },
    { role: "user", content: message }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: prompt
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
