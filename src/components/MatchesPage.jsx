import { Avatar, Button, Chip, Divider, Paper, Rating, Stack, Typography } from '@mui/material';
import PageTitle from './PageTitle';
import { Link, useParams } from 'react-router-dom';
import { useAuthState, useDbData, useDbUpdate } from '../firebase';

const MatchItem = ({ matchPath, index }) => {
  const [match, err_match] = useDbData(`/walkers/${matchPath.walker}/matches/${matchPath.index}`);
  return (
    <Link to={`${index}`}>
      <h3>{JSON.stringify(matchPath)}</h3>
      <p>{JSON.stringify(match)}</p>
    </Link>
  );
}

const MatchesPage = () => {
  const { Guser } = useAuthState();
  const [matches, err_matches] = useDbData(Guser?.uid && `/owners/${Guser.uid}/matches`);

  if (matches === undefined)
    return <PageTitle/>;
  if (matches === null) {
    return (
      <>
        <PageTitle/>
        No matches so far.
      </>
    );
  }
  return (
    <>
      <PageTitle/>
      {Object.entries(matches).map(([idx, e]) =>
        <MatchItem key={e.index} matchPath={e} index={idx}/>
      )}
    </>
  );
}

export default MatchesPage;