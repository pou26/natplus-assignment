import { useState, useEffect } from 'react';
import { supabase } from '../components/lib/supabase';
import { Team } from '../components/types/team';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          team_stats (*)
        `)
        .eq('is_active', true);

      if (teamsError) throw teamsError;

      // Transform and store
      const formattedTeams: Team[] = teamsData?.map(team => ({
        id: team.id,
        name: team.name,
        shortName: team.short_name,
        city: team.city,
        homeGround: team.home_ground,
        latitude: team.latitude,
        longitude: team.longitude,
        foundedYear: team.founded_year,
        color: team.color,
        isActive: team.is_active,
        stats: {
          matchesPlayed: team.team_stats?.[0]?.matches_played || 0,
          matchesWon: team.team_stats?.[0]?.matches_won || 0,
          matchesLost: team.team_stats?.[0]?.matches_lost || 0,
          winPercentage: team.team_stats?.[0]?.win_percentage || 0,
          titlesWon: team.team_stats?.[0]?.titles_won || 0,
          playoffAppearances: team.team_stats?.[0]?.playoff_appearances || 0,
          highestScore: team.team_stats?.[0]?.highest_score || 0,
          lowestScore: team.team_stats?.[0]?.lowest_score || 0,
        }
      })) || [];

      setTeams(formattedTeams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { teams, loading, error, refetch: fetchTeams };
}
