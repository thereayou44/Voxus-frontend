import { format } from 'date-fns';

export function formatDate(date: string | Date) {
  return format(new Date(date), 'HH:mm dd.MM.yyyy');
} 