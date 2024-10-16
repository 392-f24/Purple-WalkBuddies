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

export function getCalendarLink(match, matchID, walker) {
  const params = new URLSearchParams;
  params.append("action", "TEMPLATE");
  params.append("text", `Walk Buddies match with ${walker.name}`);
  params.append("dates", `${
    new Date(match.time).toISOString().replace(/[-:]/g, "").split('.', 1)[0]
  }/${
    new Date(match.endTime).toISOString().replace(/[-:]/g, "").split('.', 1)[0]
  }`);
  params.append("ctz", "UTC");
  const link = `${window.location.origin}/matches/${matchID}`;
  params.append("details", `<h3>Walk Buddies</h3><a href="${link}">${link}</a>`);
  // params.append("add", Object.keys(meet.collection).join(","));
  return "https://www.google.com/calendar/render?" + params;
}

export function wrapProfile(p) {
  if (!p) return p;
  if (!p.matches) return { ...p, reviews: 0, rating: null };
  const res = { ...p };
  res.reviews = Object.values(p.matches).filter(m => getMatchStatus(m) === "past" && (m.comment?.length || m.rating)).length;
  const all_ratings = Object.values(p.matches).map(m => m?.rating).filter(m => m);
  res.rating = all_ratings.reduce((a, c) => a + c, 0) / all_ratings.length;
  console.log(res);
  return res;
}