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
  return res;
}

export const getDistance = async (zip_code1, zip_code2) => {
  const apiUrl = `https://www.zipcodeapi.com/rest/DemoOnly005WAiQLaCFldZDxPzzPDPmrhRa0wgn8E6GTSi64QSy8kt8XTqqsSmln/distance.json/${zip_code1}/${zip_code2}/km`;

  try {
    // Use fetch to get the data from the API
    const response = await fetch(apiUrl);

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the JSON data from the response
    const data = await response.json();

    // Return the JSON data
    return data;
  } catch (error) {
    // Handle and log any errors
    console.error('Error fetching distance data:', error);
    return 1e9;
  }
};

export const filterData = async (rawData, user, filters = [], customSortFn = null) => {
    if (!rawData) return rawData;

    const computeDistance = item => {
      return getDistance(item.location, user.location);
    }

    // Convert Firebase object into an array of entries
    let processedData = await Promise.all(rawData.map(async ([key, item]) => {
      // Convert preferences object to array of values
      const preferences = item.preferences;

      // Add any computed custom attributes here
      const newItem = {
        ...item,
        sort: {
          distance: await computeDistance(item),
          'Dogs': preferences.includes('Dogs'),
          'Cats': preferences.includes('Cats'),
          'Small Pets': preferences.includes('Small Pets'),
          'Big Pets': preferences.includes('Big Pets'),
          'Small Dogs': preferences.includes('Small Dogs'),
          'Big Dogs': preferences.includes('Big Dogs'),
          'Small Cats': preferences.includes('Small Cats'),
          'Big Cats': preferences.includes('Big Cats'),
          'All Breeds': preferences.includes('All Breeds'),
        }
      };
      return [key, newItem];
    }));

    // Apply additional filters (union logic) after fetching data
    if (filters.length > 0) {
      processedData = processedData.filter(item => {
        return filters.every(filter => {
          // Handle custom filtering conditions
          return item[1].sort[filter.key] === filter.value;
        });
      });
    }

    // Sort the data based on the custom attribute
    if (customSortFn) {
      processedData.sort(customSortFn);
    } else {
      // Default sorting by the computed custom attribute
      processedData.sort((a, b) => a.sort.distance - b.sort.distance); // Ascending order
    }

    return processedData;
};