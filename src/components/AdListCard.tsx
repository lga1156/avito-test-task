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
          bg="#F3F4F6"
          w={80}
          h={80}
          style={{
            borderRadius: 8,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconPhoto size={40} color="#ADB5BD" stroke={1.5} />
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
                label: { textTransform: 'none', fontWeight: 500, color: '#E67700' },
              }}
              leftSection={<Box w={6} h={6} bg="#FCC419" style={{ borderRadius: '50%' }} />}
            >
              Требует доработок
            </Badge>
          )}
        </Box>
      </Group>
    </Card>
  );
};
