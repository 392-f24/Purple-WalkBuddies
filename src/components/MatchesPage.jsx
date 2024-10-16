import { Button } from '@mui/material';
import PageTitle from './PageTitle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState, useDbData } from '../firebase';
import { useMemo } from 'react';
import { wrapMatch } from '../utils';

const MatchItem = ({ matchPath, id, data, review }) => {
  const navigate = useNavigate();
  const [match, err_match] = useDbData(`/walkers/${matchPath.walker}/matches/${matchPath.index}`);
  return (
    <>
      <Link to={`${id}`}>
        <h3>{JSON.stringify(matchPath)}</h3>
      </Link>
      <p>{new Date(data.time).toString()}</p>
      <p>{new Date(data.endTime).toString()}</p>
      <p>{JSON.stringify(match)}</p>
      {review &&
        <Button variant="contained" onClick={() => navigate(`${id}`)}>Go review</Button>}
    </>
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
      path, id: matchID, data: wrapMatch(matchList[i])
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
      {matchObjects.filter(match => match.data.status === "pending").map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}
      <h2>Ongoing Matches</h2>
      {matchObjects.filter(match => match.data.status === "ongoing").map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}
      <h2>Scheduled Matches</h2>
      {matchObjects.filter(match => match.data.status === "future").map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} />
      )}
      <h2>Past Matches</h2>
      {matchObjects.filter(match => match.data.status === "past").map(
        m => <MatchItem key={m.id} matchPath={m.path} id={m.id} data={m.data} review/>
      )}
    </>
  );
}

export default MatchesPage;