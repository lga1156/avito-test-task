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
    // Не показываем уведомления для специфичных запросов (например генерация AI),
    // если хотим обрабатывать их локально. Но для базовых круто иметь глобалку.
    const message = error.response?.data?.message || error.message || 'Произошла неизвестная ошибка';

    notifications.show({
      title: 'Ошибка сервера',
      message: `Не удалось выполнить запрос: ${message}`,
      color: 'red',
    });

    return Promise.reject(error);
  },
);
