async function renderProfilePanel(user) {
    const container = document.getElementById('roleContent');
    container.innerHTML = `
        <div class="card max-w-4xl mx-auto">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl"><i class="fas fa-user-circle"></i></div>
                <h2 class="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Thông tin cơ bản -->
                <div>
                    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2"><i class="fas fa-id-card text-blue-500"></i>Thông tin tài khoản</h3>
                    <div class="space-y-4">
                        <div><label class="label">Tên đăng nhập</label><input class="input bg-gray-50" value="${escapeHtml(user.username)}" readonly disabled></div>
                        <div><label class="label">Họ và tên</label><input type="text" id="profileFullName" class="input" value="${escapeHtml(user.fullName)}"></div>
                        <div><label class="label">Mã số</label><input class="input bg-gray-50" value="${escapeHtml(user.userCode || 'Chưa có')}" readonly disabled></div>
                        <div><label class="label">Ngày sinh</label><input class="input bg-gray-50" value="${escapeHtml(user.dob || 'Chưa cập nhật')}" readonly disabled></div>
                        <div><label class="label">Vai trò</label><input class="input bg-gray-50" value="${escapeHtml(user.role)}" readonly disabled></div>
                        ${user.facultyName ? `<div><label class="label">Khoa / Bộ môn</label><input class="input bg-gray-50" value="${escapeHtml(user.facultyName)}" readonly disabled></div>` : ''}
                    </div>
                    <div class="mt-6">
                        <button id="saveProfileBtn" class="btn btn-primary"><i class="fas fa-save mr-2"></i>Lưu thay đổi</button>
                    </div>
                </div>

                <!-- Đổi mật khẩu -->
                <div class="lg:border-l lg:pl-8">
                    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2"><i class="fas fa-lock text-amber-500"></i>Bảo mật</h3>
                    <div id="passwordMessage" class="text-sm mb-3 hidden"></div>
                    <div class="space-y-4">
                        <div><label class="label">Mật khẩu hiện tại</label><input type="password" id="currentPassword" class="input" placeholder="••••••••"></div>
                        <div><label class="label">Mật khẩu mới</label><input type="password" id="newPassword" class="input" placeholder="Ít nhất 6 ký tự"></div>
                        <div><label class="label">Xác nhận mật khẩu mới</label><input type="password" id="confirmNewPassword" class="input" placeholder="••••••••"></div>
                        <button id="changePasswordBtn" class="btn btn-outline w-full justify-center"><i class="fas fa-key mr-2"></i>Cập nhật mật khẩu</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('saveProfileBtn').onclick = () => {
        const newName = document.getElementById('profileFullName').value.trim();
        if (!newName) return alert('Họ tên không được để trống');
        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx].fullName = newName;
            saveUsers(users);
            user.fullName = newName;
            sessionStorage.setItem('loggedUser', JSON.stringify(user));
            document.getElementById('headerFullName').textContent = newName;
            addLog(`Cập nhật hồ sơ`, user.username);
            alert('Cập nhật thành công!');
        }
    };

    document.getElementById('changePasswordBtn').onclick = () => {
        const cur = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;
        const msgDiv = document.getElementById('passwordMessage');
        const showMsg = (text, isOk = false) => {
            msgDiv.className = `text-sm p-3 rounded-lg mb-3 ${isOk ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`;
            msgDiv.innerHTML = `<i class="fas fa-${isOk ? 'check-circle' : 'exclamation-circle'} mr-2"></i>${text}`;
            msgDiv.classList.remove('hidden');
        };
        if (cur !== user.password) return showMsg('Mật khẩu hiện tại không đúng');
        if (newPass.length < 6) return showMsg('Mật khẩu mới phải có ít nhất 6 ký tự');
        if (!/[a-zA-Z]/.test(newPass) || !/[0-9]/.test(newPass) || !/[^a-zA-Z0-9]/.test(newPass))
            return showMsg('Mật khẩu phải bao gồm chữ, số và ký tự đặc biệt');
        if (newPass !== confirm) return showMsg('Xác nhận mật khẩu không khớp');

        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx].password = newPass;
            saveUsers(users);
            user.password = newPass;
            sessionStorage.setItem('loggedUser', JSON.stringify(user));
            addLog(`Đổi mật khẩu`, user.username);
            showMsg('Đổi mật khẩu thành công!', true);
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
        }
    };
}