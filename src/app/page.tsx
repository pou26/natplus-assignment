// app/page.tsx with Supabase integration
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { MapPin, Trophy, Users, TrendingUp, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTeams } from '../hooks/useTeams';
import LoadingSpinner from '../components/loadingSpinner';
import ErrorBoundary from '../components/Errorboundary';

const IPLMap = dynamic(() => import('../components/IPLMap'), { ssr: false });

export default function IPLDashboard() {
  const { teams, loading, error } = useTeams();
  const [selectedTeams, setSelectedTeams] = useState<string[]>(['csk', 'mi']);

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const selectedTeamsData = teams.filter(team => selectedTeams.includes(team.id));

  const getComparisonStats = () => {
    if (selectedTeamsData.length === 0) return null;
    
const totalMatches = selectedTeamsData.reduce((sum, team) => sum + team.stats.matchesPlayed, 0);
const totalWins = selectedTeamsData.reduce((sum, team) => sum + team.stats.matchesWon, 0);
const totalTitles = selectedTeamsData.reduce((sum, team) => sum + team.stats.titlesWon, 0);

    
    return {
      totalMatches,
      totalWins,
      totalTitles,
      avgWinRate: totalMatches > 0 ? (totalWins / totalMatches * 100).toFixed(1) : '0'
    };
  };

  const comparisonStats = getComparisonStats();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">Loading IPL teams data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardContent className="flex flex-col items-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">IPL Insights Dashboard</h1>
                  <p className="text-sm text-gray-600">Explore and compare IPL team statistics</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {teams.length} Teams Available
              </Badge>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Map Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Comparison Stats */}
              {comparisonStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span>Selected Teams Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {comparisonStats.totalMatches}
                        </div>
                        <div className="text-sm text-gray-600">Total Matches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {comparisonStats.totalWins}
                        </div>
                        <div className="text-sm text-gray-600">Total Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {comparisonStats.totalTitles}
                        </div>
                        <div className="text-sm text-gray-600">Total Titles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {comparisonStats.avgWinRate}%
                        </div>
                        <div className="text-sm text-gray-600">Combined Win Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Map Component */}
              <Card className="h-96 md:h-[500px]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <span>IPL Teams Map</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full p-0">
                  <IPLMap 
                    teams={teams} 
                    selectedTeams={selectedTeams}
                    onTeamSelect={handleTeamToggle}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-600">Select Teams</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teams.map((team) => (
                    <div key={team.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={team.id}
                        checked={selectedTeams.includes(team.id)}
                        onCheckedChange={() => handleTeamToggle(team.id)}
                      />
                      <label
                        htmlFor={team.id}
                        className="flex items-center space-x-2 cursor-pointer flex-1"
                      >
                        <div 
                          className="w-4 h-4 rounded-full border-2"
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="text-sm font-medium"
                        style={{ color: team.color }}>{team.name}</span>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Selected Teams Details */}
              {selectedTeamsData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-600">Team Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTeamsData.map((team) => (
                      <div key={team.id} className="p-3 bg-gray-50 rounded-lg " style={{ color: team.color }}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: team.color }}
                          />
                          <span className="font-medium text-sm">{team.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-600">Matches</div>
                            <div className="font-semibold">{team.stats.matchesPlayed}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Wins</div>
                            <div className="font-semibold">{team.stats.matchesWon}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Win Rate</div>
                            <div className="font-semibold">
                              {team.stats.matchesPlayed > 0 
                                ? ((team.stats.matchesWon / team.stats.matchesPlayed) * 100).toFixed(1)
                                : '0'
                              }%
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Titles</div>
                            <div className="font-semibold">{team.stats.titlesWon}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle  className="text-yellow-600">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    onClick={() => setSelectedTeams(teams.map(t => t.id))}
                    className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Select All Teams
                  </button>
                  <button
                    onClick={() => setSelectedTeams([])}
                    className="w-full px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={() => setSelectedTeams(['csk', 'mi'])}
                    className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Compare Top Teams
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}