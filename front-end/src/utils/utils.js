import { formatDistanceToNow } from 'date-fns';
import vi from 'date-fns/locale/vi';

export const DEFAULT_COVER_IMAGE_URL =
  'https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg';

export const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
};

export const capitalizeFirstLetter = (string) => {
  const words = string
    .split(' ')
    .map((word) => word.toLowerCase())
    .join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};
