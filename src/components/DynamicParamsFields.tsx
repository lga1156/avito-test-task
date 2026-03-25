import { Stack, TextInput, NumberInput, Select, ActionIcon } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import type { AdCategory, ItemUpdateIn, AutoItemParams, RealEstateItemParams, ElectronicsItemParams } from '../types';

const warningInputStyles = {
  input: {
    borderColor: '#FCC419',
    '&:focus': { borderColor: '#FCC419' },
  },
};

const ClearButton = ({ onClear }: { onClear: () => void }) => (
  <ActionIcon variant="subtle" color="gray" size="sm" onClick={onClear}>
    <IconX size={14} />
  </ActionIcon>
);

interface DynamicParamsFieldsProps {
  category: AdCategory;
  form: UseFormReturnType<ItemUpdateIn>;
}

export const DynamicParamsFields = ({ category, form }: DynamicParamsFieldsProps) => {
  if (category === 'auto') {
    const p = form.values.params as AutoItemParams;
    return (
      <Stack gap="md">
        <TextInput
          label="Марка"
          placeholder="BMW"
          styles={!p.brand ? warningInputStyles : undefined}
          rightSection={p.brand ? <ClearButton onClear={() => form.setFieldValue('params.brand', '')} /> : null}
          {...form.getInputProps('params.brand')}
        />
        <TextInput
          label="Модель"
          placeholder="X5"
          styles={!p.model ? warningInputStyles : undefined}
          rightSection={p.model ? <ClearButton onClear={() => form.setFieldValue('params.model', '')} /> : null}
          {...form.getInputProps('params.model')}
        />
        <NumberInput
          label="Год выпуска"
          placeholder="2020"
          hideControls
          styles={!p.yearOfManufacture ? warningInputStyles : undefined}
          {...form.getInputProps('params.yearOfManufacture')}
        />
        <Select
          label="Коробка передач"
          placeholder="Выберите"
          styles={!p.transmission ? warningInputStyles : undefined}
          data={[
            { value: 'automatic', label: 'Автомат' },
            { value: 'manual', label: 'Механика' },
          ]}
          {...form.getInputProps('params.transmission')}
        />
        <NumberInput
          label="Пробег (км)"
          placeholder="50000"
          hideControls
          styles={!p.mileage ? warningInputStyles : undefined}
          {...form.getInputProps('params.mileage')}
        />
        <NumberInput
          label="Мощность (л.с.)"
          placeholder="249"
          hideControls
          styles={!p.enginePower ? warningInputStyles : undefined}
          {...form.getInputProps('params.enginePower')}
        />
      </Stack>
    );
  }

  if (category === 'real_estate') {
    const p = form.values.params as RealEstateItemParams;
    return (
      <Stack gap="md">
        <Select
          label="Тип недвижимости"
          placeholder="Выберите"
          styles={!p.type ? warningInputStyles : undefined}
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
          styles={!p.address ? warningInputStyles : undefined}
          rightSection={p.address ? <ClearButton onClear={() => form.setFieldValue('params.address', '')} /> : null}
          {...form.getInputProps('params.address')}
        />
        <NumberInput
          label="Площадь (м²)"
          placeholder="50"
          hideControls
          styles={!p.area ? warningInputStyles : undefined}
          {...form.getInputProps('params.area')}
        />
        <NumberInput
          label="Этаж"
          placeholder="5"
          hideControls
          styles={!p.floor ? warningInputStyles : undefined}
          {...form.getInputProps('params.floor')}
        />
      </Stack>
    );
  }

  if (category === 'electronics') {
    const p = form.values.params as ElectronicsItemParams;
    return (
      <Stack gap="md">
        <Select
          label="Тип устройства"
          placeholder="Выберите"
          styles={!p.type ? warningInputStyles : undefined}
          data={[
            { value: 'phone', label: 'Телефон' },
            { value: 'laptop', label: 'Ноутбук' },
            { value: 'misc', label: 'Другое' },
          ]}
          {...form.getInputProps('params.type')}
        />
        <TextInput
          label="Бренд"
          placeholder="Apple"
          styles={!p.brand ? warningInputStyles : undefined}
          rightSection={p.brand ? <ClearButton onClear={() => form.setFieldValue('params.brand', '')} /> : null}
          {...form.getInputProps('params.brand')}
        />
        <TextInput
          label="Модель"
          placeholder="iPhone 15"
          styles={!p.model ? warningInputStyles : undefined}
          rightSection={p.model ? <ClearButton onClear={() => form.setFieldValue('params.model', '')} /> : null}
          {...form.getInputProps('params.model')}
        />
        <TextInput
          label="Цвет"
          placeholder="Черный"
          styles={!p.color ? warningInputStyles : undefined}
          rightSection={p.color ? <ClearButton onClear={() => form.setFieldValue('params.color', '')} /> : null}
          {...form.getInputProps('params.color')}
        />
        <Select
          label="Состояние"
          placeholder="Выберите"
          styles={!p.condition ? warningInputStyles : undefined}
          data={[
            { value: 'new', label: 'Новое' },
            { value: 'used', label: 'Б/У' },
          ]}
          {...form.getInputProps('params.condition')}
        />
      </Stack>
    );
  }

  return null;
};
