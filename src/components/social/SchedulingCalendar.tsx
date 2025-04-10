'use client';

import { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { SocialPost } from '@/models/social';

interface SchedulingCalendarProps {
  posts: SocialPost[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export default function SchedulingCalendar({ posts, onDateSelect, selectedDate }: SchedulingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  
  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for first day of month
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Check if a date has posts
  const hasPostsOnDate = (date: Date) => {
    const dateStr = formatDate(date);
    return posts.some(post => {
      if (!post.scheduledTime) return false;
      return formatDate(post.scheduledTime) === dateStr;
    });
  };
  
  // Check if a date is selected
  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return formatDate(date) === formatDate(selectedDate);
  };
  
  // Handle month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Handle date selection
  const handleDateClick = (date: Date) => {
    // Create a new date with the selected time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, minutes, 0, 0);
    
    onDateSelect(selectedDateTime);
  };
  
  // Handle time selection
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
    
    if (selectedDate) {
      // Update the selected date with the new time
      const [hours, minutes] = e.target.value.split(':').map(Number);
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(hours, minutes, 0, 0);
      
      onDateSelect(updatedDate);
    }
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const hasEvents = hasPostsOnDate(date);
      const isSelected = isSelectedDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(date)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm relative
            ${isSelected ? 'bg-blue-600 text-white' : ''}
            ${isToday && !isSelected ? 'border border-blue-600 text-blue-600' : ''}
            ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
          `}
        >
          {day}
          {hasEvents && !isSelected && (
            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
          )}
        </button>
      );
    }
    
    return days;
  };
  
  // Get month name
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
          Schedule Post
        </h3>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
        <h4 className="text-md font-medium">
          {monthName} {currentMonth.getFullYear()}
        </h4>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {generateCalendarDays()}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center mb-4">
          <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Select Time</span>
        </div>
        
        <select
          value={selectedTime}
          onChange={handleTimeChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {Array.from({ length: 24 }).map((_, hour) => (
            <>
              <option key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
                {hour.toString().padStart(2, '0')}:00
              </option>
              <option key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
                {hour.toString().padStart(2, '0')}:30
              </option>
            </>
          ))}
        </select>
      </div>
      
      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800 font-medium">
            Selected: {selectedDate.toLocaleDateString()} at {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
    </div>
  );
}
