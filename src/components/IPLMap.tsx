'use client';

import {useRef } from 'react';
import { MapPin, Trophy } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  homeGround: string;
  latitude: number;
  longitude: number;
  color: string;
  stats: {
    matchesPlayed: number;
    matchesWon: number;
    winPercentage: number;
    titlesWon: number;
  };
}

interface IPLMapProps {
  teams: Team[];
  selectedTeams: string[];
  onTeamSelect: (teamId: string) => void;
}

export default function IPLMap({ teams, selectedTeams, onTeamSelect }: IPLMapProps) {
  

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg overflow-hidden">
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <path
          d="M200 150 L250 120 L300 100 L350 110 L400 130 L450 140 L500 160 L530 180 L550 220 L560 260 L550 300 L530 340 L500 380 L480 420 L460 450 L430 470 L400 480 L370 490 L340 485 L310 480 L280 470 L250 450 L220 430 L200 400 L180 370 L170 340 L160 310 L155 280 L160 250 L170 220 L180 190 L190 170 Z"
          fill="#e6f3ff"
          stroke="#2563eb"
          strokeWidth="2"
          opacity="0.8"
        />
      </svg>

      <div className="absolute inset-0">
        {teams.map((team) => {
          const x = ((team.longitude - 68) / (97 - 68)) * 800;
          const y = ((37 - team.latitude) / (37 - 6)) * 600;
          const isSelected = selectedTeams.includes(team.id);

          return (
            <div
              key={team.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${(x / 800) * 100}%`, top: `${(y / 600) * 100}%` }}
              onClick={() => onTeamSelect(team.id)}
            >
              <div
                className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-125 group-hover:shadow-xl"
                style={{
                  backgroundColor: team.color,
                  border: isSelected ? '3px solid black' : '2px solid white'
                }}
              >
                <span className="text-white text-xs font-bold">
                  {team.shortName.charAt(0)}
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 min-w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
                  <h3 className="font-bold text-gray-900">{team.name}</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{team.city}</span>
                  </div>
                  <div className="text-xs text-gray-500">{team.homeGround}</div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-semibold text-blue-600">
                      {team.stats.matchesWon}/{team.stats.matchesPlayed}
                    </div>
                    <div className="text-gray-500">Wins/Matches</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="font-semibold text-green-600">
                      {team.stats.winPercentage}%
                    </div>
                    <div className="text-gray-500">Win Rate</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded col-span-2">
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-3 w-3 text-yellow-600" />
                      <span className="font-semibold text-yellow-600">
                        {team.stats.titlesWon} Titles
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
              </div>

              {isSelected && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{ backgroundColor: team.color }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-xs">
        <h4 className="font-semibold text-gray-800 mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">Team Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-3 w-3 text-yellow-500" />
            <span className="text-gray-600">Title Winners</span>
          </div>
        </div>
      </div>

      {/* Top Right Stats Summary */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-xs text-gray-600">
        <div className="font-semibold text-gray-800 mb-1">Quick Stats</div>
        <div>Teams Selected: {selectedTeams.length}</div>
        <div>
          Total Titles:{' '}
          {teams
            .filter(team => selectedTeams.includes(team.id))
            .reduce((sum, team) => sum + team.stats.titlesWon, 0)}
        </div>
      </div>
    </div>
  );
}
