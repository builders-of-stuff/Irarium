export enum COLLECTION {
  USERS = 'users'
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
