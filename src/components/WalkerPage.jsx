import { Avatar, Button, Chip, Divider, Paper, Rating, Stack, Typography } from '@mui/material';
import PageTitle from './PageTitle';
import { Link, useParams } from 'react-router-dom';
import { useDbData } from '../firebase';

const CardTitle = ({ children }) => (
  <Typography variant="h5" color="primary" sx={{ mb: 1, ":not(:first-of-type)": { mt: 3 } }}>
    {children}
  </Typography>
)

const WalkerPage = () => {
  const { walkerID } = useParams();
  const [profile, err_profile] = useDbData(`/walkbuddies/users/${walkerID}`);

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
      <div className="LinearLayout" style={{ gap: 10, padding: "0 8px", marginBottom: 30 }}>
        <PageTitle/>
        <Avatar alt={profile.name} src={profile.picture} sx={{ width: 200, height: 200 }}/>
        <Typography variant="h4">
          {profile.name}
        </Typography>
        <Rating value={profile.rating} precision={0.1} readOnly/>
        <span>
          {profile.rating.toFixed(2)} ⭐&nbsp;&nbsp;&nbsp;<Link>{profile.reviews} reviews</Link>
        </span>
        <Paper sx={{ px: 3, py: 3, boxSizing: "border-box", mx: 1, my: 3, overflow: "auto" }} elevation={4}>
          <CardTitle>Description</CardTitle>
          <Typography variant="body" sx={{ whiteSpace: "pre-line" }}>
            {profile.description}
          </Typography>
          <CardTitle>Details</CardTitle>
          <ul style={{ margin: 0, paddingLeft: 30 }}>
            <li>{profile.yearsExperience} years of experience</li>
            <li>
              <Link to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}>
                {profile.location}
              </Link>
            </li>
            <li>${profile.price} / hour</li>
          </ul>
          <CardTitle>Preferences</CardTitle>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {profile.preferences.map((e, i) =>
            <Chip key={i} label={e} color="primary" variant="outlined"/>)}
          </div>
        </Paper>
        <Link to={`tel:${profile.contact}`}>
          <Button variant="contained">Contact</Button>
        </Link>
      </div>
    </>
  );
}

export default WalkerPage;