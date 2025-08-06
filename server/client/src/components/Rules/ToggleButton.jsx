import React from "react";

export default function ToggleButton({ title, isOpen, onClick }) {
  return (
    <button
      className="w-full flex justify-between items-center p-6 bg-gray-800 hover:bg-gray-700 transition duration-300"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <i
        className={`fas fa-chevron-down text-red-500 transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
