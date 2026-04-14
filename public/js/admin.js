async function renderAdminPanel(user) {
    let users = getUsers();
    const container = document.getElementById('roleContent');
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-md p-6">
            <h2 class="text-2xl font-bold flex gap-2"><i class="fas fa-crown text-purple-700"></i> Quản trị & Phân quyền hệ thống</h2>
            <div class="mb-4 flex gap-2 flex-wrap mt-4">
                <input id="newAdminUser" placeholder="Tên đăng nhập" class="border rounded-lg p-2">
                <input id="newAdminFullname" placeholder="Họ tên" class="border rounded-lg p-2">
                <select id="newAdminRole" class="border rounded-lg p-2"><option>lecturer</option><option>faculty</option><option>training</option><option>admin</option></select>
                <button id="addAdminUserBtn" class="bg-purple-600 text-white px-4 rounded-xl">➕ Thêm</button>
            </div>
            <div class="scrollable-table"><table class="min-w-full text-left"><thead class="bg-gray-100"><tr><th class="p-2">Username</th><th>Họ tên</th><th>Vai trò</th><th>Thao tác</th></tr></thead><tbody id="adminUserList"></tbody></table></div>
        </div>
    `;
    function renderUsers() {
        const tbody = document.getElementById('adminUserList');
        tbody.innerHTML = users.map(u => `
            <tr class="border-b"><td class="p-2">${escapeHtml(u.username)}</td><td>${escapeHtml(u.fullName)}</td>
            <td><select data-id="${u.id}" class="adminRoleSelect border rounded p-1">${['lecturer','faculty','training','admin'].map(r => `<option ${u.role===r?'selected':''}>${r}</option>`).join('')}</select></td>
            <td><button data-id="${u.id}" class="adminDelUserBtn text-red-500"><i class="fas fa-trash"></i> Xóa</button></td></tr>
        `).join('');
        
        document.querySelectorAll('.adminRoleSelect').forEach(select => {
            select.onchange = () => {
                updateUser(parseInt(select.dataset.id), { role: select.value });
                users = getUsers(); renderUsers();
            };
        });
        document.querySelectorAll('.adminDelUserBtn').forEach(btn => {
            btn.onclick = () => {
                if (confirm('Xóa tài khoản?')) { deleteUser(parseInt(btn.dataset.id)); users = getUsers(); renderUsers(); }
            };
        });
    }
    renderUsers();
    
    document.getElementById('addAdminUserBtn').onclick = () => {
        const username = document.getElementById('newAdminUser').value.trim();
        const fullName = document.getElementById('newAdminFullname').value.trim();
        if (!username || !fullName) return alert('Nhập đủ thông tin');
        addUser({ username, password: '123', fullName, role: document.getElementById('newAdminRole').value });
        users = getUsers(); renderUsers();
    };
}