async function renderLecturerPanel() {
    await loadSubjectsAsync();
    const container = document.getElementById('roleContent');
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-md p-6">
            <h2 class="text-2xl font-bold flex gap-2 items-center"><i class="fas fa-chalkboard-teacher text-green-600"></i> Giao diện Giảng viên</h2>
            <div class="my-5"><input type="text" id="searchInput" placeholder="🔍 Tìm kiếm môn học..." class="w-full md:w-96 border rounded-xl p-2.5"></div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div><h3 class="font-semibold text-lg mb-2">📖 Danh sách môn học</h3><div class="scrollable-table"><table class="min-w-full bg-gray-50 rounded-xl text-left"><thead class="bg-gray-200"><tr><th class="p-2">Tên môn học</th><th>Khoa</th><th>TC</th></tr></thead><tbody id="lecturerSubjectList"></tbody></table></div></div>
                <div><h3 class="font-semibold text-lg mb-2">📌 Chi tiết môn học</h3><div id="subjectDetailCard" class="bg-gray-50 p-4 rounded-xl border min-h-[200px] flex items-center justify-center text-gray-400">Nhấp vào một môn để xem chi tiết</div></div>
            </div>
        </div>
    `;
    const searchInput = document.getElementById('searchInput');
    const updateList = () => {
        const term = searchInput.value.toLowerCase();
        const filtered = subjectsData.filter(s => s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term));
        document.getElementById('lecturerSubjectList').innerHTML = filtered.map(s => `<tr class="border-b cursor-pointer hover:bg-blue-50 subject-row" data-id="${s.id}"><td class="p-2">${escapeHtml(s.name)}</td><td>${escapeHtml(s.faculty)}</td><td>${s.credits} tc</td></tr>`).join('');
        
        document.querySelectorAll('.subject-row').forEach(row => {
            row.onclick = () => {
                const sub = subjectsData.find(s => s.id === parseInt(row.dataset.id));
                document.getElementById('subjectDetailCard').innerHTML = `<div class="space-y-2"><div class="font-bold text-lg">${escapeHtml(sub.name)}</div><div class="grid grid-cols-2 gap-2 text-sm"><span>Khoa:</span><span class="font-semibold">${escapeHtml(sub.faculty)}</span><span>Số tín chỉ:</span><span class="font-semibold">${sub.credits}</span><span>Giảng viên:</span><span class="font-semibold">${escapeHtml(sub.lecturer)}</span></div></div>`;
            };
        });
    };
    searchInput.addEventListener('input', updateList);
    updateList();
}