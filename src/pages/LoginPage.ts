import { login } from '../auth';

export function initLoginPage(): void {
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        const result = await login(username, password);
        
        if (result.success) {
            window.location.href = '/index.html';
        } else {
            alert(result.message);
        }
    });
}