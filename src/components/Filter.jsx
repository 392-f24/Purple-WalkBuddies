import React, { useEffect, useMemo, useState } from 'react';
import {Button, IconButton, Modal, Box, Typography, Chip, Divider } from '@mui/material'
import {Tune} from '@mui/icons-material'
import { filterData } from '../utils';
import { useAuthState } from '../firebase';


export default function Filter({resource, setResource}) {
    const { user } = useAuthState();

    const [display, setDisplay] = useState(false);
    const [dogs, setDogs] = useState(false);
    const [cats, setCats] = useState(false);
    const [smallPets, setSmallPets] = useState(false);
    const [bigPets, setBigPets] = useState(false);
    const [smallDogs, setSmallDogs] = useState(false);
    const [bigDogs, setBigDogs] = useState(false);
    const [smallCats, setSmallCats] = useState(false);
    const [bigCats, setBigCats] = useState(false);
    const [allBreeds, setAllBreeds] = useState(false);
    const [sorted, setSorted] = useState(false);

    const currentfilter = useMemo(() => [
        { key: 'Dogs', value: dogs },
        { key: 'Cats', value: cats },
        { key: 'Small Pets', value: smallPets },
        { key: 'Big Pets', value: bigPets },
        { key: 'Small Dogs', value: smallDogs },
        { key: 'Big Dogs', value: bigDogs },
        { key: 'Small Cats', value: smallCats },
        { key: 'Big Cats', value: bigCats },
        { key: 'All Breeds', value: allBreeds }
    ].filter(item => item.value === true), [dogs, cats, smallPets, bigPets, smallDogs, bigDogs, smallCats, bigCats, allBreeds]);

    useEffect(() => {
      if (resource && user)
        filterData(resource, user, currentfilter).then(setResource);
    }, [resource, user, setResource, currentfilter]);

    const toggleTag = (tagSetter) => {
        tagSetter((prevState) => !prevState);
    };

    const filterOnClick = () => {
        setDisplay(true)
    }

    const handleClose = async () => {
        setDisplay(false)
        setResource(await filterData(resource, user, currentfilter));
    }


    return (
        <>
            <Button
                endIcon={<Tune/>}
                onClick={filterOnClick}>
                Filter
            </Button>
            <Modal
                open={display}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              maxWidth: "90%",
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}>
            {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                Sort
            </Typography>
            <Chip
                label="Sort Items"
                clickable
                onClick={() => toggleTag(setSorted)}
                color={sorted ? 'primary' : 'default'}
                sx={{ mt: 2 }}
            /> */}

            <Typography id="modal-modal-title" variant="h6" component="h2">
                Tags
            </Typography>

        <Chip
          label="Dogs"
          clickable
          onClick={() => toggleTag(setDogs)}
          color={dogs ? 'primary' : 'default'}
          sx={{ mt: 2, mr: 1 }}
        />
        <Chip
          label="Cats"
          clickable
          onClick={() => toggleTag(setCats)}
          color={cats ? 'primary' : 'default'}
          sx={{ mt: 2, mr: 1 }}
        />
        <Chip
          label="Small Pets"
          clickable
          onClick={() => toggleTag(setSmallPets)}
          color={smallPets ? 'primary' : 'default'}
          sx={{ mt: 2, mr: 1 }}
        />
        <Chip
          label="Big Pets"
          clickable
          onClick={() => toggleTag(setBigPets)}
          color={bigPets ? 'primary' : 'default'}
          sx={{ mt: 2, mr: 1 }}
        />
        <Chip
          label="Small Dogs"
          clickable
          onClick={() => toggleTag(setSmallDogs)}
          color={smallDogs ? 'primary' : 'default'}
          sx={{ mt: 2, mr: 1 }}
        />
        <Chip
          label="Big Dogs"
          clickable
          onClick={() => toggleTag(setBigDogs)}
          color={bigDogs ? 'primary' : 'default'}
          sx={{ mt: 2, mr: 1 }}
        />
        <Chip
          label="Small Cats"
          clickable
          onClick={() => toggleTag(setSmallCats)}
          color={smallCats ? 'primary' : 'default'}
          sx={{ mt: 2, mr: 1 }}
        />
        <Chip
          label="Big Cats"
          clickable
          onClick={() => toggleTag(setBigCats)}
          color={bigCats ? 'primary' : 'default'}
          sx={{ mt: 2, mr: 1 }}
        />
        <Chip
          label="All Breeds"
          clickable
          onClick={() => toggleTag(setAllBreeds)}
          color={allBreeds ? 'primary' : 'default'}
          sx={{ mt: 2 }}
        />
        <Divider sx={{ my: 2 }}/>
        <Button onClick={handleClose} variant="contained" sx={{ float: "right" }}>Done</Button>
      </Box>
    </Modal>
        </>
    );

}


