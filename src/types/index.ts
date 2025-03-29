export interface Tweet {
  id: string;
  type: string;
  text: string;
  sign?: string;
  home?: string;
  icon?: string;
  username: string;
  timestamp: number;
  replies?: Tweet[];
}

export interface Space {
  id: string;
  name: string;
  description: string;
  url: string;
  members: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  homeSpace: string;
} 