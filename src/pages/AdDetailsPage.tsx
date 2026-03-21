import { useParams, Link } from 'react-router-dom';
import { Button } from '@mantine/core';

export const AdDetailsPage = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Страница просмотра объявления</h1>
      <h2>Мы смотрим товар с ID: {id}</h2>

      <Button component={Link} to={`/ads/${id}/edit`} variant="filled">
        Перейти к редактированию
      </Button>

      <br />
      <br />

      <Button component={Link} to="/ads" variant="outline">
        Вернуться к списку
      </Button>
    </div>
  );
};
