import React, { useState } from 'react';

export default function CommentForm({ user, onAdd }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || rating === 0) {
      alert('Пожалуйста, введите текст и выберите рейтинг');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          rating,
        }),
      });
      if (!response.ok) throw new Error('Ошибка отправки');
      const newComment = await response.json();

      onAdd(newComment); // повідомляємо батьківському компоненту

      setText('');
      setRating(0);
    } catch (error) {
      alert('Ошибка при отправке комментария');
      console.error(error);
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
      <div className="flex items-start space-x-4 mb-4">
        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
          className="flex-1 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Напишите ваш отзыв о сервере..."
          disabled={submitting}
        />
      </div>

      <div className="mb-4 flex space-x-1 select-none cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 transition-colors ${
              (hover || rating) >= star ? 'text-yellow-400' : 'text-gray-400'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="none"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <path d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.886-1L12 2l3.114 6.755 6.886 1-4.997 4.367 1.178 6.873z" />
          </svg>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition duration-300 disabled:opacity-50"
        >
          {submitting ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </form>
  );
}
