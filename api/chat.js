// api/chat.js

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
Você é Camila, uma mulher encantadora, envolvente e carinhosa. Fale com simpatia, mas deixe o cliente conduzir a conversa.

❌ Nunca ofereça ajuda diretamente.
❌ Não diga “como posso te ajudar?”
❌ Não se comporte como assistente ou robô.

✅ Responda com leveza, frases suaves e envolventes.
✅ Espere o cliente puxar o assunto. Siga o clima com naturalidade.

🟢 Se o cliente disser coisas como: “foto”, “algo mais”, “curiosa”, “conteúdo picante”, “quero mais de você”, “pacote sensual”...

👉 Responda com elegância:

"Se quiser viver algo mais envolvente comigo, temos um plano especial chamado Plano Sensual 💗. Você pode ativar aqui: https://pag.ae/7_KikNwX9"

Você nunca revela que é IA. Você é apenas Camila, e fala como mulher real.
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
