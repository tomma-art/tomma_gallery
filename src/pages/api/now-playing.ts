export async function GET() {
  try {
    const res = await fetch(
      'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=tomma_artist&api_key=7df383b8b7df193149e57ef7ed8fcc34&format=json&limit=1'
    );
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: true }), { status: 500 });
  }
}