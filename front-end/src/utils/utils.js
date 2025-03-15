import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";

export const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
};

export const capitalizeFirstLetter = (string) => {
  const words = string
    .split(" ")
    .map((word) => word.toLowerCase())
    .join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};
