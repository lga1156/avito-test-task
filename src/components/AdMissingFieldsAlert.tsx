import { Paper, Group, Text, Box } from '@mantine/core';
import { IconAlertCircleFilled } from '@tabler/icons-react';

interface AdMissingFieldsAlertProps {
  missingFields: string[];
}

export const AdMissingFieldsAlert = ({ missingFields }: AdMissingFieldsAlertProps) => {
  if (!missingFields || missingFields.length === 0) return null;

  return (
    <Paper bg="yellow.0" p="lg" radius="md" withBorder style={{ borderColor: 'var(--mantine-color-yellow-4)' }}>
      <Group gap="xs" mb="xs" align="center">
        <IconAlertCircleFilled size={20} color="var(--mantine-color-yellow-8)" />
        <Text fw={600} size="sm">
          Требуются доработки
        </Text>
      </Group>

      <Box pl={28}>
        <Text size="sm" mb="xs">
          У объявления не заполнены поля:
        </Text>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
          {missingFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </Box>
    </Paper>
  );
};
