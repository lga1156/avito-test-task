import { Box, Stack, Text, Button, Group } from '@mantine/core';

export type AiTooltipState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: string }
  | { status: 'error' };

interface AiTooltipProps {
  state: AiTooltipState;
  onApply?: (result: string) => void;
  onClose: () => void;
  onRetry: () => void;
}

export const AiTooltip = ({ state, onApply, onClose }: AiTooltipProps) => {
  if (state.status === 'idle' || state.status === 'loading') return null;

  return (
    <Box
      mt="xs"
      p="md"
      style={{
        background: 'var(--mantine-color-body)',
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 8,
        boxShadow: 'var(--mantine-shadow-sm)',
      }}
    >
      {state.status === 'error' && (
        <Stack gap="xs">
          <Text size="sm" fw={600} c="red">
            Произошла ошибка при запросе к AI
          </Text>
          <Text size="xs" c="dimmed">
            Попробуйте повторить запрос или закройте уведомление
          </Text>
          <Button size="xs" variant="light" color="red" w="fit-content" onClick={onClose}>
            Закрыть
          </Button>
        </Stack>
      )}

      {state.status === 'success' && (
        <Stack gap="sm">
          <Text size="sm" fw={600} c="dimmed">
            Ответ AI:
          </Text>
          <Text size="sm" style={{ whiteSpace: 'pre-wrap', color: 'var(--mantine-color-text)' }}>
            {state.result}
          </Text>
          <Group gap="xs">
            {onApply && (
              <Button size="xs" color="blue" onClick={() => onApply(state.result)}>
                Применить
              </Button>
            )}
            <Button size="xs" variant="default" onClick={onClose}>
              Закрыть
            </Button>
          </Group>
        </Stack>
      )}
    </Box>
  );
};
