document.addEventListener('DOMContentLoaded', () => {
  // Đăng nhập
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const username = document.getElementById('username').value.trim();
          const password = document.getElementById('password').value;
          const user = getUsers().find(u => u.username === username && u.password === password);
          const errEl = document.getElementById('loginError');

          if (user) {
              sessionStorage.setItem('loggedUser', JSON.stringify(user));
              window.location.href = 'dashboard.html';
          } else {
              if (errEl) {
                  errEl.style.display = 'flex';
                  errEl.classList.remove('hidden');
              }
              document.getElementById('password').value = '';
              document.getElementById('password').focus();
          }
      });
  }

  // Đăng ký
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
      const roleSelect = document.getElementById('regRole');
      const facultyGroup = document.getElementById('facultyGroup');
      if (roleSelect && facultyGroup) {
          roleSelect.addEventListener('change', () => {
              facultyGroup.style.display = roleSelect.value === 'faculty' ? 'block' : 'none';
          });
          facultyGroup.style.display = roleSelect.value === 'faculty' ? 'block' : 'none';
      }

      registerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const errEl = document.getElementById('regError');
          const showErr = (msg) => {
              errEl.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i> ${msg}`;
              errEl.style.display = 'flex';
              errEl.classList.remove('hidden');
              window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          const username = document.getElementById('regUsername').value.trim();
          const fullName = document.getElementById('regFullname').value.trim();
          const userCode = document.getElementById('regUserCode').value.trim();
          const dob = document.getElementById('regDob').value;
          const role = document.getElementById('regRole').value;
          const password = document.getElementById('regPassword').value;
          const confirm = document.getElementById('regConfirm').value;
          const facultyName = role === 'faculty' ? document.getElementById('regFacultyName').value.trim() : null;

          if (!username || !fullName || !userCode || !dob || !password) return showErr('Vui lòng điền đầy đủ thông tin bắt buộc.');
          if (password.length < 6) return showErr('Mật khẩu phải có ít nhất 6 ký tự.');
          if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
              return showErr('Mật khẩu phải bao gồm chữ, số và ký tự đặc biệt.');
          }
          if (password !== confirm) return showErr('Mật khẩu xác nhận không khớp.');
          if (role === 'faculty' && !facultyName) return showErr('Vui lòng nhập tên khoa / bộ môn.');

          const users = getUsers();
          if (users.find(u => u.username === username)) return showErr(`Tên đăng nhập "${username}" đã tồn tại.`);
          if (users.find(u => u.userCode === userCode)) return showErr(`Mã số "${userCode}" đã được đăng ký.`);

          const nextIds = JSON.parse(localStorage.getItem('nextIds'));
          const newUser = {
              id: nextIds.userId, username, password, fullName, userCode, dob, role,
              ...(role === 'faculty' && { facultyName })
          };
          users.push(newUser);
          saveUsers(users);
          nextIds.userId++;
          localStorage.setItem('nextIds', JSON.stringify(nextIds));
          addLog(`Đăng ký mới: ${username} (${role})`, username);
          alert('Đăng ký thành công! Vui lòng đăng nhập.');
          window.location.href = 'login.html';
      });
  }
});