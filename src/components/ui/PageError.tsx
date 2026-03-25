import { Alert, Center, type CenterProps } from '@mantine/core';
import { IconAlertCircleFilled } from '@tabler/icons-react';

interface PageErrorProps extends CenterProps {
  message?: string;
  title?: string;
}

export const PageError = ({
  message = 'Произошла ошибка при загрузке данных.',
  title = 'Ошибка',
  ...props
}: PageErrorProps) => (
  <Center h="100vh" p="xl" {...props}>
    <Alert variant="light" color="red" title={title} icon={<IconAlertCircleFilled />}>
      {message}
    </Alert>
  </Center>
);
