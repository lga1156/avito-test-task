import { Button, Loader } from '@mantine/core';
import { IconBulb, IconRefresh } from '@tabler/icons-react';
import type { AiTooltipState } from './AiTooltip';

interface AiButtonProps {
  label: string;
  loadingLabel?: string;
  retryLabel?: string;
  tooltipState: AiTooltipState;
  onClick: () => void;
  size?: 'xs' | 'sm' | 'md';
  mb?: number;
}

export const AiButton = ({ label, tooltipState, onClick, size = 'sm', mb }: AiButtonProps) => {
  const isLoading = tooltipState.status === 'loading';
  const isDone = tooltipState.status === 'success' || tooltipState.status === 'error';

  return (
    <Button
      variant="light"
      color="yellow"
      size={size}
      leftSection={
        isLoading ? (
          <Loader size={size === 'xs' ? 12 : 14} color="#E67700" />
        ) : isDone ? (
          <IconRefresh size={size === 'xs' ? 12 : 14} />
        ) : (
          <IconBulb size={size === 'xs' ? 12 : 14} />
        )
      }
      mb={mb}
      onClick={onClick}
      disabled={isLoading}
      styles={{
        root: { color: '#E67700' },
        section: { color: '#E67700' },
      }}
    >
      {isLoading ? 'Выполняется запрос...' : isDone ? 'Повторить запрос' : label}
    </Button>
  );
};
