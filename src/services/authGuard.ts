import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";

export class AuthGuard {
  private static readonly PUBLIC_PAGES = [
    'login.html',
    ''
  ];

  private static readonly PROTECTED_PAGES = [
    'userprofile.html',
    'index.html',
    'search.html',
    'genres.html',
    'animeDetails.html',
    'episode.html',
    ''
  ];

  public static init() {
    onAuthStateChanged(auth, (user) => {
      const currentPage = window.location.pathname.split('/').pop() || '';
      
      if (!user && this.PROTECTED_PAGES.includes(currentPage)) {
        // User is not authenticated and trying to access protected page
        console.log('Unauthorized access attempt - redirecting to login');
        window.location.href = '/login.html';
        return;
      }

      if (user && currentPage === 'login.html') {
        // User is authenticated but on login page
        console.log('Authenticated user on login page - redirecting to home');
        window.location.href = '/index.html';
        return;
      }
    });
  }

  public static isProtectedPage(page: string): boolean {
    return this.PROTECTED_PAGES.includes(page);
  }

  public static async validateAccess(): Promise<boolean> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        const currentPage = window.location.pathname.split('/').pop() || '';
        
        if (!user && this.isProtectedPage(currentPage)) {
          window.location.href = '/login.html';
          resolve(false);
        } else {
          resolve(true);
        }
        unsubscribe();
      });
    });
  }
}