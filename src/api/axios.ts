import axios from 'axios';
import { notifications } from '@mantine/notifications';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000, // Таймаут 10 секунд
});

// Глобальный интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // В React Query при переходе между страницами запросы прерываются (AbortController).
    // Мы не должны показывать пользователю красное уведомление об отмене запроса.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || error.message || 'Произошла неизвестная ошибка';

    notifications.show({
      title: 'Ошибка сервера',
      message: `Не удалось выполнить запрос: ${message}`,
      color: 'red',
    });

    return Promise.reject(error);
  },
);
