// Dashboard.js - Script chính cho trang dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Kiểm tra session login
    const loggedUserStr = sessionStorage.getItem('loggedUser');
    if (!loggedUserStr) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(loggedUserStr);

    // Hiển thị thông tin user lên Header
    if (document.getElementById('headerUserName')) {
        document.getElementById('headerUserName').textContent = user.username;
    }
    if (document.getElementById('headerFullName')) {
        document.getElementById('headerFullName').textContent = user.fullName;
    }
    if (document.getElementById('headerRole')) {
        document.getElementById('headerRole').textContent = user.role;
    }

    const container = document.getElementById('roleContent');

    // --- HÀM TẢI ĐỘNG (DYNAMIC LOADER) ---
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            // Kiểm tra xem script đã tồn tại chưa để tránh tải lại
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Không thể tải file: ${src}`));
            document.body.appendChild(script);
        });
    };

    // Gọi file JS tương ứng dựa vào Role
    try {
        switch (user.role) {
            case 'admin':
                await loadScript('admin.js');
                if (typeof renderAdminPanel === 'function') await renderAdminPanel(user);
                break;
            case 'faculty':
                await loadScript('faculty.js');
                if (typeof renderFacultyPanel === 'function') await renderFacultyPanel(user);
                break;
            case 'lecturer':
                await loadScript('lecturer.js');
                if (typeof renderLecturerPanel === 'function') await renderLecturerPanel(user);
                break;
            case 'training':
                await loadScript('training.js');
                if (typeof renderTrainingPanel === 'function') await renderTrainingPanel(user);
                break;
            default:
                container.innerHTML = `
                    <div class="card p-10 text-center">
                        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                        <p>Vai trò không hợp lệ hoặc bạn không có quyền truy cập.</p>
                    </div>`;
        }
    } catch (error) {
        console.error("Lỗi khi tải panel:", error);
        container.innerHTML = `<div class="p-4 bg-red-100 text-red-600 rounded-xl">Có lỗi xảy ra khi tải dữ liệu chức năng. Hãy kiểm tra Console để biết chi tiết.</div>`;
    }

    // Xử lý Đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                sessionStorage.removeItem('loggedUser');
                window.location.href = 'login.html';
            }
        };
    }
});