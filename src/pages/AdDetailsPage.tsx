import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Title, Text, Button, Grid, Stack, Box, Paper, Divider } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { fetchAdById } from '../api/requests';
import { getMissingFields } from '../utils/adHelpers';
import { AdDetailsHeader } from '../components/AdDetailsHeader';
import { AdMissingFieldsAlert } from '../components/AdMissingFieldsAlert';
import { AdCharacteristics } from '../components/AdCharacteristics';
import { PageLoader } from '../components/ui/PageLoader';
import { PageError } from '../components/ui/PageError';

export const AdDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: ad,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ad', id],
    queryFn: ({ signal }) => fetchAdById(id!, signal),
    enabled: !!id,
  });

  const missingFields = useMemo(() => (ad ? getMissingFields(ad) : []), [ad]);

  if (isLoading) return <PageLoader />;
  if (isError || !ad) return <PageError message="Ошибка загрузки объявления." />;

  return (
    <Container size={1200} py="xl">
      <Button variant="subtle" color="gray" mb="md" onClick={() => navigate('/ads')} px={0}>
        ← Вернуться к списку
      </Button>

      <AdDetailsHeader ad={ad} />

      <Divider mb="xl" color="gray.3" />

      <Grid gutter={50}>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper
            withBorder
            h={400}
            radius="md"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconPhoto size={80} color="var(--mantine-color-gray-5)" stroke={1.5} />
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="xl">
            <AdMissingFieldsAlert missingFields={missingFields} />
            <AdCharacteristics params={ad.params} />
          </Stack>
        </Grid.Col>
      </Grid>

      <Box mt={60} mb={40}>
        <Title order={3} size="h4" mb="md">
          Описание
        </Title>
        <Text size="md" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {ad.description ? (
            ad.description
          ) : (
            <Text component="span" c="dimmed">
              Описание отсутствует
            </Text>
          )}
        </Text>
      </Box>
    </Container>
  );
};
