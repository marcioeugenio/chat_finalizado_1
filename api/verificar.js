export default async function handler(req, res) {
  const { message } = req.body;
  const texto = message.toLowerCase();

  // Frases comuns após pagamento
  const indicativos = ['paguei', 'já paguei', 'já ativei', 'acabei de pagar', 'paguei o plano'];

  // Se alguma dessas frases aparecer na mensagem, retorna simulação de pagamento aprovado
  const pagou = indicativos.some(f => texto.includes(f));

  // Para testes reais, substitua por integração com PagSeguro:
  // const pagou = await consultarPagamento(notificationCode...)

  return res.status(200).json({ pagamento: pagou });
}
