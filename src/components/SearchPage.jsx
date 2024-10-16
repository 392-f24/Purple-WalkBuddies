import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import { useDbData } from '../firebase';
import { Link } from 'react-router-dom';
import PageTitle from './PageTitle';
import { Stack } from '@mui/material';

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PetWalker = ({walker}) => (
  <Paper
    sx={{
      display: 'flex',
      padding: 2,
      marginBottom: 2,
      borderRadius: 2,
      alignItems: 'center'
    }}
  >
    <Avatar alt={walker.name} src={walker.picture} sx={{ width: 60, height: 60, marginRight: '20px'}} />
    <div>
      <Typography variant="h6" color="primary">{walker.name}</Typography>
      <Typography variant="body2" sx={{ mb: 0.6 }}>{walker.description}</Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">
          Price: ${walker.price} / hr | Rating:
        </Typography>
        <Rating value={walker.rating} precision={0.1} readOnly size="small"/>
      </Stack>
      <Typography variant="body2">
        {walker.reviews} matches in Walk Buddies<br />
        Location: {walker.location}<br />
        Available on: {week.filter((e, i) => walker.availability[i].some(e => e)).join(' ')}
      </Typography>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
        {(walker.preferences || []).map((pref, index) => (
          <Chip key={index} label={pref} color="primary" variant="outlined" size="small"/>
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
  const [walkers, err_walkers] = useDbData("/walkers", { sync: false });

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
            width: '95%',
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