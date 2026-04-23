import { useState, useEffect } from 'react';

export default function AvailabilityCalendar({ poolId, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({
    start: null,
    end: null,
  });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (!selectedDates.start) {
      setSelectedDates({ start: selectedDate, end: null });
    } else if (!selectedDates.end) {
      if (selectedDate > selectedDates.start) {
        setSelectedDates({ start: selectedDates.start, end: selectedDate });
        onDateSelect(selectedDates.start, selectedDate);
      } else {
        setSelectedDates({ start: selectedDate, end: null });
      }
    } else {
      setSelectedDates({ start: selectedDate, end: null });
    }
  };

  const isDateInRange = (day) => {
    if (!selectedDates.start || !selectedDates.end) return false;

    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const isDateSelected = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    return (
      (selectedDates.start &&
        date.toDateString() === selectedDates.start.toDateString()) ||
      (selectedDates.end &&
        date.toDateString() === selectedDates.end.toDateString())
    );
  };

  const monthDays = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let day = 1; day <= monthDays; day++) {
    days.push(day);
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="text-blue-600 hover:text-blue-700 font-bold"
        >
          ←
        </button>

        <h3 className="text-xl font-bold">
          {currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="text-blue-600 hover:text-blue-700 font-bold"
        >
          →
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => day && handleDateClick(day)}
            disabled={!day}
            className={`p-3 text-center rounded font-bold text-sm ${
              !day
                ? 'bg-gray-50 cursor-default'
                : isDateSelected(day)
                ? 'bg-blue-600 text-white'
                : isDateInRange(day)
                ? 'bg-blue-200 text-blue-900'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Selected dates display */}
      <div className="mt-6 pt-6 border-t">
        <p className="text-gray-600 text-sm mb-2">Selected Dates:</p>
        <div className="space-y-2">
          <p className="font-bold">
            Check-in:{' '}
            {selectedDates.start
              ? selectedDates.start.toLocaleDateString()
              : 'Not selected'}
          </p>
          <p className="font-bold">
            Check-out:{' '}
            {selectedDates.end
              ? selectedDates.end.toLocaleDateString()
              : 'Not selected'}
          </p>
        </div>
      </div>
    </div>
  );
}