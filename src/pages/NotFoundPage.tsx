import { Container, Title, Text, Button, Center, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container style={{ height: '100vh' }}>
      <Center h="100%">
        <Stack align="center" gap="md">
          <Title style={{ fontSize: '120px', fontWeight: 900, color: 'var(--mantine-color-gray-3)' }}>404</Title>
          <Title order={2}>Страница не найдена</Title>
          <Text c="dimmed" ta="center" maw={400}>
            К сожалению, мы не смогли найти страницу, которую вы искали. Возможно, вы ошиблись при вводе адреса или
            страница была удалена.
          </Text>
          <Button size="md" mt="xl" onClick={() => navigate('/ads')}>
            Вернуться к объявлениям
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};
