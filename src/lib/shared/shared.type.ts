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
  // position relative to irarium root
  content: string;
  children: Idea[];
  depth: number;
  created: string;
  updated: string;
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
