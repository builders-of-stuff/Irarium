export enum COLLECTION {
  SUPERUSERS = '_superusers',
  USERS = 'users',
  USER_SETTINGS = 'userSettings',
  IRARIUMS = 'irariums',
  PAYMENTS = 'payments'
}

export type User = {
  id: string;
  name: string;
  bio: string;
  username: string;
  displayName: string;
  created: string;
  updated: string;
  verified: boolean;
  emailVisibility: boolean;
  subscriptionType: string;
  isPremium: boolean; // Whether the user has made a one-time payment
  premiumSince: string | null; // When the user became premium
};

// write access for superusers only
export type UserSettings = {
  id: string;
  userId: string;
  isFullyUpgraded: boolean;
};

// write access for superusers only
export type Payment = {
  id: string;
  created: string;
  updated: string;
  userId: string;
  stripeEventId: string;
  paymentIntent: string;
  amountTotal: number;
  currency: string;
  status: string;
};

export type Idea = {
  // not necessarily unique, just for reference purposes
  id: string;
  parentId?: string;
  // position relative to irarium root
  content: string;
  children: Idea[];
  depth: number;
  created: string;
  updated: string;
};

/**
  * e.g. {
    "id": "idea_root_id",
    "title": "Main Idea",
    "content": "Description of main idea",
    "children": [
      {
        "id": "child_idea_1",
        "content": "Description of child idea 1",
        "depth": 1,
        "children": [
          {
            "id": "grandchild_1",
            "content": "Description of grandchild idea 1",
            "depth": 2,
            "children": []
          },
          {
            "id": "grandchild_2",
            "content": "Description of grandchild idea 2",
            "depth": 2,
            "children": [
              {
                "id": "great_grandchild_1",
                "content": "Description of great grandchild idea 1",
                "depth": 3,
                "children": []
              }
            ]
          }
        ]
      },
      {
        "id": "child_idea_2",
        "content": "Description of child idea 2",
        "depth": 1,
        "children": []
      }
    ]
  }
*/
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
  isPublic: boolean;
};
