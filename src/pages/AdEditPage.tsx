import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type UseFormReturnType } from '@mantine/form';
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
  Loader,
  Center,
  Alert,
  Paper,
  Text,
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { fetchAdById, updateAd } from '../api/requests';
import type {
  ItemUpdateIn,
  AdCategory,
  AutoItemParams,
  RealEstateItemParams,
  ElectronicsItemParams,
} from '../types';

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

const getCleanParams = (
  category: AdCategory,
  params: ItemUpdateIn['params'],
): ItemUpdateIn['params'] => {
  const clean = (obj: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== '' && v !== 0 && v !== undefined),
    );

  if (category === 'auto') {
    const { brand, model, yearOfManufacture, transmission, mileage, enginePower } =
      params as AutoItemParams;
    return clean({ brand, model, yearOfManufacture, transmission, mileage, enginePower });
  }
  if (category === 'real_estate') {
    const { type, address, area, floor } = params as RealEstateItemParams;
    return clean({ type, address, area, floor });
  }
  const { type, brand, model, condition, color } = params as ElectronicsItemParams;
  return clean({ type, brand, model, condition, color });
};

interface DynamicParamsFieldsProps {
  category: AdCategory;
  form: UseFormReturnType<ItemUpdateIn>;
}

const DynamicParamsFields = ({ category, form }: DynamicParamsFieldsProps) => {
  if (category === 'auto') {
    return (
      <Group grow>
        <TextInput label="Марка" placeholder="BMW" {...form.getInputProps('params.brand')} />
        <TextInput label="Модель" placeholder="X5" {...form.getInputProps('params.model')} />
        <NumberInput
          label="Год выпуска"
          placeholder="2020"
          {...form.getInputProps('params.yearOfManufacture')}
        />
        <Select
          label="Коробка передач"
          placeholder="Выберите"
          data={[
            { value: 'automatic', label: 'Автомат' },
            { value: 'manual', label: 'Механика' },
          ]}
          {...form.getInputProps('params.transmission')}
        />
        <NumberInput
          label="Пробег (км)"
          placeholder="50000"
          {...form.getInputProps('params.mileage')}
        />
        <NumberInput
          label="Мощность (л.с.)"
          placeholder="249"
          {...form.getInputProps('params.enginePower')}
        />
      </Group>
    );
  }

  if (category === 'real_estate') {
    return (
      <Group grow>
        <Select
          label="Тип недвижимости"
          placeholder="Выберите"
          data={[
            { value: 'flat', label: 'Квартира' },
            { value: 'house', label: 'Дом' },
            { value: 'room', label: 'Комната' },
          ]}
          {...form.getInputProps('params.type')}
        />
        <TextInput
          label="Адрес"
          placeholder="г. Москва, ул. Пушкина..."
          {...form.getInputProps('params.address')}
        />
        <NumberInput label="Площадь (м²)" placeholder="50" {...form.getInputProps('params.area')} />
        <NumberInput label="Этаж" placeholder="5" {...form.getInputProps('params.floor')} />
      </Group>
    );
  }

  if (category === 'electronics') {
    return (
      <Group grow>
        <Select
          label="Тип устройства"
          placeholder="Выберите"
          data={[
            { value: 'phone', label: 'Телефон' },
            { value: 'laptop', label: 'Ноутбук' },
            { value: 'misc', label: 'Другое' },
          ]}
          {...form.getInputProps('params.type')}
        />
        <TextInput label="Бренд" placeholder="Apple" {...form.getInputProps('params.brand')} />
        <TextInput label="Модель" placeholder="iPhone 15" {...form.getInputProps('params.model')} />
        <Select
          label="Состояние"
          placeholder="Выберите"
          data={[
            { value: 'new', label: 'Новое' },
            { value: 'used', label: 'Б/У' },
          ]}
          {...form.getInputProps('params.condition')}
        />
        <TextInput label="Цвет" placeholder="Черный" {...form.getInputProps('params.color')} />
      </Group>
    );
  }

  return null;
};

export const AdEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [draftRestored, setDraftRestored] = useState(false);

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
    queryFn: () => fetchAdById(id!),
    enabled: !!id,
  });

  const form = useForm<ItemUpdateIn>({
    initialValues: {
      title: '',
      price: 0,
      category: 'auto' as AdCategory,
      description: '',
      params: { ...DEFAULT_PARAMS },
    },
    validate: {
      title: (value: string) =>
        value.length < 3 ? 'Название должно быть не короче 3 символов' : null,
      price: (value: number) => (value < 0 ? 'Цена не может быть отрицательной' : null),
      category: (value: AdCategory) => (!value ? 'Выберите категорию' : null),
    },
  });

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
        params: {
          ...DEFAULT_PARAMS,
          ...(ad.params || {}),
        },
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

  const updateMutation = useMutation({
    mutationFn: (values: ItemUpdateIn) => updateAd(id!, values),
    onSuccess: () => {
      removeDraft();
      queryClient.invalidateQueries({ queryKey: ['ad', id] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });

      notifications.show({
        title: 'Успех!',
        message: 'Объявление сохранено',
        color: 'green',
      });

      navigate(`/ads/${id}`);
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось сохранить изменения',
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

  if (isLoading)
    return (
      <Center h={300}>
        <Loader />
      </Center>
    );
  if (isError || !ad) return <Alert color="red">Ошибка загрузки товара.</Alert>;

  return (
    <Container size="sm" py="xl">
      <Button variant="subtle" mb="md" onClick={() => clearDraftAndNavigate(`/ads/${id}`)}>
        ← Назад к просмотру
      </Button>

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
              withAsterisk
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
              {...form.getInputProps('title')}
            />

            <NumberInput
              label="Цена (₽)"
              placeholder="0"
              min={0}
              withAsterisk
              {...form.getInputProps('price')}
            />

            <Divider my="sm" label="Характеристики" labelPosition="center" />

            <DynamicParamsFields category={form.values.category} form={form} />

            <Divider my="sm" />

            <Textarea
              label="Описание"
              placeholder="Подробно опишите товар..."
              minRows={4}
              autosize
              {...form.getInputProps('description')}
            />
            <Text size="xs" c="dimmed" ta="right">
              Символов: {form.values.description?.length || 0}
            </Text>

            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={() => clearDraftAndNavigate(`/ads/${id}`)}>
                Отменить
              </Button>
              <Button type="submit" color="blue" loading={updateMutation.isPending}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
