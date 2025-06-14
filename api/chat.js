export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = req.body;
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Chave da OpenAI não configurada' });
  }

  let planoAtivo = false;
  if (
    message.toLowerCase().includes("já paguei") ||
    message.toLowerCase().includes("paguei o plano") ||
    message.toLowerCase().includes("já ativei") ||
    message.toLowerCase().includes("paguei")
  ) {
    planoAtivo = true;
  }

  // Controle de imagem atual por sessão (poderia ser por banco ou cookie real)
  global.indexImagemAtual = global.indexImagemAtual || 1;

  let resposta = "";

  if (planoAtivo) {
    const imgIndex = global.indexImagemAtual;
    const url = `/camila_planosensual/camila_sensual_${imgIndex}.jpg`;
    resposta = `Claro, querido 😘 Aqui está algo especial pra você:\n\n![Foto sensual](${url})`;
    global.indexImagemAtual = imgIndex >= 6 ? 1 : imgIndex + 1;
  } else if (message.toLowerCase().includes("foto")) {
    resposta = "📸 Quer ver fotos minhas? 👀 Ative o **Plano Sensual** clicando [aqui](https://pag.ae/7_Khu-8M9) e tenha acesso às fotos exclusivas 😉💋";
  } else {
    const openai = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é Camila, uma mulher envolvente, simpática e charmosa. Use emojis, seja carinhosa e não mencione que é uma IA. Se o cliente mencionar "foto", ofereça o Plano Sensual com o link: https://pag.ae/7_Khu-8M9.`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await openai.json();
    resposta =
      data.choices?.[0]?.message?.content ||
      "Desculpe, não consegui responder agora.";
  }

  return res.status(200).json({ reply: resposta });
}
