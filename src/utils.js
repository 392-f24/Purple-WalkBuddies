export function getMatchStatus(match, now) {
  now = now || new Date().getTime();
  const endTime = match.time + match.duration * 60 * 1000;
  try {
    if (match.accepted !== true)
      return "pending";
    if (match.accepted && match.time <= now && now <= endTime)
      return "ongoing";
    if (match.accepted && now < match.time)
      return "future";
    if (match.accepted && endTime < now)
      return "past";
  } catch(e) {
    console.error(e);
    return "error";
  }
}

export function wrapMatch(match, now) {
  return {
    ...match,
    status:getMatchStatus(match, now),
    endTime: match.time + match.duration * 60 * 1000
  };
}