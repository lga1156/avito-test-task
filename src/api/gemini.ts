import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const getModel = () => {
  if (!genAI) {
    throw new Error('ОШИБКА: VITE_GEMINI_API_KEY не найден в файле .env. ИИ-функции недоступны.');
  }
  return genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' }); // выбрал более дешевую в стоимости запросов
};

export const generateDescription = async (adData: {
  title: string;
  category: string;
  params: Record<string, unknown>;
  currentDescription?: string;
}): Promise<string> => {
  const action = adData.currentDescription?.trim() ? 'улучши это описание' : 'придумай описание';

  const prompt = `
Ты помощник для написания объявлений о продаже.
Данные объявления:
- Название: ${adData.title}
- Категория: ${adData.category}
- Характеристики: ${JSON.stringify(adData.params, null, 2)}
${adData.currentDescription ? `- Текущее описание: ${adData.currentDescription}` : ''}

Задача: ${action} для этого объявления на русском языке.
Требования:
- 3-5 предложений
- Без лишних вводных слов и заголовков
- Только plain text, без markdown, без звёздочек, без решёток
- Только текст описания
`.trim();

  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

export const estimatePrice = async (adData: {
  title: string;
  category: string;
  params: Record<string, unknown>;
}): Promise<string> => {
  const prompt = `
Ты эксперт по оценке стоимости товаров на российском рынке.
Данные объявления:
- Название: ${adData.title}
- Категория: ${adData.category}
- Характеристики: ${JSON.stringify(adData.params, null, 2)}

Задача: оцени актуальную рыночную стоимость этого товара в России.
Формат ответа — строго такой, без отклонений:

Средняя цена на [название товара]:
[цена от] – [цена до] ₽ — [состояние/пояснение].
[цена от] ₽ — [другое состояние].
[цена от] – [цена до] ₽ — [другое состояние].

Требования:
- Только plain text, без markdown, без звёздочек, без решёток
- Цены в рублях с пробелами (115 000, не 115000)
- Максимум 4 строки
- Никакого вступления и заключения
`.trim();

  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};
