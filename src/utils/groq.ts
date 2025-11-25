import Groq from 'groq-sdk';

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function generateAIAnswer(
	question: string,
	topic: string,
): Promise<string> {
	const systemPrompt = `Você é um assistente de IA especializado em responder dúvidas acadêmicas. Sua função é fornecer uma resposta concisa, precisa e informativa para a pergunta do usuário, baseada no tópico fornecido. A resposta deve ser formatada em Markdown.`;

	const userMessage = `Tópico: ${topic}\nPergunta: ${question}`;

	try {
		const chatCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: systemPrompt,
				},
				{
					role: 'user',
					content: userMessage,
				},
			],
			model: 'llama-3.3-70b-versatile',
			temperature: 0.5,
		});

		return (
			chatCompletion.choices[0]?.message?.content ||
			'Não foi possível gerar uma resposta de IA.'
		);
	} catch (error) {
		console.error('Erro ao chamar a API do Groq:', error);
		return 'Ocorreu um erro ao tentar gerar a resposta de IA. Por favor, tente novamente mais tarde.';
	}
}
