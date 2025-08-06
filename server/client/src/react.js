// Обробник для кнопок правил
document.addEventListener('DOMContentLoaded', function () {
    const toggles = document.querySelectorAll('.rules-toggle');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function toggleRuleSection(toggle) {
        const container = toggle.nextElementSibling;
        const icon = toggle.querySelector('i');
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        // Оновлюємо стан
        const newState = !isExpanded;
        toggle.setAttribute('aria-expanded', newState.toString());

        // Анімація відкриття/закриття
        if (newState) {
            const contentHeight = container.scrollHeight;
            const maxHeight = isMobile ?
                Math.min(contentHeight, window.innerHeight * 0.7) :
                Math.min(contentHeight, 500);
            container.style.maxHeight = maxHeight + 'px';
            container.classList.add('active');
        } else {
            container.style.maxHeight = '0';
            container.classList.remove('active');
        }

        // Анімація іконки
        if (icon) {
            icon.classList.toggle('rotate-180');
        }

        console.log('Toggle state changed:', {
            element: toggle,
            state: newState ? 'open' : 'closed',
            classes: container.className
        });
    }

    // Ініціалізація всіх блоків
    toggles.forEach(toggle => {
        const container = toggle.nextElementSibling;

        // Спочатку всі закриті
        container.style.maxHeight = '0';
        toggle.setAttribute('aria-expanded', 'false');

        // Обробник кліку
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleRuleSection(this);

            // На мобільних закриваємо інші відкриті блоки
            if (isMobile && this.getAttribute('aria-expanded') === 'true') {
                toggles.forEach(t => {
                    if (t !== this && t.getAttribute('aria-expanded') === 'true') {
                        toggleRuleSection(t);
                    }
                });
            }
        });
    });

    // Для мобільних - закриття при кліку поза блоком
    if (isMobile) {
        document.addEventListener('click', function () {
            toggles.forEach(toggle => {
                if (toggle.getAttribute('aria-expanded') === 'true') {
                    toggleRuleSection(toggle);
                }
            });
        });

        // Запобігаємо закриттю при кліку всередині контейнера
        document.querySelectorAll('.rules-container').forEach(container => {
            container.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        });
    }
});

// Мобільне меню
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");
        const icon = mobileMenuButton.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
    });
}

// Закриття мобільного меню при кліку на посилання
document.querySelectorAll("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        const icon = mobileMenuButton.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    });
});

// Копіювання команди підключення
const copyConnectBtns = document.querySelectorAll(".copy-connect-btn");
copyConnectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const command = "connect 217.77.210.236:27038";
        navigator.clipboard.writeText(command).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check mr-1"></i> Скопійовано!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    });
});

// Плавна прокрутка для навігації з урахуванням висоти header'а
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector("header").offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }
    });
});


// Коментарі

let currentPage = 1;
const commentsPerPage = 4;
let totalPages = 1;
let allComments = [];
let isCurrentUserAdmin = false;

function fetchComments() {
    fetch("api/fetch_comments.php", { credentials: "same-origin" })
        .then(res => res.json())
        .then(data => {
            allComments = data.comments;
            isCurrentUserAdmin = data.is_current_admin;

            const mainComments = allComments.filter(c => !c.parent_id);
            totalPages = Math.ceil(mainComments.length / commentsPerPage);

            if (mainComments.length > 0) {
                document.getElementById("empty-comments").classList.add("hidden");
                document.getElementById("comments-list-container").classList.remove("hidden");
                displayComments(currentPage);
            } else {
                document.getElementById("comments-list-container").classList.add("hidden");
                document.getElementById("empty-comments").classList.remove("hidden");
            }
        });
}

function renderStars(rating) {
    const parsedRating = parseInt(rating) || 0;
    let html = "";
    for (let i = 1; i <= 5; i++) {
        html += `<svg class="w-4 h-4 ${i <= parsedRating ? 'text-yellow-400' : 'text-gray-600'} fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.635 1.123 6.545z"/></svg>`;
    }
    return html;
}

function displayComments(page) {
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "";

    const startIndex = (page - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;

    const mainComments = allComments.filter(c => !c.parent_id);
    totalPages = Math.ceil(mainComments.length / commentsPerPage);
    const paginatedMain = mainComments.slice(startIndex, endIndex);

    for (let comment of paginatedMain) {
        const replies = allComments.filter(c => c.parent_id === comment.id);
        const hasReplies = replies.length > 0;

        const commentElement = createCommentElement(comment, false, hasReplies);

        if (hasReplies) {
            const repliesContainer = document.createElement("div");
            repliesContainer.className = "ml-8 border-l-4 border-red-600 pl-4 mt-2";

            for (let reply of replies) {
                const replyElement = createCommentElement(reply, true);
                repliesContainer.appendChild(replyElement);
            }

            commentElement.appendChild(repliesContainer);
        }

        commentsList.appendChild(commentElement);
    }

    setupReplyHandlers();
    setupDeleteHandlers();
    updatePaginationUI(page);
}

function createCommentElement(comment, isReply = false, hasReplies = false) {
    const starsHtml = renderStars(comment.rating);
    const commentElement = document.createElement("div");

    let bgClass = "bg-gray-800";
    let textClass = "text-white";

    if (isReply && comment.is_admin) {
        bgClass = "comment__respond";
    }

    commentElement.className = `rounded-lg p-6 shadow-lg comment ${bgClass}`;

    commentElement.innerHTML = `
        <div class="flex items-start space-x-4">
            <img src="${comment.avatar}" alt="User Avatar" class="w-10 h-10 rounded-full comment-avatar">
            <div class="flex-1">
                <div class="flex items-center space-x-2">
                    <h4 class="font-bold ${textClass}">${comment.username}</h4>
                    ${comment.is_admin ? `<span class="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded">Администратор</span>` : ''}
                    <span class="text-xs text-gray-400 ml-auto">${comment.created_at}</span>
                </div>
                <div class="flex space-x-1 mt-1">
                    ${!(isReply && comment.is_admin) ? starsHtml : ""}
                </div>
                <p class="${textClass} mt-1 whitespace-pre-wrap">${comment.comment}</p>

                ${!isReply && isCurrentUserAdmin ? `
                    <button class="reply-btn mt-2 text-sm text-red-500 hover:underline cursor-pointer" data-id="${comment.id}" data-username="${comment.username}">Ответить</button>
                ` : ""}
                
                ${isCurrentUserAdmin ? `
                    <button class="delete-comment-btn mt-2 text-sm hover:underline cursor-pointer" data-id="${comment.id}">Удалить</button>
                ` : ""}
                
                <div class="reply-form-container mt-2 hidden" data-parent-id="${comment.id}">
                    <textarea class="reply-textarea w-full bg-gray-700 text-white rounded-lg p-2 mt-1" rows="2" placeholder="Напишите ответ..."></textarea>
                    <button class="submit-reply-btn mt-1 bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded">Отправить</button>
                    <button class="cancel-reply-btn mt-1 ml-2 text-gray-400 hover:text-white">Отменить</button>
                </div>
            </div>
        </div>
    `;

    return commentElement;
}

function setupReplyHandlers() {
    document.querySelectorAll(".reply-btn").forEach(button => {
        button.onclick = () => {
            const parentId = button.getAttribute("data-id");
            const container = document.querySelector(`.reply-form-container[data-parent-id="${parentId}"]`);
            if (!container) return;
            container.classList.remove("hidden");
            button.style.display = "none";
        };
    });

    document.querySelectorAll(".cancel-reply-btn").forEach(button => {
        button.onclick = () => {
            const container = button.closest(".reply-form-container");
            if (!container) return;
            container.classList.add("hidden");
            const parentId = container.getAttribute("data-parent-id");
            const replyBtn = document.querySelector(`.reply-btn[data-id="${parentId}"]`);
            if (replyBtn) replyBtn.style.display = "inline-block";
        };
    });

    document.querySelectorAll(".submit-reply-btn").forEach(button => {
        button.onclick = () => {
            const container = button.closest(".reply-form-container");
            const parentId = container.getAttribute("data-parent-id");
            const textarea = container.querySelector(".reply-textarea");
            const replyText = textarea.value.trim();
            if (!replyText) return alert("Будь ласка, введіть текст відповіді");

            fetch("api/add_comment.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                credentials: "same-origin",
                body: "comment=" + encodeURIComponent(replyText) + "&rating=5&parent_id=" + encodeURIComponent(parentId),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        textarea.value = "";
                        container.classList.add("hidden");
                        const replyBtn = document.querySelector(`.reply-btn[data-id="${parentId}"]`);
                        if (replyBtn) replyBtn.style.display = "inline-block";
                        fetchComments();
                    } else {
                        alert("Помилка: " + data.error);
                    }
                });
        };
    });
}

function setupDeleteHandlers() {
    document.querySelectorAll(".delete-comment-btn").forEach(button => {
        button.onclick = () => {
            const commentId = button.getAttribute("data-id");
            if (confirm("Видалити цей коментар?")) {
                fetch("api/delete_comment.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    credentials: "same-origin",
                    body: `comment_id=${encodeURIComponent(commentId)}`
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            fetchComments();
                        } else {
                            alert("Помилка при видаленні: " + data.error);
                        }
                    });
            }
        };
    });
}

function updatePaginationUI(currentPage) {
    const pageNumbersContainer = document.getElementById("page-numbers");
    pageNumbersContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.className = `px-3 py-1 rounded ${i === currentPage ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`;
        pageButton.textContent = i;
        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayComments(currentPage);
        });
        pageNumbersContainer.appendChild(pageButton);
    }

    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled = currentPage === totalPages;
}

document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayComments(currentPage);
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        displayComments(currentPage);
    }
});

document.getElementById("submit-comment-btn")?.addEventListener("click", () => {
    const commentText = document.getElementById("comment-text").value.trim();
    const ratingValue = document.getElementById("comment-rating").value;

    if (!commentText) return alert("Будь ласка, введіть текст коментаря");
    if (!ratingValue || parseInt(ratingValue) < 1 || parseInt(ratingValue) > 5) return alert("Будь ласка, виберіть рейтинг");

    fetch("api/add_comment.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "same-origin",
        body: "comment=" + encodeURIComponent(commentText) + "&rating=" + encodeURIComponent(ratingValue),
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("comment-text").value = "";
                document.getElementById("comment-rating").value = "0";
                updateStars(0);
                fetchComments();
            } else {
                alert("Помилка: " + data.error);
            }
        });
});

const ratingStars = document.querySelectorAll("#rating-stars svg");
const ratingInput = document.getElementById("comment-rating");

ratingStars.forEach(star => {
    star.addEventListener("click", () => {
        const value = parseInt(star.getAttribute("data-value"));
        ratingInput.value = value;
        updateStars(value);
    });
});

function updateStars(rating) {
    ratingStars.forEach(star => {
        const starValue = parseInt(star.getAttribute("data-value"));
        star.classList.toggle("text-yellow-400", starValue <= rating);
        star.classList.toggle("text-gray-400", starValue > rating);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchComments();
    updateStars(parseInt(document.getElementById("comment-rating").value || "0"));
});






/// Ініціалізація правил - всі закриті за замовчуванням
document.addEventListener("DOMContentLoaded", function () {
    // Ініціалізація коментарів
    if (allComments.length > 0) {
        document.getElementById("empty-comments").classList.add("hidden");
        displayComments(currentPage);
    } else {
        document.getElementById("empty-comments").classList.remove("hidden");
    }

    // Якщо потрібно буде — додай adjustVipCards() після того, як визначиш цю функцію
    // adjustVipCards();
});

// Якщо викликати adjustVipCards() потрібно при зміні розміру — закоментував поки
// window.addEventListener("resize", adjustVipCards);

document.querySelector('.rules-toggle').addEventListener('click', function () {
    const container = document.querySelector('.rules-container');
    const icon = this.querySelector('i');

    container.classList.toggle('collapsed');
    icon.classList.toggle('rotate-180');

    // Оновлюємо aria-expanded для доступності
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
});

// Показ банів і мютів з БД
document.addEventListener('DOMContentLoaded', () => {
    // Отримати кількість банів
    fetch('/api/bans.php')
        .then(res => res.json())
        .then(data => {
            const banCountElem = document.getElementById('ban-count');
            if (banCountElem) {
                banCountElem.textContent = data.length;
            }
        })
        .catch(err => {
            console.error('Помилка при отриманні банів:', err);
        });

    // Отримати кількість м’ютів
    fetch('/api/mutes.php')
        .then(res => res.json())
        .then(data => {
            const muteCountElem = document.getElementById('mute-count');
            if (muteCountElem) {
                muteCountElem.textContent = data.length;
            }
        })
        .catch(err => {
            console.error('Помилка при отриманні мютів:', err);
        });

    // Отримати статистику онлайн
    function updateOnline() {
        fetch('/api/online.php')  // Заміни, якщо шлях інший
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error('Помилка:', data.error);
                    return;
                }

                // Формуємо текст онлайну типу "5/24"
                const onlineText = `${data.online}/${data.max_players}`;

                // Показуємо онлайн на сторінці
                const elem1 = document.getElementById('online-count-1');
                const elem2 = document.getElementById('online-count-2');
                if (elem1) elem1.textContent = onlineText;
                if (elem2) elem2.textContent = onlineText;

                // Вивід списку гравців (якщо є <ul id="players-list"> на сторінці)
                if (Array.isArray(data.players)) {
                    const list = document.getElementById('players-list');
                    if (list) {
                        list.innerHTML = ''; // очищення
                        data.players.forEach(player => {
                            const li = document.createElement('li');
                            li.textContent = `${player.steamid} — приєднався: ${player.firstjoin}, останній раз бачили: ${player.lastseen}`;
                            list.appendChild(li);
                        });
                    }
                }
            })
            .catch(err => console.error('Помилка при отриманні онлайн:', err));
    }

    // Викликаємо одразу після завантаження сторінки
    updateOnline();

    // Автоматичне оновлення кожні 30 секунд
    setInterval(updateOnline, 30000);
});

