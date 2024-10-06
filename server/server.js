import express from 'express';            // Express framework
import admin from 'firebase-admin';       // Firebase Admin SDK
import bodyParser from 'body-parser';     // Middleware for parsing request bodies
import cors from 'cors';                  // CORS middleware

const serviceAccount = require('./path-to-your-service-account-file.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com', // Replace with actual Firebase database URL
});

const db = admin.database(); // Get a reference to the Realtime Database

const app = express(); // Initialize the Express server

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Add data to Realtime Database
app.post('/addUserRealtime', (req, res) => {
  const userData = req.body; // Data sent from the client in the body of the request
  const userRef = db.ref('users').push(); // Push creates a new child under 'users'

  userRef.set(userData, (error) => {
    if (error) {
      res.status(500).send('Error adding user: ' + error);
    } else {
      res.send('User added successfully');
    }
  });
});

// Read data from Realtime Database
app.get('/getUserRealtime/:id', (req, res) => {
  const userId = req.params.id; // Get the ID from the URL parameter
  db.ref('users/' + userId).once('value', (snapshot) => {
    if (snapshot.exists()) {
      res.send(snapshot.val()); // Send the user data back to the client
    } else {
      res.status(404).send('User not found');
    }
  });
});

app.use(cors());

// Start the Express server
const port = process.env.PORT || 3000; // Define a port to listen on
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
