/** One thumbnail card per module playlist. */
import React from 'react';
import { Youtube, Play } from 'lucide-react';

const videoIdOf = (link: string): string | null => {
  const match = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

/** Ad-hoc YouTube playlist: the first video plays, the rest queue up. */
const createPlaylistUrl = (videoLinks: string[]): string => {
  const videoIds = videoLinks.map(videoIdOf).filter(Boolean);
  if (videoIds.length === 0) return '';
  return `http://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;
};

export default function VideoPlaylists({
  subjectVideos,
  moduleNumbers,
}: {
  subjectVideos: Record<string, string[]>;
  /** Keys of `subjectVideos` in display order. */
  moduleNumbers: string[];
}) {
  const cards = moduleNumbers.map((m) => ({ key: m, label: isNaN(+m) ? m : `Module ${m}`, videos: subjectVideos[m] || [] }));
  return (
    <div className="mb-6 bg-surface border border-surface-border/60 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-400" aria-hidden />
          Video Playlists
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {cards.map(({ key, label, videos }) => {
          const playlistUrl = createPlaylistUrl(videos);
          const thumbId = videos.map(videoIdOf).find(Boolean);
          return (
            <a
              key={key}
              href={playlistUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!playlistUrl}
              title={playlistUrl ? `Play ${label} (${videos.length} videos) on YouTube` : 'No videos available'}
              className={`group block min-w-0 rounded-lg overflow-hidden border transition-colors ${
                playlistUrl ? 'border-surface-border hover:border-red-500/50' : 'border-surface-border/40 opacity-50 pointer-events-none'
              }`}
            >
              <div className="relative aspect-video bg-surface-dark">
                {thumbId && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://i.ytimg.com/vi/${thumbId}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex items-center justify-center w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-black/60 group-hover:bg-red-600 transition-colors">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" aria-hidden />
                  </span>
                </div>
              </div>
              <div className="px-1.5 sm:px-2.5 py-1.5 bg-surface-light">
                <div className="text-xs sm:text-sm font-medium text-slate-100 truncate">{label}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{videos.length} videos</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
