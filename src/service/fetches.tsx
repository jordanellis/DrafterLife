import { Players } from "../components/league/types";
import "regenerator-runtime/runtime";

/**
 * Retrieves the current week number
 */
export const fetchCurrentWeek = async () => {
  const response = await fetch('/api/league/currentWeek');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.weekNumber;
};

/**
 * Retrieves the list of posts
 */
export const fetchPosts = async () => {
  const response = await fetch('/api/posts');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.posts;
};

/**
 * Retrieves the list of all player statistics
 */
export const fetchPlayers = async () => {
  const response = await fetch('/api/player-stats');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.data;
};

/**
 * Retrieves a player's statistics
 */
export const fetchPlayerStats = async (player: String) => {
  const response = await fetch('/api/player-stats/' + player);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body.data;
};

/**
 * Retrieves the team of OWL player
 */
export const fetchPlayerTeam = async (player: String) => {
  const response = await fetch('/api/player-stats/team/' + player);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body.data;
};

/**
 * Retrieves the weeks of the OWL schedule
 */
export const fetchWeeks = async () => {
  const response = await fetch('/api/games/weeks');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body.data;
}

/**
 * Retrieves the list of all player statistics on a single roster
 * @param {Players} playerList
 */
export const fetchRosterStats = async (p: Players) => {
  const players = p.tanks.concat(p.dps, p.supports, p.flex, p.bench);
  const response = await fetch('/api/player-stats', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({players})
  });
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.data;
};

/**
 * Retrieves the list of all OWL Team objects
 */
export const fetchTeams = async () => {
  const response = await fetch('/api/teams');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.data;
};

/**
 * Retrieves the list of all Fantasy League Team objects
 */
export const fetchLeagueTeams = async () => {
  const response = await fetch('/api/league/teams');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.data;
};

/**
 * Retrieves a single Fantasy League Team object
 * @param {string} ownerName
 */
export const fetchRoster = async (ownerName: string) => {
  const response = await fetch('/api/league/team/'+ownerName);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.team;
};

/**
 * Retrieves a single Fantasy League Team object from a specific week
 * @param {string} ownerName
 * @param {number} weekNumber
 */
export const fetchRosterHistoric = async (ownerName: string, weekNumber: number) => {
  const response = await fetch('/api/league/team/historic/' + ownerName + '?' + new URLSearchParams([
    ['weekNumber', weekNumber.toString()]
  ]));
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.team;
};

/**
 * Retrieves the Fantasy League schedule
 */
export const fetchSchedule = async () => {
  const response = await fetch('/api/league/schedule');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body.data;
};

/**
 * Pickup a free agent and drop a player from League team
 */
export const fetchPickup = async (sessionUser: string, playerToAdd: string, playerToDrop: string) => {
  return await fetch('/api/league/pickup', {
    method: 'PUT',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({
      owner: sessionUser,
      playerToAdd,
      playerToDrop
    })
  });
}

/**
 * Swap player roles on a League team
 */
export const fetchSwap = async (sessionUser: string, playersToSwap: { name: string; newRole: string; }[]) => {
  return await fetch('/api/league/swap', {
    method: 'PUT',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({
      owner: sessionUser,
      playersToSwap
    })
  });
}
