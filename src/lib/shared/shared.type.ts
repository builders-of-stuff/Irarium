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

export type Irarium = {
  id: string;
  userId: string;
  created: string;
  updated: string;

  title: string;
  description: string;
  tags: string;
  content: string;
  children: Irarium[];
};
