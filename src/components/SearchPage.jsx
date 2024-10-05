import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Link from '@mui/material/Link';

const information = {
  title: "Walk Buddies",
  petWalkers: {
    "1": {
      "name": "Iris Rev",
      "description": "Experienced dog walker who loves animals.",
      "price": 25,
      "rating": 4.8,
      "totalTasks": 150,
      "location": "Evanston, IL",
      "availability": "Monday to Friday, 9 AM - 6 PM",
      "image": "https://randomuser.me/api/portraits/women/47.jpg",
      "preferences": ["Small dogs", "Medium dogs"]
    },
    "2": {
      "name": "Annie He",
      "description": "Cat lover with 5 years of experience in pet care.",
      "price": 30,
      "rating": 4.5,
      "totalTasks": 10,
      "location": "Evanston, IL",
      "availability": "Weekends only",
      "image": "https://randomuser.me/api/portraits/women/76.jpg",
      "preferences": ["Cats", "Small dogs"]
    },
    "3": {
      "name": "Emily Stas",
      "description": "Dog trainer with over 10 years of experience.",
      "price": 40,
      "rating": 4.9,
      "totalTasks": 200,
      "location": "Evanston, IL",
      "availability": "Monday to Saturday, 8 AM - 5 PM",
      "image": "https://randomuser.me/api/portraits/women/27.jpg",
      "preferences": ["All breeds"]
    }
  }
};

const Banner = ({title}) => (
  <div style={{
    display: 'flex',            // Use flexbox
    justifyContent: 'center',   // Center horizontally
    padding: '20px 50px 0px 50px'    
  }}>
    <Typography sx={{fontSize: '40px', fontWeight: 'bold'}}>
      {title}
    </Typography>
  </div>
);

const PetWalker = ({walker}) => (
  <Paper
    sx={{
      display: 'flex',
      padding: 2,
      marginBottom: 2,
      borderRadius: 2,
      width: '90%',
      alignItems: 'center'
    }}
  >
    <Avatar alt={walker.name} src={walker.image} sx={{ idth: 60, height: 60, marginRight: 2}} />
    <div>
    <Button 
        variant="text"
        onClick={() => alert(`${walker.name} clicked!`)}
        sx={{ 
          textTransform: 'none',
          padding: 0.5,
          color: '#907AA8'
        }}
      >
        <Typography variant="h6">{walker.name}</Typography>
    </Button>
      <Typography variant="body2">{walker.description}</Typography>
      <Typography variant="body2">
        Price: ${walker.price} / hr | Rating: <Rating value={walker.rating} precision={0.1} readOnly />
      </Typography>
      <Typography variant="body2">
        Has walked: {walker.totalTasks} times<br />
        Location: {walker.location}<br />
        Availability: {walker.availability}
      </Typography>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
        {walker.preferences.map((pref, index) => (
          <Chip key={index} label={pref} color="primary" variant="outlined" />
        ))}
      </div>
    </div>
  </Paper>
);

const PetWalkerList = ({walkers}) => (
  <div className="walker-list">
    {Object.values(walkers).map((walker) => (
      <PetWalker key={walker.name} walker={walker} />
    ))}
  </div>
);

const SearchPage = () => {
  return (
    <>
      <Button variant="text" color="primary">
        <Banner title={information.title} />
      </Button>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2
        }}
      >
        <Box
          sx={{
            width: '80%',
            maxHeight: '700px',
            overflowY: 'auto',
            padding: 2,
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
          }}
        >
          <PetWalkerList walkers={information.petWalkers} />
        </Box>
      </Box>
    </>
  );
}

export default SearchPage;