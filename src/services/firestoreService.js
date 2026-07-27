import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Generic helpers used across the Students, Attendance, Assignments and Marks modules.

export async function listDocs(collectionName, constraints = []) {
  const q = constraints.length
    ? query(collection(db, collectionName), ...constraints)
    : collection(db, collectionName);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function createDoc(collectionName, data) {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export function updateDocById(collectionName, id, data) {
  return updateDoc(doc(db, collectionName, id), data);
}

export function deleteDocById(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}

export { where, orderBy };
