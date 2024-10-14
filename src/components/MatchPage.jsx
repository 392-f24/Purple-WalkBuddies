import { Avatar, Button, Chip, Divider, Paper, Rating, Stack, TextField, Typography } from '@mui/material';
import PageTitle from './PageTitle';
import { Link, useParams } from 'react-router-dom';
import { useAuthState, useDbData, useDbUpdate } from '../firebase';
import { useEffect, useState } from 'react';

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
  const [match, err_match] = useDbData(matchPath && `/walkers/${matchPath.walker}/matches/${matchPath.index}`);
  const [update, result] = useDbUpdate(matchPath && `/walkers/${matchPath.walker}/matches/${matchPath.index}`);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null);

  useEffect(() => {
    if (match) {
      setComment(match.comment || "");
      setRating(match.rating);
    }
  }, [match]);

  if (matchPath === undefined || match === undefined)
    return <PageTitle/>;
  if (match === null) {
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
        <p>{JSON.stringify(matchPath)}</p>
        <p>{JSON.stringify(match)}</p>
        {now.getTime() > match.time + match.duration * 60 * 1000 &&
          <Paper sx={{ px: 3, py: 3, boxSizing: "border-box", mx: 1, my: 3, overflow: "auto", width: 500 }} elevation={4}>
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