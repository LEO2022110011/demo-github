import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime);

export function timeAgo(timeStr) {
  const time = dayjs(timeStr);
  const now = dayjs();

  // If the time is more than a year ago, return the original time string
  if (now.diff(time, 'month') > 1) {
    return timeStr;
  }
  
  // Otherwise, return a relative time string (e.g., "3 days ago")
  return time.from(now);
}


