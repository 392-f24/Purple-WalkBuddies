import React from 'react';
import { Button, Typography, Box, Avatar, Chip, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageTitle from './PageTitle';
import { signOut, useAuthState } from '../firebase';

const CardTitle = ({ children }) => (
  <Typography variant="h5" style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '5px', color: '#907AA8'}}>
    {children}
  </Typography>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: petData } = useAuthState();

  if (!petData) return <PageTitle />;
  
  const { name, age, sex, breed, location, description, traits } = petData;

  const validTraits = Array.isArray(traits) ? traits : [];

  return (
    <div className="profile-page" style={{ backgroundColor: 'white', maxHeight: '100vh', padding: '10px' }}>
      <PageTitle />
      <Box display="flex" alignItems="center" justifyContent="center" style={{ gap: '10px' }}>
        <Avatar
          alt={name}
          src={petData.profilePic || "/MaxProfilePic.jpg"}
          sx={{ width: 150, height: 150 }}
        />
        <Paper sx={{ px: 3, py: 3 }} elevation={4}>
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', fontSize: '25px', color: '#907AA8'}}>
            {name}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ fontSize: '15px' }}>
            • Age: {age} years
          </Typography>
          <Typography variant="body1" gutterBottom style={{ fontSize: '15px' }}>
            • Sex: {sex}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ fontSize: '15px' }}>
            • Breed: {breed}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ fontSize: '15px' }}>
            • Location: {location}
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ px: 3, py: 3 }} elevation={4}>
        <CardTitle>Description</CardTitle>
        <Typography variant="body1" style={{ fontSize: '14px' }}>
          {description}
        </Typography>
      </Paper>

      <Paper sx={{ px: 3, py: 3 }} elevation={4}>
        <CardTitle>Traits</CardTitle>
        <Box display="flex" gap="8px" flexWrap="wrap">
          {validTraits.length > 0 ? (
            validTraits.map((trait, index) => (
              <Chip
                key={index}
                label={trait}
                style={{ backgroundColor: '#907AA8', color: 'white', fontWeight: 'bold', fontSize: '14px', marginTop: '5px'}}
              />
            ))
          ) : (
            <Typography>No traits available</Typography>
          )}
        </Box>
      </Paper>

      <Button variant="contained" style={{ backgroundColor: '#907AA8', color: 'white', marginTop: '10px' }} onClick={() => navigate('/')}>
        Back
      </Button>
      <Button variant="contained" style={{ backgroundColor: '#907AA8', color: 'white', marginTop: '10px' }} onClick={signOut}>
        Log out
      </Button>
    </div>
  );
};

export default ProfilePage;
