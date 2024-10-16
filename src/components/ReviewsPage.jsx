import { List, ListItem, ListItemAvatar, TextField, Box, Modal, Avatar, Button, Chip, Divider, Paper, Rating, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PageTitle from './PageTitle';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDbData, useAuthState, useDbUpdate } from '../firebase';
import { Fragment, useState } from 'react';
import DurationParser from 'js-duration-parser';
import { wrapMatch, wrapProfile } from '../utils';

const durationParser = new DurationParser();

const CardTitle = ({ children }) => (
  <Typography variant="h5" color="primary" sx={{ mb: 1, ":not(:first-of-type)": { mt: 3 } }}>
    {children}
  </Typography>
)

const WalkerPage = () => {
  const now = new Date().getTime();
  const { walkerID } = useParams();
  const [profile, err_profile] = useDbData(`/walkers/${walkerID}`, {
    postProcess: wrapProfile
  });

  console.log(profile?.matches);

  if (profile === undefined)
    return <PageTitle/>;
  if (profile === null) {
    return (
      <>
        <PageTitle/>
        404 Not Found
      </>
    );
  }
  return (
    <>
      <div className="LinearLayout" style={{ gap: 10, padding: "0 8px", marginBottom: 30, width: '100%' }}>
        <PageTitle/>
        <Stack direction="row" spacing={4} sx={{ mt: 3 }}>
          <Avatar alt={profile.name} src={profile.picture} sx={{ width: 100, height: 100 }}/>
          <Stack spacing={1}>
            <Typography variant="h4">
              {profile.name}
            </Typography>
            <Stack direction="row" alignItems="center">
              <span>{profile.rating ? profile.rating.toFixed(2) : "No ratings"}&nbsp;&nbsp;</span>
              <Rating value={profile.rating} precision={0.1} readOnly/>
            </Stack>
            <span>{profile.reviews} reviews</span>
          </Stack>
        </Stack>
        <List sx={{ width: 500 }}>
          {Object.entries(profile.matches || {}).map(([matchID, match]) => [matchID, wrapMatch(match)]).map(([matchID, match]) =>
            match.status === "past" && (match.comment?.length || match.rating)
            ? <Fragment key={matchID}>
                <Divider component="li" sx={{ my: 2 }}/>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar/>
                  </ListItemAvatar>
                  <Stack spacing={1}>
                    <span>{
                      durationParser.compose((now - new Date(match.endTime).getTime()) / 1000 / 60 / 60 / 24, 'd').split(' ', 1)[0]
                    } ago</span>
                    <Stack spacing={1} direction="row">
                      <Rating value={match.rating} readOnly disabled={!match.rating} size="small" sx={{ transform: 'translateX(-3px)' }}/>
                      {!match.rating && <Typography color="lightgrey" variant="caption">(no rating)</Typography>}
                    </Stack>
                    <Typography component="span" variant="body2">
                      {match.comment}
                    </Typography>
                  </Stack>
                </ListItem>
              </Fragment>
            : null
          )}
        </List>
      </div>
    </>
  );
}

export default WalkerPage;