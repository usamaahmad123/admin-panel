import { format, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}
export const NameField = (event) => {
  const userGetData = event.which;
  if (
    !(userGetData >= 65 && userGetData <= 95) &&
    userGetData !== 32 &&
    userGetData !== 0 &&
    userGetData !== 8 &&
    userGetData !== 9 &&
    userGetData !== 13
  ) {
    event.preventDefault();
  }
};
