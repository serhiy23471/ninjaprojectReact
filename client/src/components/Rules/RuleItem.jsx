import React from "react";

export default function RuleItem({
  title,
  description,
  punishment,
  duration,
  noteTitle,
  note,
}) {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
        <p className="text-gray-300 mb-3">{description}</p>
        {note && (
          <div className="bg-gray-800 p-4 rounded-lg mb-3">
            <p className="text-yellow-400 font-bold mb-1">{noteTitle}</p>
            <p className="text-gray-300">{note}</p>
          </div>
        )}
        {(punishment || duration) && (
          <div className="flex justify-between text-gray-300">
            {punishment && (
              <div>
                <span className="font-bold">⚠️ Наказание:</span>{" "}
                <span className="text-red-600">{punishment}</span>
              </div>
            )}
            {duration && (
              <div>
                <span className="font-bold">🕓 Продолжительность:</span> {duration}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
