import { TextField, Box, Modal, Avatar, Button, Chip, Divider, Paper, Rating, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PageTitle from './PageTitle';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDbData, useAuthState, useDbUpdate } from '../firebase';
import { useState } from 'react';
import DurationParser from 'js-duration-parser';
import { wrapProfile } from '../utils';

const durationParser = new DurationParser();

const CardTitle = ({ children }) => (
  <Typography variant="h5" color="primary" sx={{ mb: 1, ":not(:first-of-type)": { mt: 3 } }}>
    {children}
  </Typography>
)

const WalkerPage = () => {
  const navigate = useNavigate()
  const { walkerID } = useParams();
  const { Guser } = useAuthState();
  const [profile, err_profile] = useDbData(`/walkers/${walkerID}`, { postProcess: wrapProfile });
  const [update_walker, result_walker] = useDbUpdate(`/walkers/${walkerID}/matches`);
  const [update_owner, result_owner] = useDbUpdate(`/owners/${Guser?.uid}/matches`);

  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [startTime, setStartTime] = useState(new Date().toTimeString().slice(0, 5));
  const [duration, setDuration] = useState("");
  const parsedDuration = durationParser.parse(duration);

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
          {profile.rating ? `${profile.rating.toFixed(2)} ⭐` : 'No ratings'}
          &nbsp;&nbsp;&nbsp;<Link to={`/walker/${walkerID}/reviews`}>{profile.reviews} reviews</Link>
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
              <Link to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`} target="_blank">
                {profile.location}
              </Link>
            </li>
            <li>${profile.price} / hour</li>
          </ul>
          <CardTitle>Preferences</CardTitle>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(profile.preferences || []).map((e, i) =>
            <Chip key={i} label={e} color="primary" variant="outlined"/>)}
          </div>
          <CardTitle>Availability</CardTitle>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th></th>
                <th style={{ width: '40px' }}>Sun</th>
                <th style={{ width: '40px' }}>Mon</th>
                <th style={{ width: '40px' }}>Tue</th>
                <th style={{ width: '40px' }}>Wed</th>
                <th style={{ width: '40px' }}>Thu</th>
                <th style={{ width: '40px' }}>Fri</th>
                <th style={{ width: '40px' }}>Sat</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map(i =>
                <tr key={i}>
                  <td style={{ height: '28px' }}>{["Morning", "Afternoon", "Night"][i]}</td>
                  {profile.availability.map((e, idx) =>
                    <td key={idx} style={{ textAlign: "center" }}>{e[i] ? <CheckIcon color="success"/> : ""}</td>)}
                </tr>
              )}
            </tbody>
          </table>
        </Paper>
        <Stack direction="row" spacing={2}>
          <Link to={`tel:${profile.contact}`}>
            <Button variant="contained">Contact</Button>
          </Link>
          <Button variant="contained" onClick={() => setModalOpen(true)}>Match Request</Button>
        </Stack>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Stack spacing={2}>
            <Typography variant="h6" component="h2">
              Please enter the match time
            </Typography>
            <Stack direction="row">
              <TextField
                label="Date"
                size="small"
                sx={{ width: '50%', pr: 0.5 }}
                autoComplete="off"
                type="date"
                variant="outlined"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <TextField
                label="Time"
                size="small"
                sx={{ width: '50%', pl: 0.5 }}
                autoComplete="off"
                type="time"
                variant="outlined"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </Stack>
            <TextField
              label="Duration (?d ?h ?m)"
              error={!parsedDuration}
              helperText={!parsedDuration ? "Please enter a valid date" : `= ${parseInt(parsedDuration)} minutes`}
              placeholder="_d _h _m"
              size="small"
              autoComplete="off"
              type="text"
              variant="outlined"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
            <Button variant="contained" disabled={!parsedDuration} onClick={() => {
              if (window.confirm("Be sure to contact the pet walker while you request a match.\n\nDo you want to send the request?")) {
                const reference = update_walker({
                  time: new Date(startDate + " " + startTime).getTime(), duration: parsedDuration
                }, { push: true });
                const index = update_owner({
                  index: reference.key, walker: walkerID
                }, { push: true });
                navigate(`/matches/${index.key}`);
              }
            }}>Match</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default WalkerPage;