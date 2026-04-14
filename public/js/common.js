// ==================== DỮ LIỆU MẶC ĐỊNH ====================
function initData() {
    if (!localStorage.getItem('users')) {
      const defaultUsers = [
        { id: 1, username: 'admin', password: '123', fullName: 'Quản trị viên', role: 'admin' },
        { id: 2, username: 'training', password: '123', fullName: 'Phòng đào tạo', role: 'training' },
        { id: 3, username: 'gv1', password: '123', fullName: 'Nguyễn Văn A', role: 'lecturer' },
        { id: 4, username: 'khoa_cntt', password: '123', fullName: 'Khoa CNTT', role: 'faculty', facultyName: 'Công nghệ thông tin' }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('subjects')) {
      const defaultSubjects = [
        { id: 1, code: 'CS101', name: 'Lập trình cơ bản', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'Nguyễn Văn A', description: 'Nhập môn lập trình' },
        { id: 2, code: 'CS102', name: 'Cấu trúc dữ liệu', faculty: 'Công nghệ thông tin', credits: 4, lecturer: 'Trần Thị B', description: 'Cấu trúc dữ liệu và giải thuật' },
        { id: 3, code: 'ECO101', name: 'Kinh tế vi mô', faculty: 'Kinh tế', credits: 3, lecturer: 'Lê Văn C', description: 'Nguyên lý kinh tế' }
      ];
      localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
    }
    if (!localStorage.getItem('logs')) { localStorage.setItem('logs', JSON.stringify([])); }
    if (!localStorage.getItem('requests')) { localStorage.setItem('requests', JSON.stringify([])); }
    if (!localStorage.getItem('nextIds')) { localStorage.setItem('nextIds', JSON.stringify({ userId: 5, subjectId: 4, requestId: 1 })); }
}
initData();

// ==================== SUBJECTS ====================
function loadSubjects() { return JSON.parse(localStorage.getItem('subjects')) || []; }
function saveSubjects(subjects) { localStorage.setItem('subjects', JSON.stringify(subjects)); }
function addSubject(subject) {
    const subjects = loadSubjects();
    const nextIds = JSON.parse(localStorage.getItem('nextIds'));
    subject.id = nextIds.subjectId++;
    subjects.push(subject);
    saveSubjects(subjects);
    localStorage.setItem('nextIds', JSON.stringify(nextIds));
    addLog(`Thêm môn học: ${subject.name}`, 'system');
    return subject;
}
function updateSubject(id, updatedData) {
    const subjects = loadSubjects();
    const index = subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      subjects[index] = { ...subjects[index], ...updatedData };
      saveSubjects(subjects);
      addLog(`Cập nhật môn học ID ${id}`, 'system');
    }
}
function deleteSubject(id) {
    let subjects = loadSubjects();
    subjects = subjects.filter(s => s.id !== id);
    saveSubjects(subjects);
    addLog(`Xóa môn học ID ${id}`, 'system');
}

// ==================== USERS ====================
function getUsers() { return JSON.parse(localStorage.getItem('users')) || []; }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
function addUser(user) {
    const users = getUsers();
    const nextIds = JSON.parse(localStorage.getItem('nextIds'));
    user.id = nextIds.userId++;
    users.push(user);
    saveUsers(users);
    localStorage.setItem('nextIds', JSON.stringify(nextIds));
    addLog(`Thêm tài khoản: ${user.username} (${user.role})`, 'system');
}
function updateUser(id, updatedData) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      saveUsers(users);
      addLog(`Cập nhật tài khoản ID ${id}`, 'system');
    }
}
function deleteUser(id) {
    let users = getUsers();
    users = users.filter(u => u.id !== id);
    saveUsers(users);
    addLog(`Xóa tài khoản ID ${id}`, 'system');
}

// ==================== LOGS ====================
function getLogs() { return JSON.parse(localStorage.getItem('logs')) || []; }
function addLog(action, user = 'system') {
    const logs = getLogs();
    logs.unshift({ id: Date.now(), timestamp: new Date().toLocaleString('vi-VN'), user: user, action: action });
    if (logs.length > 50) logs.pop();
    localStorage.setItem('logs', JSON.stringify(logs));
}

// ==================== UTILS ====================
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

let subjectsData = [];
async function loadSubjectsAsync() {
    subjectsData = loadSubjects();
    return subjectsData;
}// ==================== DỮ LIỆU MẶC ĐỊNH ====================
function initData() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { id: 1, username: 'admin', password: '123', fullName: 'Quản trị viên', role: 'admin', userCode: 'ADMIN' },
            { id: 2, username: 'training', password: '123', fullName: 'Phòng Đào tạo', role: 'training', userCode: 'PDT' },
            { id: 3, username: 'gv1', password: '123', fullName: 'Nguyễn Văn A', role: 'lecturer', userCode: 'GV001', dob: '1985-03-15' },
            { id: 4, username: 'khoa_cntt', password: '123', fullName: 'Khoa CNTT', role: 'faculty', facultyName: 'Công nghệ thông tin', userCode: 'KH001' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('subjects')) {
        const defaultSubjects = [
            { id: 1, code: 'CS101', name: 'Lập trình cơ bản', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'Nguyễn Văn A', description: 'Nhập môn lập trình với Python' },
            { id: 2, code: 'CS102', name: 'Cấu trúc dữ liệu', faculty: 'Công nghệ thông tin', credits: 4, lecturer: 'Trần Thị B', description: 'Cấu trúc dữ liệu và giải thuật' },
            { id: 3, code: 'ECO101', name: 'Kinh tế vi mô', faculty: 'Kinh tế', credits: 3, lecturer: 'Lê Văn C', description: 'Nguyên lý kinh tế vi mô' }
        ];
        localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
    }
    if (!localStorage.getItem('logs')) localStorage.setItem('logs', JSON.stringify([]));
    if (!localStorage.getItem('requests')) localStorage.setItem('requests', JSON.stringify([]));
    if (!localStorage.getItem('nextIds')) localStorage.setItem('nextIds', JSON.stringify({ userId: 5, subjectId: 4, requestId: 1 }));
}
initData();

// ==================== SUBJECTS ====================
function loadSubjects() { return JSON.parse(localStorage.getItem('subjects')) || []; }
function saveSubjects(subjects) { localStorage.setItem('subjects', JSON.stringify(subjects)); }
function addSubject(subject) {
    const subjects = loadSubjects();
    const nextIds = JSON.parse(localStorage.getItem('nextIds'));
    subject.id = nextIds.subjectId++;
    subjects.push(subject);
    saveSubjects(subjects);
    localStorage.setItem('nextIds', JSON.stringify(nextIds));
    addLog(`Thêm môn học: ${subject.name}`, 'system');
    return subject;
}
function updateSubject(id, updatedData) {
    const subjects = loadSubjects();
    const index = subjects.findIndex(s => s.id === id);
    if (index !== -1) {
        subjects[index] = { ...subjects[index], ...updatedData };
        saveSubjects(subjects);
        addLog(`Cập nhật môn học ID ${id}`, 'system');
    }
}
function deleteSubject(id) {
    let subjects = loadSubjects();
    subjects = subjects.filter(s => s.id !== id);
    saveSubjects(subjects);
    addLog(`Xóa môn học ID ${id}`, 'system');
}

// ==================== USERS ====================
function getUsers() { return JSON.parse(localStorage.getItem('users')) || []; }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
function addUser(user) {
    const users = getUsers();
    const nextIds = JSON.parse(localStorage.getItem('nextIds'));
    user.id = nextIds.userId++;
    users.push(user);
    saveUsers(users);
    localStorage.setItem('nextIds', JSON.stringify(nextIds));
    addLog(`Thêm tài khoản: ${user.username} (${user.role})`, 'system');
}
function updateUser(id, updatedData) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updatedData };
        saveUsers(users);
        addLog(`Cập nhật tài khoản ID ${id}`, 'system');
    }
}
function deleteUser(id) {
    let users = getUsers();
    users = users.filter(u => u.id !== id);
    saveUsers(users);
    addLog(`Xóa tài khoản ID ${id}`, 'system');
}

// ==================== LOGS ====================
function getLogs() { return JSON.parse(localStorage.getItem('logs')) || []; }
function addLog(action, user = 'system') {
    const logs = getLogs();
    logs.unshift({ id: Date.now(), timestamp: new Date().toLocaleString('vi-VN'), user, action });
    if (logs.length > 50) logs.pop();
    localStorage.setItem('logs', JSON.stringify(logs));
}

// ==================== UTILS ====================
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

let subjectsData = [];
async function loadSubjectsAsync() {
    subjectsData = loadSubjects();
    return subjectsData;
}