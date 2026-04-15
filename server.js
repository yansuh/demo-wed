const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh từ thư mục gốc
app.use(express.static(__dirname, {
    setHeaders: (res, filepath) => {
        // Đảm bảo các file được serve với đúng content-type
        if (filepath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filepath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filepath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// Đường dẫn file dữ liệu
const ACCOUNTS_FILE = path.join(__dirname, 'taikhoan.txt');
const SUBJECTS_FILE = path.join(__dirname, 'monhoc.txt');
const LOGS_FILE = path.join(__dirname, 'logs.txt');
const REQUESTS_FILE = path.join(__dirname, 'requests.txt');

// Hàm đọc file an toàn (nếu lỗi thì trả về mặc định)
function readFileJSON(file, defaultVal) {
    try {
        if (!fs.existsSync(file)) {
            console.log(`File ${file} không tồn tại, tạo mới với dữ liệu mặc định`);
            writeFileJSON(file, defaultVal);
            return defaultVal;
        }
        const data = fs.readFileSync(file, 'utf8');
        if (!data || data.trim() === '') {
            console.log(`File ${file} rỗng, sử dụng dữ liệu mặc định`);
            writeFileJSON(file, defaultVal);
            return defaultVal;
        }
        return JSON.parse(data);
    } catch (err) {
        console.error(`Lỗi đọc file ${file}:`, err.message);
        try {
            writeFileJSON(file, defaultVal);
        } catch (writeErr) {
            console.error(`Không thể ghi file ${file}:`, writeErr.message);
        }
        return defaultVal;
    }
}

function writeFileJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Lỗi ghi file ${file}:`, err.message);
    }
}

// Khởi tạo dữ liệu trong bộ nhớ
let accounts = readFileJSON(ACCOUNTS_FILE, []);
let subjects = readFileJSON(SUBJECTS_FILE, []);
let logs = readFileJSON(LOGS_FILE, []);
let requests = readFileJSON(REQUESTS_FILE, []);

function saveAccounts() { writeFileJSON(ACCOUNTS_FILE, accounts); }
function saveSubjects() { writeFileJSON(SUBJECTS_FILE, subjects); }
function saveLogs() { writeFileJSON(LOGS_FILE, logs); }
function saveRequests() { writeFileJSON(REQUESTS_FILE, requests); }

function addLog(action, username) {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    logs.unshift({ id: Date.now(), timestamp, action, user: username });
    if (logs.length > 100) logs = logs.slice(0, 100); // Giữ tối đa 100 logs
    saveLogs();
}

// Tạo dữ liệu mẫu nếu chưa có
if (!accounts || accounts.length === 0) {
    console.log('Khởi tạo dữ liệu tài khoản mẫu...');
    accounts = [
        { id: 1, username: 'admin', password: 'Admin123@', fullName: 'Quản trị hệ thống', role: 'admin' },
        { id: 2, username: 'phongdaotao', password: '123', fullName: 'Phòng Quản lý Sinh viên', role: 'training' },
        { id: 3, username: 'khoa_cntt', password: '123', fullName: 'Khoa Công nghệ thông tin', role: 'faculty', facultyName: 'Công nghệ thông tin' },
        { id: 4, username: 'khoa_dientu', password: '123', fullName: 'Khoa Điện - Điện tử', role: 'faculty', facultyName: 'Điện - Điện tử' },
        { id: 5, username: 'khoa_kinhte', password: '123', fullName: 'Khoa Kinh tế', role: 'faculty', facultyName: 'Kinh tế' },
        { id: 6, username: 'khoa_ngonngu', password: '123', fullName: 'Khoa Ngôn ngữ', role: 'faculty', facultyName: 'Ngôn ngữ' },
        { id: 7, username: 'giangvien1', password: '123', fullName: 'Nguyễn Văn Giảng', role: 'lecturer', department: 'Công nghệ thông tin' }
    ];
    saveAccounts();
}
if (!subjects || subjects.length === 0) {
    console.log('Khởi tạo dữ liệu môn học mẫu...');
    subjects = [
        { id: 1, code: 'CS101', name: 'Lập trình Web nâng cao', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'TS. Nguyễn Văn A', status: 'active' },
        { id: 2, code: 'EE201', name: 'Mạch điện tử', faculty: 'Điện - Điện tử', credits: 4, lecturer: 'ThS. Trần Văn B', status: 'active' },
        { id: 3, code: 'EC101', name: 'Kinh tế vi mô', faculty: 'Kinh tế', credits: 3, lecturer: 'PGS. Lê Thị C', status: 'active' },
        { id: 4, code: 'FL101', name: 'Tiếng Anh chuyên ngành', faculty: 'Ngôn ngữ', credits: 2, lecturer: 'Cô Sarah Johnson', status: 'active' }
    ];
    saveSubjects();
}
if (!logs || logs.length === 0) {
    console.log('Khởi tạo logs...');
    addLog('Khởi tạo hệ thống', 'System');
}

// ---------- API ENDPOINTS ----------

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = accounts.find(acc => acc.username === username && acc.password === password);
    if (user) {
        const { password, ...safeUser } = user;
        addLog(`Đăng nhập: ${username}`, username);
        res.json({ success: true, user: safeUser });
    } else {
        res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
});

// Register API
app.post('/api/register', (req, res) => {
    const { username, password, fullName, role, facultyName, department, lecturerCode, birthDate } = req.body;
    if (accounts.find(acc => acc.username === username)) {
        return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const newUser = { id: newId, username, password, fullName, role };
    if (role === 'faculty') newUser.facultyName = facultyName;
    if (role === 'lecturer') {
        newUser.department = department;
        if (lecturerCode) newUser.lecturerCode = lecturerCode;
        if (birthDate) newUser.birthDate = birthDate;
    }
    accounts.push(newUser);
    saveAccounts();
    addLog(`Đăng ký tài khoản mới: ${username} (${role})`, username);
    res.json({ success: true });
});

// Subjects APIs
app.get('/api/subjects', (req, res) => res.json(subjects));

app.post('/api/subjects', (req, res) => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    const newSub = { id: newId, ...req.body, status: 'active' };
    subjects.push(newSub);
    saveSubjects();
    addLog(`Thêm môn học: ${newSub.name}`, req.body.username || 'System');
    res.json({ success: true, subject: newSub });
});

app.put('/api/subjects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = subjects.findIndex(s => s.id === id);
    if (index !== -1) {
        subjects[index] = { ...subjects[index], ...req.body };
        saveSubjects();
        addLog(`Cập nhật môn học: ${subjects[index].name}`, req.body.username || 'System');
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Không tìm thấy môn học' });
    }
});

app.delete('/api/subjects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sub = subjects.find(s => s.id === id);
    subjects = subjects.filter(s => s.id !== id);
    saveSubjects();
    addLog(`Xóa môn học: ${sub?.name}`, req.body.username || 'System');
    res.json({ success: true });
});

// Users APIs
app.get('/api/users', (req, res) => {
    const safeUsers = accounts.map(({ id, username, fullName, role, facultyName, department }) => 
        ({ id, username, fullName, role, facultyName, department }));
    res.json(safeUsers);
});

app.post('/api/users', (req, res) => {
    const { username, password, fullName, role, facultyName, department } = req.body;
    if (accounts.find(acc => acc.username === username)) {
        return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
    }
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const newUser = { id: newId, username, password: password || '123', fullName, role };
    if (role === 'faculty') newUser.facultyName = facultyName;
    if (role === 'lecturer') newUser.department = department;
    accounts.push(newUser);
    saveAccounts();
    addLog(`Thêm tài khoản: ${username} (${role})`, req.body.adminUser || 'Admin');
    res.json({ success: true });
});

app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = accounts.findIndex(u => u.id === id);
    if (index !== -1) {
        accounts[index] = { ...accounts[index], ...req.body };
        saveAccounts();
        addLog(`Cập nhật tài khoản: ${accounts[index].username}`, req.body.adminUser || 'Admin');
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = accounts.find(u => u.id === id);
    accounts = accounts.filter(u => u.id !== id);
    saveAccounts();
    addLog(`Xóa tài khoản: ${user?.username}`, req.body.adminUser || 'Admin');
    res.json({ success: true });
});

// Logs & Requests APIs
app.get('/api/logs', (req, res) => res.json(logs.slice(0, 50)));
app.get('/api/requests', (req, res) => res.json(requests));

app.post('/api/requests', (req, res) => {
    const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
    const newReq = { id: newId, ...req.body, status: 'pending', createdAt: new Date().toISOString() };
    requests.push(newReq);
    saveRequests();
    addLog(`Gửi yêu cầu cập nhật môn ID ${req.body.subjectId}`, req.body.requestedBy);
    res.json({ success: true });
});

app.put('/api/requests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index] = { ...requests[index], ...req.body };
        saveRequests();
        addLog(`Xử lý yêu cầu ID ${id}: ${req.body.status}`, req.body.adminUser || 'Admin');
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Không tìm thấy request' });
    }
});

// Serve dashboard.html explicitly
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-page.html'));
});

// Fallback: nếu không tìm thấy route, gửi file login.html
app.get('*', (req, res) => {
    // Nếu request là cho file tĩnh và không tồn tại, trả về 404
    if (req.path.includes('.')) {
        return res.status(404).send('File not found');
    }
    // Nếu không, redirect về trang login
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Khởi động server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server đang chạy tại port ${PORT}`);
    console.log(`📊 Số tài khoản: ${accounts.length}`);
    console.log(`📚 Số môn học: ${subjects.length}`);
    console.log(`📝 Số logs: ${logs.length}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    saveAccounts();
    saveSubjects();
    saveLogs();
    saveRequests();
    process.exit(0);
});