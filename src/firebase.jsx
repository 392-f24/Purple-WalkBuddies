import { useCallback, useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, update, get } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCaj-Y6Zscgs0DVZ7RSSZxY_b3oitQrOv8",
  authDomain: "nu-cs392-thomaswang.firebaseapp.com",
  databaseURL: "https://nu-cs392-thomaswang-default-rtdb.firebaseio.com",
  projectId: "nu-cs392-thomaswang",
  storageBucket: "nu-cs392-thomaswang.appspot.com",
  messagingSenderId: "678035225662",
  appId: "1:678035225662:web:4cc02f2a93b4e69448e56f",
  measurementId: "G-Q7DCPB2YNM"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useDbData = (path, { sync = true } = {}) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sync) {
      return onValue(ref(database, "/walkbuddies" + path), (snapshot) => {
        setData(snapshot.val());
      }, (error) => {
        setError(error);
      });
    } else {
      get(ref(database, "/walkbuddies" + path)).then((snapshot) => {
        setData(snapshot.val());
      }).catch((error) => {
        setError(error);
      });
    }
  }, [path]);

  return [data, error];
};

const makeResult = (error) => {
  const timestamp = Date.now();
  const message = error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback((value) => {
    update(ref(database, "/walkbuddies" + path), value)
    .then(() => setResult(makeResult()))
    .catch((error) => setResult(makeResult(error)))
  }, [database, path]);

  return [updateData, result];
};

// Google Auth

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useAuthState = () => {
  const [Guser, setGuser] = useState();
  const [user, err_user] = useDbData(`/owners/${Guser?.uid}`);

  useEffect(() => (
    onAuthStateChanged(getAuth(firebase), setGuser)
  ), []);

  return {
    Guser, user, err_user,
    auth: Boolean(Guser && user),
    loading: user === undefined
  };
};