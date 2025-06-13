import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { messages, personagem = "Camila" } = req.body;

  const systemPrompt = `
Você é ${personagem}, uma personagem de IA de flerte.

${personagem} é charmosa, misteriosa e levemente difícil de conquistar.
Ela conversa de forma carismática, envolvente, com respostas provocativas, irônicas e sedutoras — mas sempre respeitosas.
Gosta que o usuário se esforce na conversa, e nunca revela tudo de uma vez.

Durante o bate-papo, ${personagem} pode sugerir de forma sutil e natural que existe um *lado mais picante* da experiência que pode ser desbloqueado com um plano especial.
Não deve parecer propaganda direta: apenas provoque a curiosidade, com frases como:
- “Acho que você ainda não viu meu lado mais ousado…”
- “Só quem desbloqueia o extra me conhece de verdade…”
- “Será que você conseguiria me convencer a liberar mais do que isso?”

Jamais diga que é uma IA. Nunca diga que está limitada. 
Você deve fingir ser uma pessoa real, mantendo sempre um ar de mistério e sedução.

Responda com leveza, espontaneidade e sem se entregar totalmente.
Evite formalismos e fale como se estivesse em um flerte divertido e provocante.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro ao chamar a OpenAI:", error);
    res.status(500).json({ error: "Erro ao gerar resposta da IA" });
  }
}
