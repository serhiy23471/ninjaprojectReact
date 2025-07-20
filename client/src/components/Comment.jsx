export default function Comment({ comment, user, onReply, onDelete, children }) {
  const isAdmin = user?.isAdmin;
  const commentIsAdmin = comment.is_admin_reply || false;
  const isCommentAuthorAdmin = comment.is_admin_reply || (user?.steamid && user.isAdmin && user.steamid === comment.steamid);

  return (
    <div className="p-4 bg-gray-800 rounded-lg mb-4">
      <div className="flex items-center space-x-3 mb-2">
        <img
          src={comment.avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-bold text-white">
            {comment.username}{" "}
            {isCommentAuthorAdmin && (
              <span className="text-sm text-red-500 font-semibold ml-2">
                Адміністратор
              </span>
            )}
          </p>
          <p className="text-yellow-400">Рейтинг: {comment.rating} ★</p>
        </div>
      </div>
      <p className="text-gray-300 mb-2 whitespace-pre-wrap">{comment.comment}</p>

      {/* Відповіді (children) */}
      <div className="ml-8">{children}</div>

      {isAdmin && !commentIsAdmin && (
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => onReply(comment.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
          >
            Відповісти
          </button>
          <button
            onClick={() => {
              if (window.confirm("Видалити цей коментар?")) {
                onDelete(comment.id);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Видалити
          </button>
        </div>
      )}
    </div>
  );
}
