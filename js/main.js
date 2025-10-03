(function () {
    function safeGetUser() {
        const raw = localStorage.getItem('user');
        if (!raw) return null;
        try {
            const obj = JSON.parse(raw);
            if (obj && typeof obj === 'object') return obj;
            return null;
        } catch {
            return null;
        }
    }

    function renderAuthUI() {
        const token = localStorage.getItem('authToken');
        const user = safeGetUser();

        const desktopAuth = document.querySelector('.nav-right .auth-buttons');
        const mobileAuth = document.querySelector('.mobile-auth-buttons');

        // remove old dropdown if any
        document.querySelectorAll('.user-dropdown').forEach(el => el.remove());

        // Chưa đăng nhập (không token & không user) -> hiện login/signup
        if (!token && !user) {
            if (desktopAuth) desktopAuth.style.display = 'flex';
            if (mobileAuth) mobileAuth.style.display = 'block';
            return;
        }

        // Có token (và/hoặc user) -> ẩn login/signup, show chip
        const displayName = (user && (user.name || user.fullName || user.phone)) || 'User';
        const avatarText = (displayName.trim()[0] || 'U').toUpperCase();

        function mountChip(container) {
            if (!container || !container.parentElement) return;
            container.style.display = 'none';

            const wrap = document.createElement('div');
            wrap.className = 'user-dropdown';
            wrap.innerHTML = `
        <button class="user-btn" type="button">
          <span class="avatar">${avatarText}</span>
          <span class="user-name">${displayName}</span>
          <span class="caret">▾</span>
        </button>
        <div class="user-menu" hidden>
          <a href="profile.html">My profile</a>
          <a href="#" id="logoutBtn">Log out</a>
        </div>
      `;
            container.parentElement.appendChild(wrap);

            const btn = wrap.querySelector('.user-btn');
            const menu = wrap.querySelector('.user-menu');
            btn.addEventListener('click', () => (menu.hidden = !menu.hidden));
            document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) menu.hidden = true; });

            wrap.querySelector('#logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                renderAuthUI();
                window.location.href = 'index.html';
            });
        }

        mountChip(desktopAuth);
        mountChip(mobileAuth);
    }

    // Auto-run khi trang tải
    document.addEventListener('DOMContentLoaded', renderAuthUI);

    // Expose nếu bạn muốn tự gọi lại ở nơi khác
    window.renderAuthUI = renderAuthUI;
})();
