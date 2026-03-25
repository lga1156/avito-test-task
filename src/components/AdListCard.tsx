import { Card, Text, Badge, Group, Box } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Ad } from '../types';
import { categoryLabels } from '../constants/adLabels';
import { formatPrice } from '../utils/formatters';

interface AdListCardProps {
  ad: Ad;
}

export const AdListCard = ({ ad }: AdListCardProps) => {
  return (
    <Card
      key={ad.id}
      shadow="sm"
      padding="md"
      radius="md"
      component={Link}
      to={`/ads/${ad.id}`}
      style={{ textDecoration: 'none' }}
    >
      <Group gap="md" align="center" wrap="nowrap">
        <Box
          w={80}
          h={80}
          style={{
            borderRadius: 8,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <IconPhoto size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
        </Box>

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" c="dimmed" mb={2}>
            {categoryLabels[ad.category]}
          </Text>
          <Text fw={500} size="sm" lineClamp={1} mb={2} style={{ color: 'inherit' }}>
            {ad.title}
          </Text>
          <Text fw={700} size="sm" c="dimmed">
            {formatPrice(ad.price)} ₽
          </Text>
          {ad.needsRevision && (
            <Badge
              color="yellow"
              variant="light"
              size="sm"
              radius="sm"
              mt={4}
              styles={{
                root: { padding: '0 8px' },
                label: { textTransform: 'none', fontWeight: 500 },
              }}
            >
              Требует доработок
            </Badge>
          )}
        </Box>
      </Group>
    </Card>
  );
};
