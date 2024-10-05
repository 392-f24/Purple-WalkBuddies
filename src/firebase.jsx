import { useCallback, useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, update } from 'firebase/database';

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

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => (
    onValue(ref(database, "/walkbuddies" + path), (snapshot) => {
     setData( snapshot.val() );
    }, (error) => {
      setError(error);
    })
  ), [ path ]);

  return [ data, error ];
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