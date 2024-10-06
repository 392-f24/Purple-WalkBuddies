import React, { useState } from 'react';
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

  const handleButtonClick = () => {
    navigate('/');
  };

  // Simulating pet data (this will eventually come from a database)
  const { user: petData } = useAuthState();

  if (!petData)
    return <PageTitle/>;
  return (
    <div className="profile-page" style={{ backgroundColor: 'white', maxHeight: '100vh', padding: '10px', paddingTop: 0 }}>
      <PageTitle/>

      {/* Pet Information Section */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          marginTop: '-20px',
          marginBottom: "-20px",
          marginLeft: '20px',
          marginRight: '20px',
          gap: '10px',
        }}
      >
        {/* Profile Picture*/}
        <Avatar
          alt={petData.name}
          src={petData.image || "/MaxProfilePic.jpg"}
          sx={{ width: 150, height: 150 }}
        />

        {/* Pet Information */}
        <Paper sx={{ px: 3, py: 3, boxSizing: "border-box", mx: 0, my: 3, overflow: "auto" }} elevation={4}>
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', fontSize: '25px', color: '#907AA8'}}>
            {petData.name}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ fontSize: '15px' }}>
            • Age: {petData.age} years
          </Typography>
          <Typography variant="body1" gutterBottom style={{ fontSize: '15px' }}>
            • Sex: {petData.sex}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ fontSize: '15px' }}>
            • Breed: {petData.breed}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ fontSize: '15px' }}>
            • Location: {petData.location}
          </Typography>
        </Paper>
      </Box>

      {/* Description Section */}
      <Paper sx={{
        px: 3,
        py: 3,
        boxSizing: "border-box",
        mx: 1,
        my: 3,
        overflow: "auto",
        paddingTop: '20px',
        marginLeft: '20px',
        marginRight: '20px'}}
        elevation={4}>
        <CardTitle>Description</CardTitle>
        <Typography variant="body1" style={{ fontSize: '14px' }}>
          {petData.description}
        </Typography>
      </Paper>

      {/* Traits Section */}
      <Paper sx={{
        px: 3,
        py: 3,
        boxSizing: "border-box",
        mx: 1,
        my: 3,
        overflow: "auto",
        marginTop: '10px',
        paddingTop: '20px',
        marginLeft: '20px',
        marginRight: '20px'}}
        elevation={4} >
        <CardTitle>Traits</CardTitle>
        <Box display="flex" gap="8px" flexWrap="wrap">
          {(petData.traits || []).map((trait, index) => (
            <Chip
              key={index}
              label={trait}
              style={{ backgroundColor: '#907AA8', color: 'white', fontWeight: 'bold', fontSize: '14px', marginTop: '5px'}}
            />
          ))}
        </Box>
      </Paper>

      <Button
        variant="contained"
        style={{ backgroundColor: '#907AA8', color: 'white', marginTop: '10px' }}
        onClick={handleButtonClick}
      >
        Back
      </Button>
      <Button
        variant="contained"
        style={{ backgroundColor: '#907AA8', color: 'white', marginTop: '10px' }}
        sx={{ ml: 2 }}
        onClick={() => signOut()}
      >
        Log out
      </Button>
    </div>
  );
};

export default ProfilePage;
