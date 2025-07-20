import React, { useState, useCallback } from 'react';

function StarRating({ rating }) {
  return (
    <div className="flex space-x-1" aria-label={`Рейтинг: ${rating} з 5 зірок`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="none"
          aria-hidden="true"
        >
          <path d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.886-1L12 2l3.114 6.755 6.886 1-4.997 4.367 1.178 6.873z" />
        </svg>
      ))}
    </div>
  );
}

export default function CommentItem({ comment, currentUser, onDelete, onReply }) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Ви дійсно хочете видалити цей коментар?')) return;
    try {
      const res = await fetch(`/api/comments/${comment.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Помилка видалення');
      onDelete(comment.id);
    } catch (error) {
      alert('Не вдалося видалити коментар');
    }
  }, [comment.id, onDelete]);

  const handleReplySubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText }),
      });
      if (!res.ok) throw new Error('Помилка відправки відповіді');
      const newReply = await res.json();
      onReply(comment.id, newReply);
      setReplyText('');
      setReplying(false);
    } catch (error) {
      alert('Не вдалося відправити відповідь');
    } finally {
      setSubmittingReply(false);
    }
  }, [comment.id, replyText, onReply]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow" role="article" aria-label={`Коментар від ${comment.username}`}>
      <div className="flex items-center space-x-4 mb-2">
        <img
          src={comment.avatar}
          alt={`${comment.username} аватар`}
          className="w-10 h-10 rounded-full"
          loading="lazy"
        />
        <div>
          <p className="font-bold">{comment.username}</p>
          <p className="text-sm text-gray-400">
            {new Date(comment.created_at).toLocaleString('uk-UA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <StarRating rating={comment.rating} />
        </div>
      </div>

      <p className="mb-2 whitespace-pre-wrap">{comment.text}</p>

      {comment.reply?.text && (
        <div className="bg-gray-700 p-3 rounded ml-14 mb-2" role="region" aria-label="Відповідь адміністрації">
          <p className="italic text-gray-300">Відповідь адміністрації:</p>
          <p className="whitespace-pre-wrap">{comment.reply.text}</p>
        </div>
      )}

      {currentUser?.isAdmin && (
        <div className="flex space-x-2 mt-2 ml-14">
          <button
            onClick={() => setReplying(!replying)}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            aria-pressed={replying}
            aria-label={replying ? 'Відмінити відповідь' : 'Відповісти'}
          >
            {replying ? 'Відмінити' : 'Відповісти'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            aria-label="Видалити коментар"
          >
            Видалити
          </button>
        </div>
      )}

      {replying && (
        <form onSubmit={handleReplySubmit} className="ml-14 mt-2" aria-live="polite">
          <textarea
            className="w-full bg-gray-700 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Напишіть відповідь..."
            disabled={submittingReply}
            aria-label="Текст відповіді"
          />
          <div className="flex justify-end mt-1">
            <button
              type="submit"
              disabled={submittingReply || !replyText.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white text-sm disabled:opacity-50"
            >
              {submittingReply ? 'Відправка...' : 'Відправити'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
