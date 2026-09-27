import { supabase } from '../lib/supabaseClient'

export async function fetchSpotifyStats() {
  const { data, error } = await supabase
    .from('spotify_stats')
    .select('top_artist, top_song, top_tracks, last_synced')
    .eq('id', 1)
    .single()

  if (error) {
    console.error('Failed to fetch spotify stats:', error)
    return null
  }

  return data
}