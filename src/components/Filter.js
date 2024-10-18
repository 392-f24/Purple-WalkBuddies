import React from 'react';
import {Button, IconButton} from '@mui/material'
import {Tune} from '@mui/icons-material'
import { useProcessedDbData } from '../firebase';


export const Filter = (setResource) => {
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
    const [display, setDisplay] = useState(false);

    const toggleTag = (tagSetter) => {
        tagSetter((prevState) => !prevState);
    };

    const filterOnClick = () => {
        setDisplay(true)
    }

    const handleClose = () => {
        setDisplay(false)
        let currentfilter = [
            { key: 'Dogs', value: dogs },
            { key: 'Cats', value: cats },
            { key: 'Small pets', value: smallPets },
            { key: 'Big pets', value: bigPets },
            { key: 'Small dogs', value: smallDogs },
            { key: 'Big dogs', value: bigDogs },
            { key: 'Small cats', value: smallCats },
            { key: 'Big cats', value: bigCats },
            { key: 'All breeds', value: allBreeds }
        ].filter(item => item.value === true);
        setResource(useProcessedDbData("/walkers", { sync: false },filters=currentfilter))
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
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Sort
            </Typography>
            <Chip
                label="Sort Items"
                clickable
                onClick={() => toggleTag(setSorted)}
                color={sorted ? 'primary' : 'default'}
                sx={{ mt: 2 }}
            />

            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 4 }}>
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
      </Box>
    </Modal>
        </>
    );

}


