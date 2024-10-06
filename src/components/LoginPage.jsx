import React, { useState, useEffect } from 'react';
import { Stack, Button, Box, Typography, TextField, Paper, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageTitle from './PageTitle';
import { signInWithGoogle, signOut, useAuthState, useDbUpdate } from "../firebase";

const LoginPage = () => {
  const [petType, setPetType] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [breed, setBreed] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [traits, setTraits] = useState('');

  const navigate = useNavigate();
  const { Guser, user, auth } = useAuthState();
  const [update, result] = useDbUpdate(`/owners/${Guser?.uid}`);

  useEffect(() => {
    if (result?.error) {
      window.alert("Failed to register:\n\n" + result.message);
    }  else {
      if (result?.timestamp) {
        window.alert(result.message);
      }
    }
  }, [result]);

  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth]);

  const handleGetStarted = () => {
    update({
      petType, name, age, sex, breed, location, description,
      traits: [...new Set(traits.split(',').map(e => e.trim()).filter(e => e.length))]
    });
  };

  if (!Guser) return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f5',
        px: 5,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: '450px',
          textAlign: 'center',
          boxShadow: '2px 4px 6px rgba(144, 122, 168, .3)',
        }}
      >
        <Typography variant="h4" sx={{ color: '#907AA8', fontWeight: 'bold', mb: 2 }}>
          Welcome to WalkBuddies
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
          Log in to get started and find your personal dog walker.
        </Typography>

        <Button
          onClick={() => signInWithGoogle()}
          variant="contained"
          sx={{
            backgroundColor: '#907AA8',
            color: 'white',
            padding: '12px 24px',
            fontSize: '16px',
            textTransform: 'none',
            borderRadius: '25px',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#795DA8',
            },
          }}
        >
          Log in with Google
        </Button>
      </Paper>
    </Box>
  );

  return (
    <>
      <PageTitle title="Pet Onboarding" />
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ flexWrap: 'wrap' }} useFlexGap>
        <Chip
          avatar={<Avatar alt={Guser.displayName} src={Guser.photoURL}/>}
          label={Guser.email}
          variant="outlined"
        />
        <Chip
          label="Change Account"
          variant="contained"
          color="primary"
          onClick={() => signInWithGoogle()}
        />
      </Stack>


      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Paper
          sx={{
            width: '80%',
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 0.5, color: '#907AA8' }}>
            Tell us about your pet!
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Pet type:
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <Button
              variant="contained"
              onClick={() => setPetType('dog')}
              sx={{
                textTransform: 'none',
                padding: 1,
                backgroundColor: petType === 'dog' ? '#795DA8' : '#907AA8',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#795DA8',
                },
              }}
            >
              Dog
            </Button>
            <Button
              variant="contained"
              onClick={() => setPetType('cat')}
              sx={{
                textTransform: 'none',
                padding: 1,
                backgroundColor: petType === 'cat' ? '#795DA8' : '#907AA8',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#795DA8',
                },
              }}
            >
              Cat
            </Button>
          </Box>

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            label="Age"
            variant="outlined"
            fullWidth
            margin="normal"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />

          <TextField
            label="Sex"
            variant="outlined"
            fullWidth
            margin="normal"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
          />

          <TextField
            label="Breed"
            variant="outlined"
            fullWidth
            margin="normal"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />

          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TextField
            label="Traits (comma separated)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={traits}
            onChange={(e) => setTraits(e.target.value)}
            helperText="e.g., Loyal, Playful, Energetic"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleGetStarted}
            disabled={!petType || !location || !name || !age || !sex || !breed || !description}
            sx={{
              backgroundColor: '#907AA8',
              '&:hover': {
                backgroundColor: '#795DA8',
              },
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default LoginPage;
