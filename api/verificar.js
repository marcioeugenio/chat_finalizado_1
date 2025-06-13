// api/verificar.js

export default async function handler(req, res) {
  try {
    const resposta = await fetch('https://tenta-ai-backand3.onrender.com/api/verificar');
    const data = await resposta.json();

    if (data?.liberado && data?.plano === 'sensual') {
      return res.status(200).json({ liberado: true });
    } else {
      return res.status(200).json({ liberado: false });
    }
  } catch (err) {
    console.error('Erro ao verificar liberação:', err);
    return res.status(500).json({ liberado: false });
  }
}
