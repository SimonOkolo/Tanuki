import axios from 'axios';

interface User {
  _id: string;
  username: string;
  role: 'user' | 'admin';
}

export function initAdminPanel(): void {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  const adminPanel = document.getElementById('adminPanel');
  if (!adminPanel) return;

  const userList = document.createElement('ul');
  adminPanel.appendChild(userList);

  const createUserForm = document.createElement('form');
  createUserForm.innerHTML = `
    <input type="text" id="newUsername" placeholder="Username" required>
    <input type="password" id="newPassword" placeholder="Password" required>
    <select id="newRole">
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
    <button type="submit">Create User</button>
  `;
  adminPanel.appendChild(createUserForm);

  function fetchUsers() {
    axios.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      userList.innerHTML = '';
      response.data.forEach((user: User) => {
        const li = document.createElement('li');
        li.textContent = `${user.username} (${user.role})`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteUser(user._id);
        
        li.appendChild(deleteButton);
        userList.appendChild(li);
      });
    })
    .catch(error => console.error('Error fetching users:', error));
  }

  function createUser(username: string, password: string, role: 'user' | 'admin') {
    axios.post('/api/users', { username, password, role }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('User created successfully');
      fetchUsers();
    })
    .catch(error => console.error('Error creating user:', error));
  }

  function deleteUser(userId: string) {
    axios.delete(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('User deleted successfully');
      fetchUsers();
    })
    .catch(error => console.error('Error deleting user:', error));
  }

  createUserForm.onsubmit = (e) => {
    e.preventDefault();
    const username = (document.getElementById('newUsername') as HTMLInputElement).value;
    const password = (document.getElementById('newPassword') as HTMLInputElement).value;
    const role = (document.getElementById('newRole') as HTMLSelectElement).value as 'user' | 'admin';
    createUser(username, password, role);
  };

  fetchUsers();
}