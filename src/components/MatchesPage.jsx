import { Avatar, Button, Chip, Divider, Paper, Rating, Stack, Typography } from '@mui/material';
import PageTitle from './PageTitle';
import { Link, useParams } from 'react-router-dom';
import { useAuthState, useDbData, useDbUpdate } from '../firebase';
import { useMemo } from 'react';

const MatchItem = ({ matchPath, id, data }) => {
  const [match, err_match] = useDbData(`/walkers/${matchPath.walker}/matches/${matchPath.index}`);
  return (
    <Link to={`${id}`}>
      <h3>{JSON.stringify(matchPath)}</h3>
      <p>{new Date(data.time).toString()}</p>
      <p>{new Date(data.endTime).toString()}</p>
      <p>{JSON.stringify(match)}</p>
    </Link>
  );
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
      path, id: matchID, data: {
        ...matchList[i], endTime: matchList[i].time + matchList[i].duration * 60 * 1000
      }
    } : null)
  ).filter(e => e), [matches, matchList]);

  if (matchObjects === undefined)
    return <PageTitle/>;
  if (matchObjects === null) {
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
      <h2>Pending Requests</h2>
      {matchObjects.filter(match => match.data.accepted !== true).map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}
      <h2>Ongoing Matches</h2>
      {matchObjects.filter(
        match => match.data.accepted && match.data.time <= now && now <= match.data.endTime
      ).map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}
      <h2>Scheduled Matches</h2>
      {matchObjects.filter(
        match => match.data.accepted && now < match.data.time
      ).map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}
      <h2>Past Matches</h2>
      {matchObjects.filter(
        match => match.data.accepted && match.data.endTime < now
      ).map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}
    </>
  );
}

export default MatchesPage;