/** Fetches a subject's video playlists (videos.json) and whether it ships SHORT_NOTES.md. */
import { useState, useEffect } from 'react';

export function useSubjectResources(subjectCode: string) {
  const [subjectVideos, setSubjectVideos] = useState<Record<string, string[]>>({});
  const [hasShortNotes, setHasShortNotes] = useState(false);

  useEffect(() => {
    fetch(`/data/Subjects/${subjectCode}/videos.json`)
      .then(res => res.ok ? res.json() : {})
      .then(data => setSubjectVideos(data))
      .catch(() => setSubjectVideos({}));

    fetch(`/data/Subjects/${subjectCode}/SHORT_NOTES.md`, { method: 'HEAD' })
      .then(res => setHasShortNotes(res.ok))
      .catch(() => setHasShortNotes(false));
  }, [subjectCode]);

  // Numbered modules first, then extras like "Interviews" or "Live Session" in file order
  const moduleNumbers = Object.keys(subjectVideos).sort((a, b) => (isNaN(+a) ? Infinity : +a) - (isNaN(+b) ? Infinity : +b));

  return { subjectVideos, moduleNumbers, hasShortNotes };
}
