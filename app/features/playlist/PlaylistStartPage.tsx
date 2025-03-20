import { useParams } from 'react-router';

import { playlistSrv } from './PlaylistSrv';

// This is a react page that just redirects to new URLs
export default function PlaylistStartPage() {
  const { uid = '' } = useParams();
  playlistSrv.start(uid);
  return null;
}
