import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Text, Group, SimpleGrid, Center, Pagination, Grid, Title, Stack, Box, Container } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { fetchAds } from '../api/requests';
import { useAdsFilterStore } from '../store/adsFilterStore';
import classes from '../styles/pagination.module.css';
import { PAGE_SIZE, SORT_MAP } from '../constants/adsListOptions';
import { useShallow } from 'zustand/react/shallow';

import { AdsSearchToolbar } from '../components/AdsSearchToolbar';
import { AdsSidebar } from '../components/AdsSidebar';
import { AdGridCard } from '../components/AdGridCard';
import { AdListCard } from '../components/AdListCard';
import { PageLoader } from '../components/ui/PageLoader';
import { PageError } from '../components/ui/PageError';

export const AdsListPage = () => {
  const { page, searchInput, selectedCategories, needsRevision, sortValue, viewMode, setPage } = useAdsFilterStore(
    useShallow((state) => ({
      page: state.page,
      searchInput: state.searchInput,
      selectedCategories: state.selectedCategories,
      needsRevision: state.needsRevision,
      sortValue: state.sortValue,
      viewMode: state.viewMode,
      setPage: state.setPage,
    })),
  );

  const [debouncedSearch] = useDebouncedValue(searchInput, 500);
  const { sortColumn, sortDirection } = SORT_MAP[sortValue] ?? {};

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['ads', page, debouncedSearch, selectedCategories, needsRevision, sortColumn, sortDirection],
    queryFn: ({ signal }) =>
      fetchAds({
        page,
        search: debouncedSearch,
        categories: selectedCategories,
        needsRevision,
        sortColumn,
        sortDirection,
        signal,
      }),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return <PageError message="Не удалось загрузить объявления." />;
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <Box mih="100vh">
      <Container size={1400}>
        <Box mb="xl">
          <Title order={2}>Мои объявления</Title>
          <Text c="dimmed" size="sm" mt={4}>
            {data?.total || 0} объявления
          </Text>
        </Box>

        <AdsSearchToolbar />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 3, lg: 2.5 }}>
            <AdsSidebar />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 9, lg: 9.5 }}>
            {isLoading ? (
              <PageLoader h={300} />
            ) : data?.items.length === 0 ? (
              <Center h={300}>
                <Text c="dimmed" size="lg">
                  По вашему запросу ничего не найдено
                </Text>
              </Center>
            ) : (
              <Box style={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s ease' }}>
                {viewMode === 'grid' ? (
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="md">
                    {data?.items.map((ad) => (
                      <AdGridCard key={ad.id} ad={ad} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Stack gap="sm">
                    {data?.items.map((ad) => (
                      <AdListCard key={ad.id} ad={ad} />
                    ))}
                  </Stack>
                )}
              </Box>
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
