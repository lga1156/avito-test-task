import { useNavigate } from 'react-router-dom';
import { Card, Text, Button } from '@mantine/core';

export const AdsListPage = () => {
  const navigate = useNavigate();
  const mockAdId = '123';
  const handleOpenAd = () => {
    navigate(`/ads/${mockAdId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Мои объявления</h1>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 300 }}>
        <Text fw={500}>Тестовый товар</Text>
        <Text size="sm" c="dimmed">
          Цена: 1000 ₽
        </Text>

        <Button color="blue" fullWidth mt="md" radius="md" onClick={handleOpenAd}>
          Открыть объявление
        </Button>
      </Card>
    </div>
  );
};
