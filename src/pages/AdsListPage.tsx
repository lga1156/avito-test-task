import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  SimpleGrid,
  Loader,
  Center,
  Alert,
  TextInput,
  Select,
  Pagination,
  Grid,
  Checkbox,
  Switch,
  Title,
  Stack,
  Divider,
  Box,
  Accordion,
  Paper,
  Button,
  Container,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { fetchAds } from '../api/requests';
import { formatPrice } from '../utils/formatters';
import { categoryLabels } from '../constants/adLabels';
import classes from '../styles/pagination.module.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'По новизне (сначала новые)' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'title_asc', label: 'По названию (А-Я)' },
  { value: 'title_desc', label: 'По названию (Я-А)' },
];

const SORT_MAP: Record<string, { sortColumn: string; sortDirection: string }> = {
  newest: { sortColumn: 'createdAt', sortDirection: 'desc' },
  oldest: { sortColumn: 'createdAt', sortDirection: 'asc' },
  title_asc: { sortColumn: 'title', sortDirection: 'asc' },
  title_desc: { sortColumn: 'title', sortDirection: 'desc' },
};

const PAGE_SIZE = 10;

export const AdsListPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 500);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [needsRevision, setNeedsRevision] = useState(false);
  const [sortValue, setSortValue] = useState<string>('newest');

  const { sortColumn, sortDirection } = SORT_MAP[sortValue] ?? {};

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'ads',
      page,
      debouncedSearch,
      selectedCategories,
      needsRevision,
      sortColumn,
      sortDirection,
    ],
    queryFn: () =>
      fetchAds({
        page,
        search: debouncedSearch,
        categories: selectedCategories,
        needsRevision,
        sortColumn,
        sortDirection,
      }),
  });

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCategories([]);
    setNeedsRevision(false);
    setSortValue('newest');
    setPage(1);
  };

  if (isError) {
    return (
      <Alert color="red" title="Ошибка!">
        Не удалось загрузить объявления.
      </Alert>
    );
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <Box bg="#F8F9FA" mih="100vh" py="xl">
      <Container size={1400}>
        <Box mb="xl">
          <Title order={2}>Мои объявления</Title>
          <Text c="dimmed" size="sm" mt={4}>
            {data?.total || 0} объявления
          </Text>
        </Box>

        <Paper bg="white" p="md" radius="md" mb="xl" shadow="sm">
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput
                placeholder="Найти объявление..."
                rightSection={<IconSearch size={18} color="gray" />}
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.currentTarget.value);
                  setPage(1);
                }}
                size="md"
                radius="md"
                variant="filled"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                data={SORT_OPTIONS}
                value={sortValue}
                onChange={(val) => {
                  if (val) setSortValue(val);
                  setPage(1);
                }}
                size="md"
                radius="md"
                variant="filled"
              />
            </Grid.Col>
          </Grid>
        </Paper>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 3, lg: 2.5 }}>
            <Card shadow="sm" radius="md" p="md" mb="md">
              <Text fw={700} size="lg" mb="md">
                Фильтры
              </Text>

              <Accordion
                defaultValue="category"
                variant="transparent"
                styles={{
                  item: { borderBottom: 'none' },
                  control: { padding: 0, '&:hover': { backgroundColor: 'transparent' } },
                  label: { padding: 0 },
                  content: { padding: '8px 0 0 0' },
                }}
              >
                <Accordion.Item value="category">
                  <Accordion.Control>
                    <Text fw={500} size="sm">
                      Категория
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Checkbox.Group
                      value={selectedCategories}
                      onChange={(val) => {
                        setSelectedCategories(val);
                        setPage(1);
                      }}
                    >
                      <Stack gap="sm">
                        <Checkbox value="auto" label="Авто" size="sm" />
                        <Checkbox value="electronics" label="Электроника" size="sm" />
                        <Checkbox value="real_estate" label="Недвижимость" size="sm" />
                      </Stack>
                    </Checkbox.Group>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <Divider my="md" />

              <Group justify="space-between" wrap="nowrap" py="xs">
                <Text fw={500} size="sm">
                  Только требующие
                  <br />
                  доработок
                </Text>
                <Switch
                  checked={needsRevision}
                  onChange={(e) => {
                    setNeedsRevision(e.currentTarget.checked);
                    setPage(1);
                  }}
                  color="blue"
                  size="md"
                />
              </Group>
            </Card>

            <Card shadow="sm" radius="md" p={0}>
              <Button variant="transparent" color="gray" fullWidth onClick={handleResetFilters}>
                Сбросить фильтры
              </Button>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 9, lg: 9.5 }}>
            {isLoading ? (
              <Center h={300}>
                <Loader size="xl" />
              </Center>
            ) : data?.items.length === 0 ? (
              <Center h={300}>
                <Text c="dimmed" size="lg">
                  По вашему запросу ничего не найдено
                </Text>
              </Center>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="md">
                {data?.items.map((ad) => (
                  <Card
                    key={ad.id}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    component="a"
                    href={`/ads/${ad.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/ads/${ad.id}`);
                    }}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                  >
                    <Card.Section>
                      <Box bg="#F3F4F6">
                        <Image
                          src="https://placehold.co/600x400/F3F4F6/adb5bd?text=Image"
                          height={140}
                          alt="Placeholder"
                          fit="contain"
                        />
                      </Box>
                    </Card.Section>

                    <Box style={{ marginTop: '-12px', position: 'relative', zIndex: 2 }} mb="sm">
                      <Badge
                        variant="outline"
                        radius="sm"
                        bg="white"
                        style={{
                          borderColor: '#E5E7EB',
                          color: '#4B5563',
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        {categoryLabels[ad.category]}
                      </Badge>
                    </Box>

                    <Text fw={500} size="sm" lineClamp={2} mb="xs" style={{ minHeight: '40px' }}>
                      {ad.title}
                    </Text>

                    <Text fw={700} size="md" mb="md">
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
                            label: { textTransform: 'none', fontWeight: 500, color: '#E67700' },
                          }}
                          leftSection={
                            <Box w={6} h={6} bg="#FCC419" style={{ borderRadius: '50%' }} />
                          }
                        >
                          Требует доработок
                        </Badge>
                      </Group>
                    )}
                  </Card>
                ))}
              </SimpleGrid>
            )}

            {!isLoading && totalPages > 1 && (
              <Group justify="flex-start" mt="xl">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  radius="sm"
                  classNames={{ control: classes.control }}
                />
              </Group>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};
