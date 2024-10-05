import React, { useState } from 'react';
import { Button, Typography, Box, Avatar, Chip, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
  const [petData, setpetData] = useState({
    name: "Max",
    age: 3,
    sex: "Male",
    breed: "Golden Retriever",
    location: "Evanston, IL",
    image: "./MaxProfilePic.jpg",
    description: "Max is a gentle, friendly, and playful Golden Retriever who loves spending time with his family. He enjoys long walks, fetching balls, and is very good with children. Max was adopted from a shelter and quickly became a beloved member of the family. He has a heart of gold and is always eager to please.",
    traits: ["Loyal", "Playful", "Good with children", "Energetic", "Allergic to Nuts"]
  });

  return (
    <div className="profile-page" style={{ backgroundColor: 'white', height: '100vh', padding: '10px' }}>
      <h1 
        style={{
          color: '#907AA8',
          textAlign: 'center',
          marginTop: '0px',
          paddingTop: '5px',
        }}
      >
        WalkBuddies
      </h1>

      {/* Pet Information Section */}
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        style={{ 
          marginTop: '-20px',
          marginBottom: "-20px", 
          marginLeft: '10px',
          marginRight: '10px',
          gap: '10px', 
        }}
      >
        {/* Profile Picture*/}
        <Avatar 
          alt={petData.name} 
          src={petData.image} 
          sx={{ width: 200, height: 200 }}
        />

        {/* Pet Information */}
        <Paper sx={{ px: 3, py: 3, boxSizing: "border-box", mx: 1, my: 3, overflow: "auto" }} elevation={4}>
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
        marginLeft: '10px',
        marginRight: '10px'}} 
        elevation={4}>
        <CardTitle>Description</CardTitle>
        <Typography variant="body1" style={{ fontSize: '12px' }}>
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
        paddingTop: '10px',
        marginLeft: '10px',
        marginRight: '10px'}} 
        elevation={4} >
        <CardTitle>Traits</CardTitle>
        <Box display="flex" gap="8px" flexWrap="wrap">
          {petData.traits.map((trait, index) => (
            <Chip 
              key={index} 
              label={trait} 
              style={{ backgroundColor: '#907AA8', color: 'white', fontWeight: 'bold', fontSize: '12px', marginTop: '5px'}} 
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
    </div>
  );
};

export default ProfilePage;
