import { Group, Stack, Title, Button, Text } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../utils/formatters';
import type { Ad } from '../types';

interface AdDetailsHeaderProps {
  ad: Ad;
}

export const AdDetailsHeader = ({ ad }: AdDetailsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Group justify="space-between" align="flex-start" mb="xl">
      <Stack gap="xs">
        <Title order={1} size="h2" fw={600}>
          {ad.title}
        </Title>
        <Button
          leftSection={<IconPencil size={18} />}
          onClick={() => navigate(`/ads/${ad.id}/edit`)}
          color="blue"
          radius="md"
          size="sm"
          w="fit-content"
        >
          Редактировать
        </Button>
      </Stack>

      <Stack gap={4} align="flex-end">
        <Title order={2} size="h2" fw={600}>
          {formatPrice(ad.price)} ₽
        </Title>
        <Text size="sm" c="dimmed">
          Опубликовано: {formatDate(ad.createdAt)}
        </Text>
        {ad.updatedAt && ad.updatedAt !== ad.createdAt && (
          <Text size="sm" c="dimmed">
            Отредактировано: {formatDate(ad.updatedAt)}
          </Text>
        )}
      </Stack>
    </Group>
  );
};
