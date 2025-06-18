import { formatDistanceToNow, format } from 'date-fns';
import vi from 'date-fns/locale/vi';

export const DEFAULT_COVER_IMAGE_URL =
  'https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg';

export const DEFAULT_AUTHOR_IMAGE_URL =
  'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1';

export const ADMIN_DEFAULT_ITEM_PER_PAGE = 14;
export const AUTHOR_DEFAULT_ITEM_PER_PAGE = 12;

export const DEFAULT_ITEM_PER_PAGE = 20;

export const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
};

export const formatFullDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
};

export const capitalizeFirstLetter = (string) => {
  const words = string
    .split(' ')
    .map((word) => word.toLowerCase())
    .join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};
