import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB limit, per Sec 11.1

export const uploadFile = (file, folderPath, onProgress) => {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error('File size exceeds the maximum allowable limit of 5MB.'));
      return;
    }

    const fileRef = ref(storage, `${folderPath}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};
