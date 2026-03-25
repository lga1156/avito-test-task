import { Box, Title, Stack, Group, Text } from '@mantine/core';
import { paramLabels, valueLabels } from '../constants/adLabels';
import type { Ad } from '../types';

interface AdCharacteristicsProps {
  params: Ad['params'];
}

export const AdCharacteristics = ({ params }: AdCharacteristicsProps) => {
  const hasParams = params && Object.keys(params).length > 0;

  return (
    <Box>
      <Title order={3} size="h4" mb="md">
        Характеристики
      </Title>
      <Stack gap="sm">
        {hasParams ? (
          Object.entries(params).map(([key, value]) => {
            if (value === undefined || value === null || value === '') return null;

            const label = paramLabels[key as keyof typeof paramLabels] || key;
            const displayValue = valueLabels[String(value) as keyof typeof valueLabels] || value;

            return (
              <Group key={key} gap={0} align="flex-start">
                <Text c="dimmed" size="sm" w="45%">
                  {label}
                </Text>
                <Text size="sm" w="55%">
                  {String(displayValue)}
                </Text>
              </Group>
            );
          })
        ) : (
          <Text size="sm" c="dimmed">
            Характеристики не указаны
          </Text>
        )}
      </Stack>
    </Box>
  );
};
