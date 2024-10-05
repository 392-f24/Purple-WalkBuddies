import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import { useDbData } from '../firebase';
import { Link } from 'react-router-dom';
import PageTitle from './PageTitle';

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
    <Avatar alt={walker.name} src={walker.picture} sx={{ width: 60, height: 60, marginRight: '20px'}} />
    <div>
    <Button
        variant="text"
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
        Has walked: {walker.reviews} times<br />
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
    {Object.entries(walkers).map(([walkerID, walker]) => (
      <Link to={`/walker/${walkerID}`} key={walkerID} style={{ textDecoration: 'none' }}>
        <PetWalker walker={walker} />
      </Link>
    ))}
  </div>
);

const SearchPage = () => {
  const [walkers, err_walkers] = useDbData("/walkers");

  if (walkers === undefined)
    return <PageTitle/>;
  return (
    <>
      <PageTitle/>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 1
        }}
      >
        <Box
          sx={{
            width: '80%',
            // maxHeight: '700px',
            overflowY: 'auto',
            padding: 2,
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
          }}
        >
          <PetWalkerList walkers={walkers} />
        </Box>
      </Box>
    </>
  );
}

export default SearchPage;