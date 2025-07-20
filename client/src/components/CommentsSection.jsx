import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CommentsSection() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);

  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user", { withCredentials: true })
      .then((res) => {
        if (res.data.steamid) setUser(res.data);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (!commentText.trim()) {
      setMessage({ type: "error", text: "Коментар не може бути порожнім" });
      return;
    }
    if (rating === 0) {
      setMessage({ type: "error", text: "Оберіть рейтинг" });
      return;
    }

    axios
      .post(
        "http://localhost:5000/api/comments",
        {
          text: commentText,
          rating,
          username: user.username,
          steamid: user.steamid,
          avatar: user.avatar,
        },
        { withCredentials: true }
      )
      .then(() => {
        setMessage({ type: "success", text: "Коментар успішно додано!" });
        setCommentText("");
        setRating(0);
      })
      .catch(() => {
        setMessage({
          type: "error",
          text: "Помилка при додаванні коментаря, спробуйте пізніше.",
        });
      });
  };

  if (loadingUser) return <div>Завантаження...</div>;

  return (
    <section
      id="comments"
      className="py-16 bg-gray-900"
      style={{ maxWidth: "768px", margin: "0 auto", paddingLeft: "1rem", paddingRight: "1rem" }}
    >
      <h2
        className="text-3xl font-bold text-center mb-12 ninja-text"
        style={{ color: "white", textTransform: "uppercase" }}
      >
        ОТЗЫВЫ ИГРОКОВ
      </h2>

      {!user ? (
        <div
          id="login-message"
          className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg text-center login-message"
          style={{ marginBottom: "20px", color: "white" }}
        >
          <i
            className="fas fa-comment-slash text-5xl text-red-500 mb-4"
            style={{ fontSize: "3rem", color: "#f56565", marginBottom: "1rem" }}
          ></i>
          <h3 className="text-xl font-bold mb-2" style={{ color: "white" }}>
            Чтобы оставить отзыв, войдите через Steam
          </h3>
          <p className="text-gray-400 mb-6" style={{ color: "#a0aec0" }}>
            Авторизируйтесь, чтобы иметь возможность писать комментарии и читать все отзывы
          </p>
          <a
            href="http://localhost:5000/auth/steam"
            className="steam-btn text-white font-bold py-3 px-6 rounded-full inline-flex items-center mx-auto"
            style={{
              backgroundColor: "#1b2838",
              border: "2px solid #66c0f4",
              color: "#66c0f4",
              fontWeight: "700",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              textDecoration: "none",
              justifyContent: "center",
            }}
          >
            <i className="fab fa-steam mr-2" style={{ marginRight: "0.5rem" }}></i> Войти через Steam
          </a>
        </div>
      ) : (
        <div id="comment-form-container" className="max-w-2xl mx-auto mb-8">
          <div
            className="bg-gray-800 rounded-lg p-6 shadow-lg comment-form"
            style={{ color: "white" }}
          >
            <div className="flex items-start space-x-4 mb-4" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <img
                id="comment-user-avatar"
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
                style={{ width: "40px", height: "40px", borderRadius: "9999px" }}
              />
              <div style={{ flex: 1 }}>
                <textarea
                  id="comment-text"
                  className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Напишите ваш отзыв о сервере..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#4a5568",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    color: "white",
                    border: "none",
                    resize: "vertical",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Рейтинг зірочками */}
            <div
              id="rating-stars"
              className="mb-4 flex space-x-1 cursor-pointer select-none"
              style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem", cursor: "pointer", userSelect: "none" }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  data-value={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 star"
                  fill={star <= rating ? "rgb(250 204 21)" : "gray"}
                  viewBox="0 0 24 24"
                  stroke="none"
                  onClick={() => handleStarClick(star)}
                  style={{ width: "32px", height: "32px", cursor: "pointer" }}
                >
                  <path d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.886-1L12 2l3.114 6.755 6.886 1-4.997 4.367 1.178 6.873z" />
                </svg>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                id="submit-comment-btn"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition duration-300"
                onClick={handleSubmit}
                style={{
                  backgroundColor: "#e53e3e",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "1rem",
                }}
              >
                Отправить
              </button>
            </div>

            {message && (
              <div
                style={{
                  marginTop: "12px",
                  color: message.type === "error" ? "#f56565" : "#48bb78",
                  fontWeight: "600",
                }}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Місце для виводу списку коментарів (пізніше можна додати) */}
      <div id="comments-list-container" className="max-w-2xl mx-auto hidden"></div>
    </section>
  );
}
