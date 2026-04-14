async function renderFacultyPanel(user) {
    await loadSubjectsAsync();
    const facultyName = user.facultyName || '';
    const container = document.getElementById('roleContent');
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-md p-6">
            <h2 class="text-xl font-bold flex gap-2"><i class="fas fa-landmark text-amber-600"></i> Khoa - Xem môn học & Yêu cầu</h2>
            <div id="subjectsByFacultyContainer" class="my-6 bg-gray-50 p-4 rounded-xl"></div>
            <div class="border-t pt-4 mt-2">
                <h3 class="font-semibold mb-2">✉️ Gửi yêu cầu cập nhật môn học</h3>
                <select id="requestSubjectSelect" class="border rounded-xl p-2 w-full mb-2"></select>
                <textarea id="requestMessage" rows="2" class="border rounded-xl p-2 w-full mb-2" placeholder="Mô tả yêu cầu cập nhật..."></textarea>
                <button id="sendRequestBtn" class="bg-blue-600 text-white px-5 py-2 rounded-xl"><i class="fas fa-paper-plane"></i> Gửi yêu cầu</button>
            </div>
        </div>
    `;
    const filtered = subjectsData.filter(s => s.faculty === facultyName);
    document.getElementById('subjectsByFacultyContainer').innerHTML = `<h3 class="font-medium mb-2">📚 Môn học khoa ${facultyName}</h3><table class="w-full text-sm text-left"><thead class="bg-gray-200"><tr><th class="p-2">Tên môn</th><th>TC</th><th>GV</th></tr></thead><tbody>${filtered.map(s => `<tr class="border-b"><td class="p-2">${escapeHtml(s.name)}</td><td>${s.credits}</td><td>${escapeHtml(s.lecturer)}</td></tr>`).join('')}</tbody></table>`;
    document.getElementById('requestSubjectSelect').innerHTML = `<option value="">-- Chọn môn học --</option>` + filtered.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
    
    document.getElementById('sendRequestBtn').onclick = () => {
        const subId = document.getElementById('requestSubjectSelect').value;
        const msg = document.getElementById('requestMessage').value.trim();
        if (!subId || !msg) return alert('Vui lòng chọn môn và nhập mô tả');
        alert('Yêu cầu đã gửi đến Phòng đào tạo');
        document.getElementById('requestMessage').value = '';
    };
}