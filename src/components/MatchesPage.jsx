// import { Button } from '@mui/material';
// import PageTitle from './PageTitle';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthState, useDbData } from '../firebase';
// import { useMemo } from 'react';
// import { wrapMatch } from '../utils';

// const MatchItem = ({ matchPath, id, data, review }) => {
//   const navigate = useNavigate();
//   const [match, err_match] = useDbData(`/walkers/${matchPath.walker}/matches/${matchPath.index}`);
//   return (
//     <>
//       <Link to={`${id}`}>
//         <h3>{JSON.stringify(matchPath)}</h3>
//       </Link>
//       <p>{new Date(data.time).toString()}</p>
//       <p>{new Date(data.endTime).toString()}</p>
//       <p>{JSON.stringify(match)}</p>
//       {review &&
//         <Button variant="contained" onClick={() => navigate(`${id}`)}>Go review</Button>}
//     </>
//   );
// }

// const MatchesPage = () => {
//   const now = new Date().getTime();
//   const { Guser } = useAuthState();
//   const [matches, err_matches] = useDbData(Guser?.uid && `/owners/${Guser.uid}/matches`);
//   const matchPaths = useMemo(() => matches && Object.values(matches).map(
//     ({ walker, index }) => `/walkers/${walker}/matches/${index}`
//   ), [matches]);
//   const [matchList, err_matchList] = useDbData(matches && matchPaths);
//   const matchObjects = useMemo(() => matchList && Object.entries(matches).map(
//     ([matchID, path], i) => (matchList[i] ? {
//       path, id: matchID, data: wrapMatch(matchList[i])
//     } : null)
//   ).filter(e => e), [matches, matchList]);

//   if (matchObjects === undefined)
//     return <PageTitle/>;
//   if (matchObjects === null) {
//     return (
//       <>
//         <PageTitle/>
//         No matches so far.
//       </>
//     );
//   }
//   return (
//     <>
//       <PageTitle/>
//       <h2>Pending Requests</h2>
//       {matchObjects.filter(match => match.data.status === "pending").map(
//         m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
//       )}
//       <h2>Ongoing Matches</h2>
//       {matchObjects.filter(match => match.data.status === "ongoing").map(
//         m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
//       )}
//       <h2>Scheduled Matches</h2>
//       {matchObjects.filter(match => match.data.status === "future").map(
//         m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
//       )}
//       <h2>Past Matches</h2>
//       {matchObjects.filter(match => match.data.status === "past").map(
//         m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} review/>
//       )}
//     </>
//   );
// }

// export default MatchesPage;

import { Avatar, Button, Typography, Paper, Box, ListItemAvatar, ListItemText, IconButton } from '@mui/material';
import PageTitle from './PageTitle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState, useDbData } from '../firebase';
import { useMemo } from 'react';
import { wrapMatch, wrapProfile} from '../utils';

const MatchItem = ({ matchPath, id, data, review }) => {
  const navigate = useNavigate();
  const [match, err_match] = useDbData(`/walkers/${matchPath.walker}/matches/${matchPath.index}`);
  const [walker, err_walker] = useDbData(matchPath && `/walkers/${matchPath.walker}`, { postProcess: wrapProfile });

  return (
    <Paper sx={{ px: 1, py: 1, mx: 1, my: 3, marginTop: '10px',
        paddingTop: '10px',
        marginLeft: '10px',
        marginRight: '10px', 
        textAlign: 'center' }} elevation={4}>
      <Link to={`${id}`}>
        <Typography variant="h6" style={{ fontSize: '25px', color: '#907AA8' }}>
          {matchPath.walker}
        </Typography>
      </Link>
      <Typography variant="body1" sx={{ fontWeight: 'bold', marginLeft: '20px', textAlign: 'left' }}>
        Requested time:
      </Typography>
      <Typography variant="body1" sx={{ marginLeft: '20px', textAlign: 'left' }}>
        {formatMatchTime(data.time, data.endTime)}
      </Typography>

      {review && (
        <Button variant="contained" onClick={() => navigate(`${id}`)} sx={{ mt: 2 }}>
          Go review
        </Button>
      )}
    </Paper>
  );
};

const formatMatchTime = (startTime, endTime) => {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  
  // Format: October 15 13:36
  const formattedDate = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const formattedStartTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formattedEndTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
}

const MatchesPage = () => {
  const now = new Date().getTime();
  const { Guser } = useAuthState();
  const [matches, err_matches] = useDbData(Guser?.uid && `/owners/${Guser.uid}/matches`);
  const matchPaths = useMemo(() => matches && Object.values(matches).map(
    ({ walker, index }) => `/walkers/${walker}/matches/${index}`
  ), [matches]);
  const [matchList, err_matchList] = useDbData(matches && matchPaths);
  const matchObjects = useMemo(() => matchList && Object.entries(matches).map(
    ([matchID, path], i) => (matchList[i] ? {
      path, id: matchID, data: wrapMatch(matchList[i])
    } : null)
  ).filter(e => e), [matches, matchList]);

  if (matchObjects === undefined) return <PageTitle />;
  if (matchObjects === null) {
    return (
      <>
        <PageTitle />
        <Typography variant="h6" align="center">No matches so far.</Typography>
      </>
    );
  }

  return (
    <Box sx={{ textAlign: 'left', paddingTop: '20px', marginLeft: '20px', marginRight: '20px'}}>
      <PageTitle />

      <Typography variant="h5" style={{ fontWeight: 'bold', color: '#907AA8' }} gutterBottom>
        Pending Requests
      </Typography>
      {matchObjects.filter(match => match.data.status === "pending").map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}

      <Typography variant="h5" style={{ fontWeight: 'bold', color: '#907AA8' }} gutterBottom>
        Ongoing Matches
      </Typography>
      {matchObjects.filter(match => match.data.status === "ongoing").map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}

      <Typography variant="h5" style={{ fontWeight: 'bold', color: '#907AA8' }} gutterBottom>
        Scheduled Matches
      </Typography>
      {matchObjects.filter(match => match.data.status === "future").map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}

      <Typography variant="h5" style={{ fontWeight: 'bold', color: '#907AA8' }} gutterBottom>
        Past Matches
      </Typography>
      {matchObjects.filter(match => match.data.status === "past").map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} review />
      )}
    </Box>
  );
};

export default MatchesPage;
