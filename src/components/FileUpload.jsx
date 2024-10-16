import React, { useState } from 'react';
import { getStorage, ref, uploadString } from 'firebase/storage';

const FileUpload = ({ file, setFile }) => {

   const handleFileChange = (event) => {
       setFile(event.target.files[0]);
   };

   const handleUpload = () => {
       if (file) {
           const storage = getStorage();
           const storageRef = ref(storage, file.name);
           const reader = new FileReader();
           reader.onload = () => {
               const base64String = reader.result.split(',')[1];
               uploadString(storageRef, base64String, 'base64')
                   .then((snapshot) => {
                       console.log('Uploaded a base64 string!');
                   })
                   .catch((error) => {
                       console.error('Upload failed:', error);
                   });
           };
           reader.readAsDataURL(file);
       }
   };

   return (
       <div>
           <input type="file" onChange={handleFileChange} />
           <button onClick={handleUpload}>Upload</button>
       </div>
   );
};

export default FileUpload;