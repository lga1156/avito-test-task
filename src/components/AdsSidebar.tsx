import { Card, Text, Group, Accordion, Checkbox, Stack, Divider, Switch, Button } from '@mantine/core';
import { useAdsFilterStore } from '../store/adsFilterStore';
import { useShallow } from 'zustand/react/shallow';

export const AdsSidebar = () => {
  const { selectedCategories, setSelectedCategories, needsRevision, setNeedsRevision, resetFilters } =
    useAdsFilterStore(
      useShallow((state) => ({
        selectedCategories: state.selectedCategories,
        setSelectedCategories: state.setSelectedCategories,
        needsRevision: state.needsRevision,
        setNeedsRevision: state.setNeedsRevision,
        resetFilters: state.resetFilters,
      })),
    );

  return (
    <>
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
              <Checkbox.Group value={selectedCategories} onChange={setSelectedCategories}>
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
            onChange={(e) => setNeedsRevision(e.currentTarget.checked)}
            color="blue"
            size="md"
          />
        </Group>
      </Card>

      <Card shadow="sm" radius="md" p={0}>
        <Button variant="transparent" color="gray" fullWidth onClick={resetFilters}>
          Сбросить фильтры
        </Button>
      </Card>
    </>
  );
};
