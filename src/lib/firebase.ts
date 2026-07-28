import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  Notice, 
  RoutineItem, 
  ExamRoutineItem, 
  AdmissionApplication, 
  BannerSlide, 
  SchoolInfo 
} from '../types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Realtime listeners with automatic seed if empty
export function subscribeNotices(onUpdate: (data: Notice[]) => void, initialDefaults: Notice[]) {
  const colRef = collection(db, 'notices');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty && initialDefaults.length > 0) {
      initialDefaults.forEach((notice) => {
        setDoc(doc(db, 'notices', notice.id), notice);
      });
      onUpdate(initialDefaults);
    } else {
      const items = snapshot.docs.map(doc => doc.data() as Notice);
      onUpdate(items);
    }
  }, (err) => {
    console.error('Firestore notices subscription error:', err);
  });
}

export function subscribeClassRoutines(onUpdate: (data: RoutineItem[]) => void, initialDefaults: RoutineItem[]) {
  const colRef = collection(db, 'classRoutines');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty && initialDefaults.length > 0) {
      initialDefaults.forEach((item) => {
        setDoc(doc(db, 'classRoutines', item.id), item);
      });
      onUpdate(initialDefaults);
    } else {
      const items = snapshot.docs.map(doc => doc.data() as RoutineItem);
      onUpdate(items);
    }
  }, (err) => {
    console.error('Firestore classRoutines subscription error:', err);
  });
}

export function subscribeExamRoutines(onUpdate: (data: ExamRoutineItem[]) => void, initialDefaults: ExamRoutineItem[]) {
  const colRef = collection(db, 'examRoutines');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty && initialDefaults.length > 0) {
      initialDefaults.forEach((item) => {
        setDoc(doc(db, 'examRoutines', item.id), item);
      });
      onUpdate(initialDefaults);
    } else {
      const items = snapshot.docs.map(doc => doc.data() as ExamRoutineItem);
      onUpdate(items);
    }
  }, (err) => {
    console.error('Firestore examRoutines subscription error:', err);
  });
}

export function subscribeApplications(onUpdate: (data: AdmissionApplication[]) => void, initialDefaults: AdmissionApplication[]) {
  const colRef = collection(db, 'applications');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty && initialDefaults.length > 0) {
      initialDefaults.forEach((item) => {
        setDoc(doc(db, 'applications', item.id), item);
      });
      onUpdate(initialDefaults);
    } else {
      const items = snapshot.docs.map(doc => doc.data() as AdmissionApplication);
      onUpdate(items);
    }
  }, (err) => {
    console.error('Firestore applications subscription error:', err);
  });
}

export function subscribeBanners(onUpdate: (data: BannerSlide[]) => void, initialDefaults: BannerSlide[]) {
  const colRef = collection(db, 'banners');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty && initialDefaults.length > 0) {
      initialDefaults.forEach((item) => {
        setDoc(doc(db, 'banners', item.id), item);
      });
      onUpdate(initialDefaults);
    } else {
      const items = snapshot.docs.map(doc => doc.data() as BannerSlide);
      onUpdate(items);
    }
  }, (err) => {
    console.error('Firestore banners subscription error:', err);
  });
}

export function subscribeSchoolInfo(onUpdate: (data: SchoolInfo) => void, initialDefault: SchoolInfo) {
  const docRef = doc(db, 'schoolInfo', 'main');
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      setDoc(docRef, initialDefault);
      onUpdate(initialDefault);
    } else {
      onUpdate(snapshot.data() as SchoolInfo);
    }
  }, (err) => {
    console.error('Firestore schoolInfo subscription error:', err);
  });
}

// Write/Save utilities
export async function saveNoticeToFirestore(notice: Notice) {
  await setDoc(doc(db, 'notices', notice.id), notice);
}

export async function deleteNoticeFromFirestore(id: string) {
  await deleteDoc(doc(db, 'notices', id));
}

export async function saveClassRoutineToFirestore(item: RoutineItem) {
  await setDoc(doc(db, 'classRoutines', item.id), item);
}

export async function deleteClassRoutineFromFirestore(id: string) {
  await deleteDoc(doc(db, 'classRoutines', id));
}

export async function saveExamRoutineToFirestore(item: ExamRoutineItem) {
  await setDoc(doc(db, 'examRoutines', item.id), item);
}

export async function deleteExamRoutineFromFirestore(id: string) {
  await deleteDoc(doc(db, 'examRoutines', id));
}

export async function saveApplicationToFirestore(appItem: AdmissionApplication) {
  await setDoc(doc(db, 'applications', appItem.id), appItem);
}

export async function deleteApplicationFromFirestore(id: string) {
  await deleteDoc(doc(db, 'applications', id));
}

export async function saveBannerToFirestore(banner: BannerSlide) {
  await setDoc(doc(db, 'banners', banner.id), banner);
}

export async function deleteBannerFromFirestore(id: string) {
  await deleteDoc(doc(db, 'banners', id));
}

export async function saveSchoolInfoToFirestore(info: SchoolInfo) {
  await setDoc(doc(db, 'schoolInfo', 'main'), info);
}
