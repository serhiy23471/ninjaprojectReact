import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { format } from "date-fns";
import adminSteamIds from "../adminList";

export default function CommentsSection() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [rating, setRating] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const commentsPerPage = 4;

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });
        setUser(res.data.steamid ? res.data : null);
      } catch (e) {
        console.error("Помилка отримання користувача", e);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      const res = await axios.get("http://localhost:5000/api/reviews", {
        withCredentials: true,
      });
      console.log("Отримані коментарі:", res.data);
      setComments(res.data);
    } catch (e) {
      console.error("Помилка завантаження коментарів", e);
      setError("Не вдалося завантажити коментарі");
    }
  }

  const isAdmin = user && adminSteamIds.includes(user.steamid);

  const structuredComments = useMemo(() => {
    const map = {};
    const roots = [];
    
    const commentsCopy = comments.map(c => ({ ...c, replies: [] }));
    
    commentsCopy.forEach(c => {
      map[c.id] = c;
    });
    
    commentsCopy.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies.push(c);
      } else {
        roots.push(c);
      }
    });
    
    roots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    roots.forEach(c => c.replies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
    
    return roots;
  }, [comments]);

  const paginatedComments = structuredComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );
  const totalPages = Math.ceil(structuredComments.length / commentsPerPage);

  const handleSubmit = async () => {
    if (!user) {
      setError("Спочатку увійдіть через Steam");
      return;
    }
    if (!newComment.trim()) {
      setError("Введіть текст коментаря");
      return;
    }
    if (rating === 0) {
      setError("Виберіть рейтинг");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          username: user.personaname,
          steamid: user.steamid,
          avatar: user.avatarfull,
          comment: newComment,
          rating: rating,
          parent_id: null,
          is_admin_reply: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { withCredentials: true }
      );
      
      setNewComment("");
      setRating(0);
      setSuccess("Коментар успішно додано");
      await fetchComments();
    } catch (e) {
      console.error("Помилка додавання", e);
      setError("Помилка додавання коментаря: " + e.message);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!user) {
      setError("Спочатку увійдіть через Steam");
      return;
    }
    if (!replyText.trim()) {
      setError("Введіть текст відповіді");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          username: user.personaname,
          steamid: user.steamid,
          avatar: user.avatarfull,
          comment: replyText,
          rating: 0,
          parent_id: parentId,
          is_admin_reply: isAdmin,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { withCredentials: true }
      );
      
      setReplyText("");
      setReplyingTo(null);
      setSuccess("Відповідь успішно додана");
      await fetchComments();
    } catch (e) {
      console.error("Помилка додавання відповіді", e);
      setError("Помилка додавання відповіді: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ви впевнені?")) {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
          withCredentials: true,
        });
        setSuccess("Коментар видалено");
        await fetchComments();
      } catch (e) {
        console.error("Помилка видалення", e);
        setError("Помилка видалення: " + e.message);
      }
    }
  };

  if (loadingUser) {
    return <div style={{ color: "white", textAlign: "center" }}>Завантаження...</div>;
  }

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "20px", color: "white" }}>
      <h2 className="h2-title" style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px" }}>
        ОТЗЫВЫ ИГРОКОВ
      </h2>

      {!user && (
        <div style={{ 
          color: "white",
          textAlign: "center",
          padding: "32px",
          backgroundColor: "#2d3748",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          <i className="fas fa-comment-slash" style={{ 
            fontSize: "3rem", 
            color: "#f56565", 
            marginBottom: "1rem",
            display: "block" 
          }}></i>
          <p style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            Щоб залишити відгук, увійдіть через Steam
          </p>
          <p style={{ color: "#a0aec0", marginBottom: "1.5rem" }}>
            Авторизуйтесь, щоб мати можливість писати коментарі
          </p>
          <a
            href="http://localhost:5000/auth/steam"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#1b2838",
              color: "#66c0f4",
              borderRadius: "9999px",
              fontWeight: "bold",
              textDecoration: "none",
              border: "2px solid #66c0f4"
            }}
          >
            <i className="fab fa-steam" style={{ marginRight: "0.5rem" }}></i>
            Вхід через Steam
          </a>
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: "rgba(245, 101, 101, 0.1)",
          color: "#f56565",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          backgroundColor: "rgba(72, 187, 120, 0.1)",
          color: "#48bb78",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
          textAlign: "center"
        }}>
          {success}
        </div>
      )}

      {user && (
        <div style={{ 
          marginBottom: "30px",
          backgroundColor: "rgb(31 41 55)",
          borderRadius: "8px",
          padding: "15px"
        }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <img
              src={user.avatarfull}
              alt={user.personaname}
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%" 
              }}
            />
            <textarea
              rows={3}
              style={{
                flex: 1,
                borderRadius: "6px",
                border: "1px solid #444",
                backgroundColor: "#2d3748",
                color: "white",
                padding: "10px",
                resize: "vertical"
              }}
              placeholder="Напишіть коментар..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star === rating ? 0 : star)}
                style={{
                  cursor: "pointer",
                  color: star <= rating ? "#FFD700" : "#4a5568",
                  fontSize: "24px"
                }}
              />
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || rating === 0}
              style={{
                backgroundColor: "#e53e3e",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Відправити
            </button>
          </div>
        </div>
      )}

      {paginatedComments.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa" }}>Немає коментарів</p>
      )}

      {paginatedComments.map((comment) => (
        <div
          key={comment.id}
          style={{
            marginBottom: "20px",
            backgroundColor: "rgb(31 41 55)",
            borderRadius: "8px",
            padding: "15px"
          }}
        >
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <img
              src={comment.avatar || "https://via.placeholder.com/40"}
              alt={comment.username}
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%" 
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <strong>{comment.username}</strong>
                <span style={{ color: "#a0aec0", fontSize: "12px" }}>
                  {format(new Date(comment.created_at), "yyyy-MM-dd HH:mm")}
                </span>
              </div>

              {comment.rating > 0 && (
                <div style={{ 
                  color: "#FFD700", 
                  fontSize: "22px", 
                  margin: "5px 0" 
                }}>
                  {"★".repeat(comment.rating)}
                </div>
              )}

              <p style={{ margin: "10px 0" }}>{comment.comment}</p>

              {isAdmin && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  gap: "15px",
                  marginTop: "10px"
                }}>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    style={{
                      color: "#a0aec0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    Ответить
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    style={{
                      color: "#a0aec0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          </div>

          {replyingTo === comment.id && (
            <div style={{ 
              marginLeft: "40px", 
              marginTop: "15px",
              backgroundColor: "rgb(45 55 72)",
              borderRadius: "8px",
              padding: "15px",
              borderLeft: "3px solid #e53e3e"
            }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <img
                  src={user.avatarfull}
                  alt={user.personaname}
                  style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "50%" 
                  }}
                />
                <textarea
                  rows={3}
                  style={{
                    flex: 1,
                    borderRadius: "6px",
                    border: "1px solid #444",
                    backgroundColor: "#2d3748",
                    color: "white",
                    padding: "10px",
                    resize: "vertical"
                  }}
                  placeholder="Напишіть відповідь..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
              <div style={{ textAlign: "right" }}>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                    setError(null);
                  }}
                  style={{
                    marginRight: "10px",
                    backgroundColor: "transparent",
                    color: "#aaa",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Відміна
                </button>
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={!replyText.trim()}
                  style={{
                    backgroundColor: "#e53e3e",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Відправити
                </button>
              </div>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div style={{ marginLeft: "40px", marginTop: "15px" }}>
              {comment.replies.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    backgroundColor: "rgb(45 55 72)",
                    borderRadius: "4px",
                    borderLeft: "3px solid #e53e3e"
                  }}
                >
                  <div style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
                    <img
                      src={reply.avatar || "https://via.placeholder.com/36"}
                      alt={reply.username}
                      style={{ 
                        width: "30px", 
                        height: "30px", 
                        borderRadius: "50%" 
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <strong style={{ color: "#ffffffff" }}>
                            {reply.username}
                          </strong>
                          <span style={{
                            backgroundColor: "#e53e3e",
                            color: "white",
                            fontSize: "12px",
                            padding: "2px 6px",
                            borderRadius: "4px"
                          }}>
                            Администрация
                          </span>
                        </div>
                        <span style={{ color: "#a0aec0", fontSize: "12px" }}>
                          {format(new Date(reply.created_at), "yyyy-MM-dd HH:mm")}
                        </span>
                      </div>

                      <p style={{ margin: "5px 0", fontSize: "14px" }}>{reply.comment}</p>

                      {isAdmin && (
                        <div style={{ textAlign: "right" }}>
                          <button
                            onClick={() => handleDelete(reply.id)}
                            style={{
                              color: "#a0aec0",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: 0
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "10px", 
          marginTop: "30px"
        }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            style={{
              padding: "5px 10px",
              backgroundColor: currentPage === 1 ? "#2d3748" : "#e53e3e",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            &lt;
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let page;
            if (totalPages <= 5) page = i + 1;
            else if (currentPage <= 3) page = i + 1;
            else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
            else page = currentPage - 2 + i;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: "5px 12px",
                  backgroundColor: currentPage === page ? "#e53e3e" : "#2d3748",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                {page}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            style={{
              padding: "5px 10px",
              backgroundColor: currentPage === totalPages ? "#2d3748" : "#e53e3e",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
