const CLUB = "spongey-club";
const CHESS_API = `https://api.chess.com/pub/club/${CLUB}`;

export default async () => {
  try {
    const response = await fetch(CHESS_API, {
      headers: {
        Accept: "application/json",
        "User-Agent": "SpongeyClubMemberPoster/1.0 contact@example.com"
      }
    });

    if (!response.ok) {
      return Response.json(
        {
          error: `Chess.com returned ${response.status}`,
          requestedUrl: CHESS_API
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const count = Number(data.members_count);

    if (!Number.isFinite(count)) {
      return Response.json(
        { error: "Chess.com did not return a valid member count" },
        { status: 502 }
      );
    }

    return Response.json(
      {
        club: CLUB,
        count,
        updatedAt: new Date().toISOString()
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300"
        }
      }
    );
  } catch (error) {
    return Response.json(
      {
        error: "Unable to retrieve the live member count",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
};
