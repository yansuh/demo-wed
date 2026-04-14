async function renderTrainingPanel(user) {
    await loadSubjectsAsync();
    const container = document.getElementById('roleContent');
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-md p-5">
                <h2 class="text-xl font-bold flex items-center gap-2 mb-4"><i class="fas fa-book-open text-blue-600"></i> Quản lý môn học</h2>
                <div class="mb-4 bg-gray-50 p-3 rounded-xl grid grid-cols-2 gap-2">
                    <input id="newSubName" placeholder="Tên môn học mới" class="border rounded-lg p-2 text-sm">
                    <select id="newSubFaculty" class="border rounded-lg p-2 text-sm"><option>Công nghệ thông tin</option><option>Kinh tế</option></select>
                    <input id="newSubCredits" type="number" value="3" class="border rounded-lg p-2 text-sm">
                    <input id="newSubLecturer" placeholder="Giảng viên" class="border rounded-lg p-2 text-sm">
                    <button id="addSubjectBtn" class="col-span-2 bg-blue-600 text-white px-4 py-2 rounded-xl">Thêm môn học</button>
                </div>
                <div class="scrollable-table"><table class="min-w-full text-sm text-left"><thead class="bg-gray-100"><tr><th class="p-2">Tên môn</th><th>Khoa</th><th>Thao tác</th></tr></thead><tbody id="subjectList"></tbody></table></div>
            </div>
            <div class="bg-white rounded-2xl shadow-md p-5">
                <h2 class="text-xl font-bold mb-3">Quản lý tài khoản</h2>
                <div class="scrollable-table"><table class="min-w-full text-sm text-left"><thead class="bg-gray-100"><tr><th class="p-2">Username</th><th>Họ tên</th><th>Role</th><th>Xóa</th></tr></thead><tbody id="accountList"></tbody></table></div>
            </div>
        </div>
    `;
    
    function renderSubTable() {
        const subjects = loadSubjects();
        document.getElementById('subjectList').innerHTML = subjects.map(sub => `<tr class="border-b"><td class="p-2">${escapeHtml(sub.name)}</td><td>${escapeHtml(sub.faculty)}</td><td><button data-id="${sub.id}" class="delSubBtn text-red-500"><i class="fas fa-trash"></i></button></td></tr>`).join('');
        document.querySelectorAll('.delSubBtn').forEach(btn => btn.onclick = () => { if(confirm('Xóa môn này?')) { deleteSubject(parseInt(btn.dataset.id)); renderSubTable(); } });
    }
    
    function renderAccList() {
        document.getElementById('accountList').innerHTML = getUsers().map(u => `<tr class="border-b"><td class="p-2">${escapeHtml(u.username)}</td><td>${escapeHtml(u.fullName)}</td><td>${escapeHtml(u.role)}</td><td><button data-id="${u.id}" class="delUserBtn text-red-500"><i class="fas fa-trash"></i></button></td></tr>`).join('');
        document.querySelectorAll('.delUserBtn').forEach(btn => btn.onclick = () => { if(confirm('Xóa tài khoản?')) { deleteUser(parseInt(btn.dataset.id)); renderAccList(); } });
    }

    renderSubTable(); renderAccList();
    
    document.getElementById('addSubjectBtn').onclick = () => {
        const name = document.getElementById('newSubName').value.trim();
        if(!name) return alert('Nhập tên môn');
        addSubject({ code: Date.now().toString(), name, faculty: document.getElementById('newSubFaculty').value, credits: document.getElementById('newSubCredits').value, lecturer: document.getElementById('newSubLecturer').value });
        renderSubTable();
    };
}