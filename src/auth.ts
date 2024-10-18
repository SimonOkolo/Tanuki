import axios from 'axios';

interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    try {
        const response = await axios.post('/api/login', { username, password });
        if (response.data.success) {
            localStorage.setItem('authToken', response.data.token);
            return { success: true, token: response.data.token };
        } else {
            return { success: false, message: response.data.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An error occurred during login' };
    }
}

export function logout(): void {
    localStorage.removeItem('authToken');
    window.location.href = '/login.html';
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
}

export function redirectIfNotAuthenticated(): void {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}