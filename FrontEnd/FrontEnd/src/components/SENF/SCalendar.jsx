import React from 'react';
import 'tailwindcss/tailwind.css';

const SCalendar = () => {
  return (
    <div className="calendar-container flex justify-center items-center p-6 bg-gray-50">
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=UTC&showPrint=0&title=To-do&src=MjIwMTEwMjg0M0BzdHVkZW50LmJ1a3N1LmVkdS5waA&src=ZW4ucGhpbGlwcGluZXMjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%230B8043&color=%230B8043"
        className="border rounded-lg shadow-lg"
        style={{ width: '100%', height: '700px' }}
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default SCalendar;
