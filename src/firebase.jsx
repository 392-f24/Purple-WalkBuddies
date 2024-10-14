import { useCallback, useEffect, useMemo, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, update, get, push } from 'firebase/database';
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

const _useDbData = (paths, { sync = true } = {}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    setData(d => {
      if (d.length === paths.length) return d;
      if (d.length > paths.length)
        return d.slice(0, paths.length);
      else
      return [...d, ...new Array(paths.length - d.length).fill(undefined)];
    });
    setError(e => {
      if (e.length === paths.length) return e;
      if (e.length > paths.length)
        return e.slice(0, paths.length);
      else
      return [...e, ...new Array(paths.length - e.length).fill(null)];
    });
  }, [paths.length]);

  useEffect(() => {
    const callbacks = paths.map((p, idx) => {
      const setMyData = myData => setData(d => d.map((e, i) => i === idx ? myData : e));
      const setMyError = myError => setError(err => err.map((e, i) => i === idx ? myError : e));
      if (!p) {
        setMyData(null);
        setMyError(null);
      }
      if (sync) {
        return onValue(ref(database, "/walkbuddies" + p), (snapshot) => {
          setMyData(snapshot.val());
        }, (error) => {
          setMyError(error);
        });
      } else {
        get(ref(database, "/walkbuddies" + p)).then((snapshot) => {
          setMyData(snapshot.val());
        }).catch((error) => {
          setMyError(error);
        });
      }
    });
    return (...args) => callbacks.forEach(f => f && f(...args));
  }, [paths]);

  return [data, error];
};

export const useDbData = (path, ...args) => {
  const paths = useMemo(() => Array.isArray(path) ? path : [path], [path]);
  const res = _useDbData(paths, ...args);
  return Array.isArray(path) ? res : res.map(e => e[0]);
}

const makeResult = (error) => {
  const timestamp = Date.now();
  const message = error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback((value, { push: _push = false }={}) => {
    const reference = _push ? push(ref(database, "/walkbuddies" + path)) : ref(database, "/walkbuddies" + path);
    update(reference, value)
    .then(() => setResult(makeResult()))
    .catch((error) => setResult(makeResult(error)));
    return reference;
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

  // useEffect(() => console.log(Guser), [Guser]);
  useEffect(() => (
    onAuthStateChanged(getAuth(firebase), setGuser)
  ), []);

  return {
    Guser, user, err_user,
    auth: Boolean(Guser && user),
    loading: user === undefined
  };
};