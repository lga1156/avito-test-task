import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Button,
  Loader,
  Center,
  Alert,
  Grid,
  Group,
  Stack,
  Box,
  Paper,
  Divider,
} from '@mantine/core';
import { IconPencil, IconAlertCircleFilled, IconPhoto } from '@tabler/icons-react';
import { fetchAdById } from '../api/requests';
import { formatPrice, formatDate } from '../utils/formatters';
import { paramLabels, valueLabels } from '../constants/adLabels';
import { getMissingFields } from '../utils/adHelpers';

export const AdDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: ad,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ad', id],
    queryFn: () => fetchAdById(id!),
    enabled: !!id,
  });

  const missingFields = useMemo(() => (ad ? getMissingFields(ad) : []), [ad]);

  if (isLoading)
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  if (isError || !ad)
    return (
      <Alert color="red" m="xl">
        Ошибка загрузки объявления.
      </Alert>
    );

  return (
    <Container size={1200} py="xl">
      <Button variant="subtle" color="gray" mb="md" onClick={() => navigate('/ads')} px={0}>
        ← Вернуться к списку
      </Button>

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
          <Title order={1} size="h2" fw={600}>
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

      <Divider mb="xl" color="#E5E7EB" />

      <Grid gutter={50}>
        {/* ЛЕВАЯ КОЛОНКА: ГАЛЕРЕЯ */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="sm">
            <Paper
              bg="#F3F4F6"
              h={400}
              radius="md"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IconPhoto size={80} color="#ADB5BD" stroke={1.5} />
            </Paper>

            <Grid gutter="sm">
              {[1, 2, 3, 4].map((item) => (
                <Grid.Col span={3} key={item}>
                  <Paper
                    bg="#F3F4F6"
                    h={80}
                    radius="md"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <IconPhoto size={30} color="#ADB5BD" stroke={1.5} />
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Grid.Col>

        {/* ПРАВАЯ КОЛОНКА: ДОРАБОТКИ И ХАРАКТЕРИСТИКИ */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="xl">
            {missingFields.length > 0 && (
              <Paper bg="#FFF8E1" p="lg" radius="md" withBorder style={{ borderColor: '#FFE066' }}>
                <Group gap="xs" mb="xs" align="center">
                  <IconAlertCircleFilled size={20} color="#F59F00" />
                  <Text fw={600} size="sm">
                    Требуются доработки
                  </Text>
                </Group>
                <Text size="sm" mb="xs">
                  У объявления не заполнены поля:
                </Text>
                <Box pl="md">
                  <ul
                    style={{ margin: 0, paddingLeft: '10px', fontSize: '14px', lineHeight: '1.6' }}
                  >
                    {missingFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </Box>
              </Paper>
            )}

            <Box>
              <Title order={3} size="h4" mb="md">
                Характеристики
              </Title>
              <Stack gap="xs">
                {Object.entries(ad.params || {}).map(([key, value]) => {
                  if (value === undefined || value === null || value === '') return null;

                  const label = paramLabels[key] || key;
                  const displayValue = valueLabels[String(value)] || value;

                  return (
                    <Grid key={key} m={0}>
                      <Grid.Col span={5} p={0}>
                        <Text c="dimmed" size="sm">
                          {label}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={7} p={0}>
                        <Text size="sm">{String(displayValue)}</Text>
                      </Grid.Col>
                    </Grid>
                  );
                })}
                {Object.keys(ad.params || {}).length === 0 && (
                  <Text size="sm" c="dimmed">
                    Характеристики не указаны
                  </Text>
                )}
              </Stack>
            </Box>
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
