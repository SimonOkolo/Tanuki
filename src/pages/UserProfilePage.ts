import { auth } from '../services/firebase';
import { updateUserProfile, getUserProfile } from '../services/auth';

export function initProfilePage() {
  const profileForm = document.getElementById('profileForm') as HTMLFormElement;
  const profilePicture = document.getElementById('profilePicture') as HTMLImageElement;
  const usernameInput = document.getElementById('username') as HTMLInputElement;

  async function loadUserProfile() {
    const user = auth.currentUser;
    if (user) {
      const profile = await getUserProfile(user.uid);
      usernameInput.value = profile.username || '';
      if (profile.profilePictureURL) {
        profilePicture.src = profile.profilePictureURL;
      }
    }
  }

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const fileInput = document.getElementById('profilePictureInput') as HTMLInputElement;
      const file = fileInput.files?.[0];
      
      try {
        await updateUserProfile(user, {
          username: usernameInput.value,
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

  loadUserProfile();
}