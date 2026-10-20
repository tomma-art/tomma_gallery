import { useState, useEffect } from 'react';

interface Track {
  name: string;
  artist: string;
  albumArt: string;
  url: string;
}

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch('/api/now-playing');
        const data = await res.json();
        const recent = data?.recenttracks?.track?.[0];
        if (recent?.['@attr']?.nowplaying === 'true') {
          setTrack({
            name: recent.name,
            artist: recent.artist?.['#text'] || '',
            albumArt: recent.image?.find((i: any) => i.size === 'small')?.['#text'] || '',
            url: recent.url,
          });
        } else {
          setTrack(null);
        }
      } catch {}
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!track) {
    return (
      <div class="flex items-center gap-2 ml-4 px-3 border border-emerald-900/10 opacity-30 h-8 md:h-10">
      <div class="flex flex-col leading-tight min-w-0">
        <span class="font-mono text-[9px] text-white/30 uppercase tracking-wider">idle</span>
        <span class="font-mono text-[10px] text-white/20 truncate max-w-[180px]">---</span>
      </div>
      </div>
    );
  }

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-2 ml-4 px-3 border border-emerald-900/30 hover:border-emerald-900/60 transition-colors h-8 md:h-10"
    >
      {track.albumArt && (
        <img src={track.albumArt} alt="" class="w-5 h-5 object-cover rounded" />
      )}
      <div class="flex flex-col leading-tight min-w-0">
        <span class="flex items-center gap-1.5 font-mono text-[9px] text-white/30 uppercase tracking-wider">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          spotify
        </span>
        <span class="font-mono text-[10px] text-white/70 truncate max-w-[180px]">
          {track.name} — {track.artist}
        </span>
      </div>
    </a>
  );
}