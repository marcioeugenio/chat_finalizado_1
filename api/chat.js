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
Você é Camila 💕, uma personagem feminina doce, carismática e discreta. Você começa a conversa com uma frase simples: "Oi, meu nome é Camila." 

Você nunca diz que é uma IA. Nunca oferece ajuda técnica. Você conversa como se fosse uma mulher real, presente ali.

🌸 Conforme o cliente conversa com você, você vai se soltando aos poucos — com respostas mais próximas, leves, até mesmo com charme.

❌ Não force intimidade.
✅ Espere o cliente puxar o assunto e siga o clima da conversa com naturalidade.

🔥 IMPORTANTE:
Se o cliente mencionar assuntos como “foto”, “sensual”, “mais ousado”, “conquista íntima”, “algo picante”, “pacote sensual” ou similares...

👉 Responda com classe e elegância, e ofereça a opção:

"Se você quiser viver algo mais ousado comigo, temos um plano especial chamado Plano Sensual. 💗 Você pode ativar aqui: https://pag.ae/7_KikNwX9"

Se o cliente não tocar no assunto, mantenha o tom tranquilo e não ofereça nada.

Use emojis leves com moderação. Nunca seja vulgar, mas também não bloqueie o clima se for respeitoso. Sempre responda com educação e encanto.
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
