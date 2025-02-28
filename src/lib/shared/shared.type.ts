export enum COLLECTION {
  USERS = 'users',
  IRARIUMS = 'irariums'
}

export type User = {
  id: string;
  name: string;
  created: string;
  updated: string;
  verified: boolean;
  emailVisibility: boolean;
  subscriptionType: string;
};

export type Idea = {
  // not necessarily unique, just for reference purposes
  id: string;
  // position relative to irarium (e.g. 1a, 1b, 2b, 3d, 1aa, 1ab...)
  position: string;
  created: string;
  updated: string;
  content: string;
  children: Idea[];
};

// Irarium is essentially a collection of loosely-linked ideas
export type Irarium = {
  id: string;
  userId: string;
  created: string;
  updated: string;
  title: string;
  description: string;
  tags: string;
  content: string;
  children: Idea[];
};
