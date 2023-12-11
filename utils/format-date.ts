import { format, getDay, getMonth } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date: Date) => {
  const isoDate = date.toISOString();
  const timePartition = isoDate.split('T')[1].split(':');
  const hour = timePartition[0];
  const minute = timePartition[1];
  const dateClone = new Date(date);
  dateClone.setHours(parseInt(hour, 10));
  dateClone.setMinutes(parseInt(minute, 10));

  const result = format(dateClone, 'EEEE, d MMMM, yyyy | hh:mm a', {
    locale: vi
  });

  return result;
};

export const formatDateToLocaleDate = (date: Date) => {
  // Lấy các thành phần cần thiết từ ngày
  const dayOfWeek = getDay(date);
  const dayOfMonth = date.getDate();
  const month = getMonth(date);

  // Mảng chứa tên các ngày trong tuần
  const dayOfWeekNames = [
    'Chủ Nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7'
  ];

  const result = `${dayOfWeekNames[dayOfWeek]}, ${dayOfMonth} tháng ${month}`;

  return result;
};

export const formatDateToTime = (date: Date) => {
  return format(date, 'hh:mm aa');
};

export const concatDateWithTime = (date: Date, time: Date) => {
  const isoString =
    format(new Date(date), 'yyyy-MM-dd') +
    'T' +
    format(new Date(time), 'HH:mm:00') +
    '.000Z';

  const combined = new Date(isoString);

  return combined;
};

export const convertToISODate = (date: Date) => {
  const isoString =
    format(new Date(date), 'yyyy-MM-dd') +
    'T' +
    format(new Date(date), 'HH:mm:00') +
    '.000Z';

  const result = new Date(isoString);

  return result;
};
