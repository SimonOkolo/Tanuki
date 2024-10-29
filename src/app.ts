import { initHomePage } from './pages/HomePage';
import { initSearchPage } from './pages/SearchPage';
import { initGenresPage } from './pages/GenresPage';
import { initAnimeDetailsPage } from './pages/AnimeDetailsPage';
import { initEpisodePage } from './pages/EpisodePage';
import { initLoginPage } from './pages/LoginPage';
import { initProfilePage } from './pages/UserProfilePage';
import { auth } from './services/firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserProfile } from './services/auth';
import { SearchBar } from './components/SearchBar';
import { AuthGuard } from './services/authGuard';

async function updateUIForAuthState(user: User | null) {
  const profileButton = document.getElementById('profile-button') as HTMLButtonElement;
  const profileImage = document.getElementById('profile-image') as HTMLImageElement;
  const loginNavItem = document.getElementById('login-nav-item');

  if (user) {
    // User is signed in
    try {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile?.profilePictureURL) {
        profileImage.src = userProfile.profilePictureURL;
      }
      profileButton.style.display = 'block';
      if (loginNavItem) loginNavItem.style.display = 'none';

      profileButton.onclick = () => {
        window.location.href = 'userprofile.html';
      };
    } catch (error) {
      console.error("Error updating UI for auth state:", error);
    }
  } else {
    // No user is signed in
    profileButton.style.display = 'none';
    if (loginNavItem) loginNavItem.style.display = 'block';
  }
}

function initAuthStateListener() {
  onAuthStateChanged(auth, (user) => {
    updateUIForAuthState(user);
  });
}

// Initialize both authentication listeners
function initAuth() {
  initAuthStateListener();
  AuthGuard.init();
}

async function initPage() {
  // Validate access before initializing the page
  const hasAccess = await AuthGuard.validateAccess();
  if (!hasAccess) {
    return; // Stop initialization if access is not granted
  }

  const currentPage = window.location.pathname.split('/').pop();
  
  // Initialize search bar if container exists
  const searchContainer = document.getElementById('search-container');
  if (searchContainer) {
    new SearchBar(searchContainer);
  }

  // Initialize page based on current route
  switch (currentPage) {
    case 'index.html':
    case '':
      initHomePage();
      break;
    case 'search.html':
      initSearchPage();
      break;
    case 'genres.html':
      initGenresPage();
      break;
    case 'animeDetails.html':
      initAnimeDetailsPage();
      break;
    case 'episode.html':
      initEpisodePage();
      break;
    case 'login.html':
      initLoginPage();
      break;
    case 'userprofile.html':
      initProfilePage();
      break;
    default:
      console.error('Unknown page');
  }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize auth first
  initAuth();
  // Then initialize the page
  initPage().catch(error => {
    console.error('Error initializing page:', error);
  });
});

// Handle errors globally
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});