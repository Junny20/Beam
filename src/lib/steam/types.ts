export interface SteamFriend {
  steamid: string;
  relationship: "friend";
  friend_since: number;
}

export interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  avatar: string;
  avatarfull: string;
  communityvisibilitystate: number;
  personastate: number;
  lastlogoff?: number;
  timecreated?: number;
  loccountrycode?: string;
}