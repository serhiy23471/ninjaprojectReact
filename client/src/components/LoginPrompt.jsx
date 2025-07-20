export default function LoginPrompt() {
  return (
    <div className="login-message max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg text-center mb-6">
      <i className="fas fa-comment-slash text-5xl text-red-500 mb-4"></i>
      <h3 className="text-xl font-bold text-white mb-2">
        Чтобы оставить отзыв, войдите через Steam
      </h3>
      <p className="text-gray-400 mb-6">
        Авторизируйтесь, чтобы иметь возможность писать комментарии и читать все отзывы
      </p>
      <a
        href="http://localhost:5000/auth/steam" // URL на твій бекенд Steam login
        className="steam-btn text-white font-bold py-3 px-6 rounded-full inline-flex items-center mx-auto"
      >
        <i className="fab fa-steam mr-2"></i> Войти через Steam
      </a>
    </div>
  );
}
