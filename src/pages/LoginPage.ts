import { loginUser, registerUser } from '../services/auth';

export function initLoginPage() {
  const loginForm = document.getElementById('loginForm') as HTMLFormElement;
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      await loginUser(email, password);
      window.location.href = '/index.html';
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  });

  // Add registration functionality if needed
}