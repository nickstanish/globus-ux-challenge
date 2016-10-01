import moment from 'moment-timezone';
import escape from 'html-escape';

const STATUS = {
  INACTIVE: 'INACTIVE', // No start date
  ERROR: 'ERROR', // Has a start date and an end date, but total != processed
  SUCCESS: 'SUCCESS', // Has a start date and an end date, and total == processed
  IN_PROGRESS: 'IN_PROGRESS' // Has a start date and no end date, and total != processed
};

export function formatDateTimeString(date) {
  return moment.parseZone(date).local().format('M/D/YYYY h:mm A');
}

function padNumber(value) {
  const text = value + '';
  if (text.length < 2) {
    return '0' + text;
  }
  return text;
}
export function formatDuration(durationMs) {
  const limit = moment.duration(2, 'days');
  const duration = moment.duration(durationMs);
  if (duration.valueOf() >= limit.valueOf()) {
    return Math.round(duration.asDays()) + ' days';
  }
  const hours = duration.days() * 24 + duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

function getStatus(item) {
  if (!item.start_date) {
    return STATUS.INACTIVE;
  }
  if (!item.end_date) {
    return STATUS.IN_PROGRESS;
  }
  if (item.total === item.processed) {
    return STATUS.SUCCESS;
  }
  return STATUS.ERROR;
}

export function formatStatus(item) {
  const status = getStatus(item);
  switch (status) {
    case STATUS.INACTIVE:
      return 'Not Started';
    case STATUS.ERROR:
      return `Halted: ${formatDateTimeString(item.end_date)}`;
    case STATUS.SUCCESS:
      return `Completed: ${formatDateTimeString(item.end_date)}`
    case STATUS.IN_PROGRESS:
      // return `Time remaining: ${humanizeDuration(item.remaining, { round: true, largest: 1 })}`
      return `Time remaining: ${formatDuration(item.remaining)}`
    default:
      return null;
  }
}

export function highlight(text) {
  return escape(text).replace(/(fail)|(success)|(error)/ig, (match) => {
    return `<em class="bold">${match}</em>`;
  });
}

const STATUS_SORT_RANKING = {
  INACTIVE: 2,
  ERROR: 2,
  SUCCESS: 2,
  IN_PROGRESS: 1
}

function compareStatuses(item1, item2) {
  const status1 = getStatus(item1);
  const status2 = getStatus(item2);
  return STATUS_SORT_RANKING[status2] - STATUS_SORT_RANKING[status1];
}


export function sortData(item1, item2) {
  const comparison = compareStatuses(item1, item2);
  if (comparison !== 0) {
    return comparison;
  }
  return moment.parseZone(item2.end_date).diff(moment.parseZone(item1.end_date));
}
