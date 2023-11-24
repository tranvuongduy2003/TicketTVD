import {
  format,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getSeconds
} from 'date-fns';

export const formatDate = (date: Date) => {
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

  const result = `${dayOfWeekNames[dayOfWeek]}, ${dayOfMonth + 1} tháng ${
    month + 1
  } | ${date.toLocaleString('en-EN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}`;

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
  const hours = getHours(time);

  const minutes = getMinutes(time);

  const seconds = getSeconds(time);

  const result = new Date(
    `${date.toDateString()} ${hours}:${minutes}:${seconds} GMT+0700`
  );

  return result;
};
