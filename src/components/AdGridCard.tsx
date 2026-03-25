import { Card, Text, Badge, Group, Box } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Ad } from '../types';
import { categoryLabels } from '../constants/adLabels';
import { formatPrice } from '../utils/formatters';

interface AdGridCardProps {
  ad: Ad;
}

export const AdGridCard = ({ ad }: AdGridCardProps) => {
  return (
    <Card
      key={ad.id}
      shadow="sm"
      padding="md"
      radius="md"
      component={Link}
      to={`/ads/${ad.id}`}
      style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
    >
      <Card.Section>
        <Box
          h={140}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <IconPhoto size={60} color="var(--mantine-color-dimmed)" stroke={1.5} />
        </Box>
      </Card.Section>

      <Box style={{ marginTop: '-12px', position: 'relative', zIndex: 2 }} mb="sm">
        <Badge
          variant="default"
          radius="sm"
          style={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {categoryLabels[ad.category]}
        </Badge>
      </Box>

      <Text fw={500} size="sm" lineClamp={2} mb="xs" style={{ minHeight: '40px', color: 'inherit' }}>
        {ad.title}
      </Text>

      <Text fw={700} size="md" c="dimmed">
        {formatPrice(ad.price)} ₽
      </Text>

      {ad.needsRevision && (
        <Group gap={6} mt="auto">
          <Badge
            color="yellow"
            variant="light"
            size="sm"
            radius="sm"
            styles={{
              root: { padding: '0 8px' },
              label: { textTransform: 'none', fontWeight: 500 },
            }}
          >
            Требует доработок
          </Badge>
        </Group>
      )}
    </Card>
  );
};
