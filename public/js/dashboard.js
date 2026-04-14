<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hệ thống Quản lý Môn học - Dashboard</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <link rel="stylesheet" href="style.css">
    
    <style>
        /* Bổ sung một số style cho layout chính */
        .main-layout {
            display: grid;
            grid-template-columns: 260px 1fr;
            min-height: 100vh;
        }
        @media (max-width: 768px) {
            .main-layout { grid-template-columns: 1fr; }
            .sidebar { display: none; }
        }
        .sidebar {
            background: white;
            border-right: 1px solid var(--border);
            padding: 24px;
        }
        .content-area {
            padding: 32px;
            background: var(--bg);
        }
        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 12px;
            color: var(--text-2);
            transition: all 0.2s;
            margin-bottom: 4px;
        }
        .nav-link.active {
            background: var(--primary-light);
            color: var(--primary);
            font-weight: 600;
        }
        .nav-link:hover:not(.active) {
            background: #f8fafc;
        }
    </style>
</head>
<body>

    <div class="main-layout">
        <aside class="sidebar">
            <div class="page-header-logo mb-10">
                <div class="logo-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div>
                    <div class="logo-text">EDU MANAGER</div>
                    <div class="logo-sub">Hệ thống quản lý</div>
                </div>
            </div>

            <nav>
                <a href="#" class="nav-link active">
                    <i class="fas fa-th-large"></i> Bảng điều khiển
                </a>
                <a href="#" class="nav-link">
                    <i class="fas fa-book"></i> Môn học
                </a>
                <a href="#" class="nav-link">
                    <i class="fas fa-user-circle"></i> Hồ sơ cá nhân
                </a>
                <div class="mt-10 pt-6 border-t">
                    <button id="logoutBtn" class="btn btn-danger w-full justify-center">
                        <i class="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                </div>
            </nav>
        </aside>

        <main class="content-area">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-extrabold tracking-tight">Xin chào, <span id="headerUserName" class="text-blue-600">...</span>!</h1>
                    <p class="text-gray-500 text-sm">Chào mừng bạn quay trở lại hệ thống.</p>
                </div>
                
                <div class="header-right">
                    <div class="flex items-center gap-3 bg-white p-2 pr-4 rounded-full shadow-sm border">
                        <div class="avatar avatar-blue" id="userAvatarIcon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="text-sm">
                            <div class="font-bold leading-none" id="headerFullName">Họ và tên</div>
                            <div class="text-[10px] uppercase tracking-wider text-gray-400 font-bold" id="headerRole">Vai trò</div>
                        </div>
                    </div>
                </div>
            </header>

            <div id="roleContent" class="fade-in-up">
                <div class="flex items-center justify-center min-h-[400px]">
                    <div class="text-center">
                        <i class="fas fa-circle-notch fa-spin text-3xl text-blue-600 mb-4"></i>
                        <p class="text-gray-500">Đang tải dữ liệu hệ thống...</p>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="common.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            // Kiểm tra session login
            const loggedUserStr = sessionStorage.getItem('loggedUser');
            if (!loggedUserStr) {
                window.location.href = 'login.html';
                return;
            }

            const user = JSON.parse(loggedUserStr);

            // Hiển thị thông tin user lên Header
            if (document.getElementById('headerUserName')) document.getElementById('headerUserName').textContent = user.username;
            if (document.getElementById('headerFullName')) document.getElementById('headerFullName').textContent = user.fullName;
            if (document.getElementById('headerRole')) document.getElementById('headerRole').textContent = user.role;

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
    </script>
</body>
</html>