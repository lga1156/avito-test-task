import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@mantine/form';
import { useLocalStorage } from '@mantine/hooks';
import {
  Container,
  Title,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  Alert,
  Paper,
  Text,
  Divider,
  ActionIcon,
  Box,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { fetchAdById, updateAd } from '../api/requests';
import { generateDescription, estimatePrice } from '../api/gemini';
import type { ItemUpdateIn, AdCategory, AutoItemParams, RealEstateItemParams, ElectronicsItemParams } from '../types';

import { AiButton } from '../components/AiButton';
import { AiTooltip, type AiTooltipState } from '../components/AiTooltip';
import { DynamicParamsFields } from '../components/DynamicParamsFields';
import { PageLoader } from '../components/ui/PageLoader';
import { PageError } from '../components/ui/PageError';

const DEFAULT_PARAMS: AutoItemParams & RealEstateItemParams & ElectronicsItemParams = {
  brand: '',
  model: '',
  yearOfManufacture: 0,
  transmission: undefined,
  mileage: 0,
  enginePower: 0,
  type: undefined,
  address: '',
  area: 0,
  floor: 0,
  condition: undefined,
  color: '',
};

const getCleanParams = (category: AdCategory, params: ItemUpdateIn['params']): ItemUpdateIn['params'] => {
  const clean = (obj: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v !== 0 && v !== undefined && v !== null));
  if (category === 'auto') {
    const { brand, model, yearOfManufacture, transmission, mileage, enginePower } = params as AutoItemParams;
    return clean({ brand, model, yearOfManufacture, transmission, mileage, enginePower });
  }
  if (category === 'real_estate') {
    const { type, address, area, floor } = params as RealEstateItemParams;
    return clean({ type, address, area, floor });
  }
  const { type, brand, model, condition, color } = params as ElectronicsItemParams;
  return clean({ type, brand, model, condition, color });
};

const ClearButton = ({ onClear }: { onClear: () => void }) => (
  <ActionIcon variant="subtle" color="gray" size="sm" onClick={onClear}>
    <IconX size={14} />
  </ActionIcon>
);

const MAX_DESCRIPTION_LENGTH = 1000;

export const AdEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [draftRestored, setDraftRestored] = useState(false);
  const [priceAiState, setPriceAiState] = useState<AiTooltipState>({ status: 'idle' });
  const [descAiState, setDescAiState] = useState<AiTooltipState>({ status: 'idle' });

  const [draft, setDraft, removeDraft] = useLocalStorage<ItemUpdateIn | null>({
    key: `ad-draft-${id}`,
    defaultValue: null,
  });

  const {
    data: ad,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ad', id],
    queryFn: ({ signal }) => fetchAdById(id!, signal),
    enabled: !!id,
  });

  const form = useForm<ItemUpdateIn>({
    initialValues: {
      title: '',
      price: undefined as unknown as number,
      category: 'auto' as AdCategory,
      description: '',
      params: { ...DEFAULT_PARAMS },
    },
    validateInputOnBlur: true,
    validate: {
      title: (value: string) =>
        !value.trim()
          ? 'Название должно быть заполнено'
          : value.length < 3
            ? 'Название должно быть не короче 3 символов'
            : null,
      price: (value: number | string) =>
        value === '' || value === undefined || value === null || Number.isNaN(Number(value))
          ? 'Укажите цену'
          : Number(value) < 0
            ? 'Цена не может быть отрицательной'
            : null,
      category: (value: AdCategory) => (!value ? 'Выберите категорию' : null),
    },
  });

  const isFormValid =
    !!form.values.title?.trim() &&
    form.values.title.length >= 3 &&
    form.values.price !== undefined &&
    form.values.price !== null &&
    String(form.values.price).trim() !== '' &&
    Number(form.values.price) >= 0 &&
    !!form.values.category;

  useEffect(() => {
    if (!ad) return;
    if (draft) {
      form.setValues(draft);
      setDraftRestored(true);
    } else {
      form.setValues({
        title: ad.title,
        price: ad.price,
        category: ad.category,
        description: ad.description || '',
        params: { ...DEFAULT_PARAMS, ...(ad.params || {}) },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad]);

  useEffect(() => {
    if (!ad) return;
    setDraft(form.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const clearDraftAndNavigate = (path: string) => {
    removeDraft();
    navigate(path);
  };

  const getAdDataForAi = () => ({
    title: form.values.title,
    category: form.values.category,
    params: getCleanParams(form.values.category, form.values.params) as Record<string, unknown>,
  });

  const handleEstimatePrice = async () => {
    setPriceAiState({ status: 'loading' });
    try {
      const result = await estimatePrice(getAdDataForAi());
      setPriceAiState({ status: 'success', result });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('VITE_GEMINI_API_KEY')) {
        notifications.show({
          title: 'ИИ недоступен',
          message: 'Добавьте VITE_GEMINI_API_KEY в файл .env для работы этой функции.',
          color: 'orange',
        });
      }
      setPriceAiState({ status: 'error' });
    }
  };

  const handleGenerateDescription = async () => {
    setDescAiState({ status: 'loading' });
    try {
      const result = await generateDescription({
        ...getAdDataForAi(),
        currentDescription: form.values.description,
      });
      setDescAiState({ status: 'success', result });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('VITE_GEMINI_API_KEY')) {
        notifications.show({
          title: 'ИИ недоступен',
          message: 'Добавьте VITE_GEMINI_API_KEY в файл .env для работы этой функции.',
          color: 'orange',
        });
      }
      setDescAiState({ status: 'error' });
    }
  };

  const updateMutation = useMutation({
    mutationFn: (values: ItemUpdateIn) => updateAd(id!, values),
    onSuccess: () => {
      removeDraft();
      queryClient.invalidateQueries({ queryKey: ['ad', id] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      notifications.show({ title: 'Изменения сохранены', message: '', color: 'green' });
      navigate(`/ads/${id}`);
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка сохранения',
        message: 'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
        color: 'red',
      });
    },
  });

  const handleSubmit = (values: ItemUpdateIn) => {
    updateMutation.mutate({
      ...values,
      params: getCleanParams(values.category, values.params),
    });
  };

  if (isLoading) return <PageLoader h={300} />;
  if (isError || !ad) return <PageError message="Ошибка загрузки товара." />;

  const descriptionLength = form.values.description?.length || 0;
  const descButtonLabel = form.values.description?.trim() ? 'Улучшить описание' : 'Придумать описание';

  return (
    <Container size="sm" py="xl">
      <Paper withBorder p="xl" radius="md">
        <Title order={2} mb="lg">
          Редактирование объявления
        </Title>

        {draftRestored && (
          <Alert color="yellow" mb="md" withCloseButton onClose={() => setDraftRestored(false)}>
            Восстановлен несохранённый черновик
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Select
              label="Категория"
              placeholder="Выберите категорию"
              data={[
                { value: 'auto', label: 'Авто' },
                { value: 'real_estate', label: 'Недвижимость' },
                { value: 'electronics', label: 'Электроника' },
              ]}
              {...form.getInputProps('category')}
              onChange={(val) => {
                form.setFieldValue('category', val as AdCategory);
                form.setFieldValue('params', { ...DEFAULT_PARAMS });
              }}
            />

            <TextInput
              label="Название"
              placeholder="Введите название"
              withAsterisk
              rightSection={form.values.title ? <ClearButton onClear={() => form.setFieldValue('title', '')} /> : null}
              {...form.getInputProps('title')}
            />

            <Box>
              <Group align="flex-end" gap="sm">
                <NumberInput
                  label="Цена (₽)"
                  placeholder="Введите цену"
                  min={0}
                  hideControls
                  withAsterisk
                  style={{ flex: 1 }}
                  {...form.getInputProps('price')}
                />
                <AiButton
                  label="Узнать рыночную цену"
                  tooltipState={priceAiState}
                  onClick={handleEstimatePrice}
                  mb={form.errors.price ? 22 : 1}
                />
              </Group>
              <AiTooltip
                state={priceAiState}
                onClose={() => setPriceAiState({ status: 'idle' })}
                onRetry={handleEstimatePrice}
              />
            </Box>

            <Divider my="xs" label="Характеристики" labelPosition="left" />

            <DynamicParamsFields category={form.values.category} form={form} />

            <Divider my="xs" />

            <Box>
              <Textarea
                label="Описание"
                placeholder="Подробно опишите товар..."
                minRows={4}
                autosize
                maxLength={MAX_DESCRIPTION_LENGTH}
                {...form.getInputProps('description')}
              />
              <Group justify="space-between" align="center" mt={4}>
                <AiButton
                  label={descButtonLabel}
                  tooltipState={descAiState}
                  onClick={handleGenerateDescription}
                  size="xs"
                />
                <Text size="xs" c="dimmed">
                  {descriptionLength} / {MAX_DESCRIPTION_LENGTH}
                </Text>
              </Group>
              <AiTooltip
                state={descAiState}
                onApply={(result) => {
                  form.setFieldValue('description', result);
                  setDescAiState({ status: 'idle' });
                }}
                onClose={() => setDescAiState({ status: 'idle' })}
                onRetry={handleGenerateDescription}
              />
            </Box>

            <Group mt="xl">
              <Button type="submit" color="blue" loading={updateMutation.isPending} disabled={!isFormValid}>
                Сохранить
              </Button>
              <Button variant="default" onClick={() => clearDraftAndNavigate(`/ads/${id}`)}>
                Отменить
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default AdEditPage;
