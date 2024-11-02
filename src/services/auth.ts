import { auth, db, storage } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Episode } from '../types';

export async function registerUser(email: string, password: string, username: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
    });
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

export async function createUser(email: string, password: string, username: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
export async function getAllUsers() {
try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} catch (error) {
    console.error("Error getting all users:", error);
    throw error;
}
}
  
export async function deleteUser(userId: string) {
try {
    await setDoc(doc(db, "users", userId), { deleted: true }, { merge: true });
} catch (error) {
    console.error("Error deleting user:", error);
    throw error;
    }
}

export async function uploadProfilePicture(user: User, file: File) {
    try {
      // Create a reference to the location you want to upload to in Firebase Storage
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
  
      // Upload the file
      await uploadBytes(storageRef, file);
  
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
  
      // Update the user's document in Firestore with the new profile picture URL
      await updateDoc(doc(db, "users", user.uid), {
        profilePictureURL: downloadURL
      });
  
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
}

export async function updateUserProfile(user: User, data: { username?: string, profilePicture?: File }) {
  try {
    const userRef = doc(db, "users", user.uid);
    const updateData: any = {};

    if (data.username) {
      updateData.username = data.username;
    }

    if (data.profilePicture) {
      const profilePictureURL = await uploadProfilePicture(user, data.profilePicture);
      updateData.profilePictureURL = profilePictureURL;
    }

    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<any> {
  const userDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

//ANIME EPISODE SAVING

export async function saveAnimeToProfile(userId: string, animeId: string, episode: Episode): Promise<void> {
  const userDoc = doc(db, 'users', userId);
  const watchingCollection = collection(userDoc, 'watching');
  const animeDoc = doc(watchingCollection, animeId);
  const animeData = {
    animeId,
    episode,
    timestamp: new Date()
  };
  await setDoc(animeDoc, animeData);
}

export async function removeAnimeFromProfile(userId: string, animeId: string): Promise<void> {
  const userDoc = doc(db, 'users', userId);
  const watchingCollection = collection(userDoc, 'watching');
  const animeDoc = doc(watchingCollection, animeId);
  await deleteDoc(animeDoc);
}