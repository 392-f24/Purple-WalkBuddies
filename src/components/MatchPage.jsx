import { Avatar, Button, Chip, Divider, Paper, Rating, Stack, Typography } from '@mui/material';
import PageTitle from './PageTitle';
import { Link, useParams } from 'react-router-dom';
import { useAuthState, useDbData, useDbUpdate } from '../firebase';

const CardTitle = ({ children }) => (
  <Typography variant="h5" color="primary" sx={{ mb: 1, ":not(:first-of-type)": { mt: 3 } }}>
    {children}
  </Typography>
)

const MatchPage = () => {
  const { Guser } = useAuthState();
  const { matchID } = useParams();
  const [matchPath, err_matchPath] = useDbData(Guser?.uid && `/owners/${Guser.uid}/matches/${matchID}`);
  const [match, err_match] = useDbData(matchPath && `/walkers/${matchPath.walker}/matches/${matchPath.index}`, { sync: false });
  const [update, result] = useDbUpdate(matchPath && `/walkers/${matchPath.walker}/matches/${matchPath.index}`);

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
      <PageTitle/>
      {JSON.stringify(match)}
    </>
  );
}

export default MatchPage;