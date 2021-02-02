import React, { memo, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import './style.css'


function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

function getRange(count) {
  const arr = [];
  for (let idx = 0; idx < count; idx += 1) {
    arr.push(idx);
  }
  return arr;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomValues(count, date = new Date()) {
  return getRange(count).map((index) => {
    return {
      date: shiftDate(date, -index),
      count: getRandomInt(1, 3),
    };
  });
}

export default memo(function Calendar() {
  const [state, setState] = useState(generateRandomValues(200));

  const getTooltipDataAttrs = (value) => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      'data-tip': `${value.date.toISOString().slice(0, 10)} has count: ${value.count}`,
    };
  }

  const handleClick = (value) => {
    alert(`You clicked on ${value.date.toISOString().slice(0, 10)} with count: ${value.count}`);
  }
  return (
    <>
      <CalendarHeatmap
        values={state}
        classForValue={(state) => {
          if (!state) {
            return 'color-empty';
          }
          return `color-github-${state.count}`;
        }}
        tooltipDataAttrs={getTooltipDataAttrs}
        onClick={handleClick}
      />
      <ReactTooltip />
    </>
  );
})
/**
 * startDate={new Date('2021-01-01')}
 * endDate={new Date('2021-12-31')}
 */