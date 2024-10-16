import { Avatar, Button, Chip, Paper, Rating, Stack, TextField, Typography, ListItem, ListItemAvatar, ListItemText, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import PageTitle from './PageTitle';
import { Link, useParams } from 'react-router-dom';
import { useAuthState, useDbData, useDbUpdate } from '../firebase';
import { useEffect, useState } from 'react';
import { wrapMatch, getCalendarLink } from '../utils';

const CardTitle = ({ children }) => (
  <Typography variant="h5" color="primary" sx={{ mb: 1, ":not(:first-of-type)": { mt: 3 } }}>
    {children}
  </Typography>
)

const MatchPage = () => {
  const now = new Date;
  const { Guser } = useAuthState();
  const { matchID } = useParams();
  const [matchPath, err_matchPath] = useDbData(Guser?.uid && `/owners/${Guser.uid}/matches/${matchID}`);
  const [match, err_match] = useDbData(matchPath && `/walkers/${matchPath.walker}/matches/${matchPath.index}`, {
    postProcess: m => m && wrapMatch(m, now.getTime())
  });
  const [update, result] = useDbUpdate(matchPath && `/walkers/${matchPath.walker}/matches/${matchPath.index}`);
  const [walker, err_walker] = useDbData(matchPath && `/walkers/${matchPath.walker}`,);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null);

  useEffect(() => {
    if (match) {
      setComment(match.comment || "");
      setRating(match.rating);
    }
  }, [match]);

  if (matchPath === undefined || match === undefined || walker === undefined)
    return <PageTitle/>;
  if (match === null || walker === null) {
    return (
      <>
        <PageTitle/>
        404 Not Found
      </>
    );
  }
  return (
    <>
      <div className="LinearLayout" style={{ gap: 10, padding: "0 8px", marginBottom: 30 }}>
        <PageTitle/>
        {/* <p>{JSON.stringify(matchPath)}</p>
        <p>{JSON.stringify(match)}</p> */}
        <Paper sx={{ p: 3, boxSizing: "border-box", m: 1, overflow: "auto", width: 500 }} elevation={4}>
          <CardTitle>Status</CardTitle>
          <Typography variant="body">
            {{
              pending: "Pending",
              ongoing: "Ongoing",
              future: "Scheduled",
              past: "Ended",
              error: "Error",
            }[match.status]}
          </Typography>
          <CardTitle>Walker</CardTitle>
          <ListItem sx={{ py: 0 }} secondaryAction={
            <Link to={`/walker/${matchPath.walker}`} target="_blank">
              <IconButton edge="end">
                <OpenInNewIcon/>
              </IconButton>
            </Link>
          }>
            <ListItemAvatar>
              <Avatar alt={walker.name} src={walker.picture}/>
            </ListItemAvatar>
            <ListItemText primary={walker.name} secondary={
              <>{walker.rating.toFixed(2)} ⭐&nbsp;&nbsp;<Link>{walker.reviews} reviews</Link></>
            }/>
          </ListItem>
          <CardTitle>Scheduled Time</CardTitle>
          <Stack spacing={2}>
            <Stack spacing={1} alignItems="center" justifyContent="space-between" direction="row">
              <Chip variant="outlined" label={`${new Date(match.time).toTimeString().slice(0, 5)} ${new Date(match.time).toDateString()}`}/>
              <KeyboardDoubleArrowRightIcon/>
              <Chip variant="outlined" label={`${new Date(match.endTime).toTimeString().slice(0, 5)} ${new Date(match.endTime).toDateString()}`}/>
            </Stack>
            <Chip
              icon={
                <img
                  width="22" height="22" alt="Google Calendar Icon"
                  src={`https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${new Date(match.time).getDate()}_2x.png`}
                />
              }
              label="Create Google Calendar event"
              variant="contained"
              color="primary"
              onClick={() => window.open(getCalendarLink(match, matchID, walker))}
            />
          </Stack>
        </Paper>
        {match.accepted === true && now.getTime() > match.time + match.duration * 60 * 1000 &&
          <Paper sx={{ p: 3, boxSizing: "border-box", m: 1, overflow: "auto", width: 500 }} elevation={4}>
            <Stack spacing={2}>
              <CardTitle>Review</CardTitle>
              <Stack spacing={1} direction="row">
                <Typography component="legend">Rate this walk</Typography>
                <Rating value={rating} onChange={(event, newValue) => setRating(newValue)}/>
                {rating === null && <Typography color="lightgrey">(no rating)</Typography>}
              </Stack>
              <TextField
                label="Leave a comment for this walk"
                size="small"
                autoComplete="off"
                type="text"
                variant="outlined"
                value={comment}
                onChange={e => setComment(e.target.value)}
                multiline
                minRows={4}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" onClick={() => {
                  update({
                    rating, comment,
                  });
                }}>Submit</Button>
              </Stack>
            </Stack>
          </Paper>}
      </div>
    </>
  );
}

export default MatchPage;