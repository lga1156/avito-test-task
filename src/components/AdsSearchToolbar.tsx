import { Paper, Grid, TextInput, Group, ActionIcon, Select } from '@mantine/core';
import { IconSearch, IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import { useAdsFilterStore } from '../store/adsFilterStore';
import { useShallow } from 'zustand/react/shallow';
import { SORT_OPTIONS } from '../constants/adsListOptions';

export const AdsSearchToolbar = () => {
  const { searchInput, setSearchInput, viewMode, setViewMode, sortValue, setSortValue } = useAdsFilterStore(
    useShallow((state) => ({
      searchInput: state.searchInput,
      setSearchInput: state.setSearchInput,
      viewMode: state.viewMode,
      setViewMode: state.setViewMode,
      sortValue: state.sortValue,
      setSortValue: state.setSortValue,
    })),
  );

  return (
    <Paper p="md" radius="md" mb="xl" shadow="sm" withBorder>
      <Grid align="center">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <TextInput
            placeholder="Найти объявление..."
            rightSection={<IconSearch size={18} color="gray" />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.currentTarget.value)}
            size="md"
            radius="md"
            variant="filled"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 'content' }}>
          <Group gap={4}>
            <ActionIcon
              variant={viewMode === 'grid' ? 'filled' : 'subtle'}
              color={viewMode === 'grid' ? 'blue' : 'gray'}
              size="lg"
              radius="md"
              onClick={() => setViewMode('grid')}
              aria-label="Сетка"
            >
              <IconLayoutGrid size={18} />
            </ActionIcon>
            <ActionIcon
              variant={viewMode === 'list' ? 'filled' : 'subtle'}
              color={viewMode === 'list' ? 'blue' : 'gray'}
              size="lg"
              radius="md"
              onClick={() => setViewMode('list')}
              aria-label="Список"
            >
              <IconLayoutList size={18} />
            </ActionIcon>
          </Group>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <Select
            data={SORT_OPTIONS}
            value={sortValue}
            onChange={(val) => {
              if (val) setSortValue(val);
            }}
            size="md"
            radius="md"
            variant="filled"
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
