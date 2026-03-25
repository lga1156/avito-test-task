import { Center, Loader, type CenterProps } from '@mantine/core';

export const PageLoader = (props: CenterProps) => (
  <Center h="100vh" {...props}>
    <Loader size="xl" />
  </Center>
);
