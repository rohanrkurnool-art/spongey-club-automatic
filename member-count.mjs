const CLUB = 'spongey-club';
const CHESS_API = `https://api.chess.com/pub/club/${CLUB}/members`;

export default async () => {
  try {
    const response = await fetch(CHESS_API, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SpongeyClubMemberPoster/1.0'
      }
    });

    if (!response.ok) {
      return Response.json({ error: `Chess.com returned ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    const groups = ['weekly', 'monthly', 'all_time'];
    const usernames = new Set();

    for (const group of groups) {
      const members = Array.isArray(data[group]) ? data[group] : [];
      for (const member of members) {
        if (member && typeof member.username === 'string') {
          usernames.add(member.username.toLowerCase());
        }
      }
    }

    if (usernames.size < 1) {
      return Response.json({ error: 'No members returned by Chess.com' }, { status: 502 });
    }

    return Response.json(
      { club: CLUB, count: usernames.size, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } }
    );
  } catch (error) {
    return Response.json({ error: 'Unable to retrieve the live member count' }, { status: 500 });
  }
};
