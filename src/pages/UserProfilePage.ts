import { auth } from '../services/firebase';
import { updateUserProfile, getUserProfile, logoutUser } from '../services/auth';
import { initCurrentlyWatching } from '../components/CurrentlyWatching';

export function initProfilePage() {
  const profileForm = document.getElementById('profileForm') as HTMLFormElement;
  const profilePicture = document.getElementById('profilePicture') as HTMLImageElement;
  const usernameBox = document.getElementById('username') as HTMLInputElement;
  const emailbox = document.getElementById('email') as HTMLInputElement;
  const profileButton = document.getElementById('profile-nav-bar-item-2') as HTMLButtonElement;
  const continueWatchingButton = document.getElementById('profile-nav-bar-item-1') as HTMLButtonElement;
  const preferencesButton = document.getElementById('profile-nav-bar-item-3') as HTMLButtonElement;
  const logoutButton = document.getElementById('logout-button') as HTMLButtonElement;
  const settingsdiv = document.getElementById('usersettings') as HTMLDivElement;

  const accountSection = document.querySelector('.profile') as HTMLDivElement;
  const continueWatchingSection = document.querySelector('.continueWatching') as HTMLDivElement;
  const preferencesSection = document.querySelector('.preferences') as HTMLDivElement;

  function hideAllSections() {
    accountSection.style.display = 'none';
    continueWatchingSection.style.display = 'none';
    preferencesSection.style.display = 'none';
}

// Function to remove active class from all buttons
function removeActiveClass() {
    profileButton.classList.remove('active');
    continueWatchingButton.classList.remove('active');
    preferencesButton.classList.remove('active');
}

  async function loadUserProfile() {
    const user = auth.currentUser;
    if (user) {
      const profile = await getUserProfile(user.uid);
      usernameBox.value = profile.username || '';
      emailbox.value = profile.email || '';
      if (profile.profilePictureURL) {
        profilePicture.src = profile.profilePictureURL;
      }
    }
  }

  logoutButton?.addEventListener('click', async () => {
    try {
      await logoutUser();
      window.location.href = '/login.html';
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  });

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const fileInput = document.getElementById('profilePictureInput') as HTMLInputElement;
      const file = fileInput.files?.[0];
      
      try {
        await updateUserProfile(user, {
          username: usernameBox.value,
          email: emailbox.value,
          profilePicture: file
        });
        alert('Profile updated successfully!');
        loadUserProfile();
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  });
  hideAllSections();
  loadUserProfile();
  initCurrentlyWatching();

  accountSection.style.display = 'block';
  profileButton.classList.add('active');

  continueWatchingButton.addEventListener('click', () => {
    hideAllSections();
    removeActiveClass();
    continueWatchingSection.style.display = 'block';
    continueWatchingButton.classList.add('active');
});

profileButton.addEventListener('click', () => {
    hideAllSections();
    removeActiveClass();
    accountSection.style.display = 'block';
    profileButton.classList.add('active');
});

preferencesButton.addEventListener('click', () => {
    hideAllSections();
    removeActiveClass();
    preferencesSection.style.display = 'block';
    preferencesButton.classList.add('active');
});
}

