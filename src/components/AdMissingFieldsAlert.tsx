import { Alert, Box } from '@mantine/core';
import { IconAlertCircleFilled } from '@tabler/icons-react';

interface AdMissingFieldsAlertProps {
  missingFields: string[];
}

export const AdMissingFieldsAlert = ({ missingFields }: AdMissingFieldsAlertProps) => {
  if (!missingFields || missingFields.length === 0) return null;

  return (
    <Alert
      variant="light"
      color="yellow"
      title="Требуются доработки"
      icon={<IconAlertCircleFilled size={20} />}
      radius="md"
    >
      <Box mt={4}>
        У объявления не заполнены поля:
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
          {missingFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </Box>
    </Alert>
  );
};
