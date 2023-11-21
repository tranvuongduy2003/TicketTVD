import {
  format,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getYear
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

  const result = `${dayOfWeekNames[dayOfWeek]}, ${dayOfMonth} tháng ${
    month + 1
  } | ${format(date, 'hh:mm aa')}`;

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
  const dayOfMonth = date.getDate().toLocaleString('vi-VN', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  const month = getMonth(date).toLocaleString('vi-VN', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  const year = getYear(date);

  const result = new Date(
    `${year}-${month}-${dayOfMonth} ${time.toTimeString().split(' ')[0]}`
  );

  return result;
};
