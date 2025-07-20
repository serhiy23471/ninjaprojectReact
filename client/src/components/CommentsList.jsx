import Comment from "./Comment";

export default function CommentsList({ comments, user, onReply, onDelete }) {
  // Фільтруємо кореневі коментарі
  const rootComments = comments.filter((c) => !c.parent_id);

  // Функція для отримання відповідей для коментаря
  const getReplies = (commentId) =>
    comments.filter((c) => c.parent_id === commentId);

  return (
    <div className="max-w-2xl mx-auto">
      {comments.length === 0 && (
        <p className="text-center text-gray-400">Ще немає відгуків</p>
      )}

      {rootComments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          user={user}
          onReply={onReply}
          onDelete={onDelete}
        >
          {/* Відповіді */}
          {getReplies(comment.id).map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              user={user}
              onReply={() => {}} // відповіді не можна відповісти (або можна за бажанням)
              onDelete={onDelete}
            />
          ))}
        </Comment>
      ))}
    </div>
  );
}
