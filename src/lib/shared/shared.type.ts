export enum COLLECTION {
  SUPERUSERS = '_superusers',
  USERS = 'users',
  USER_SETTINGS = 'userSettings',
  IRARIUMS = 'irariums',
  PAYMENTS = 'payments',
  SPACES = 'spaces'
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

export type Thought = {
  // not necessarily unique, just for reference purposes
  id: string;
  parentId?: string;
  // position relative to irarium root
  content: string;
  children: Thought[];
  depth: number;
  isExpanded?: boolean;
  created: string;
  updated: string;
};

/**
  * e.g. {
    "id": "thought_root_id",
    "title": "Main Thought",
    "content": "Description of main thought",
    "children": [
      {
        "id": "child_thought_1",
        "content": "Description of child thought 1",
        "depth": 1,
        "children": [
          {
            "id": "grandchild_1",
            "content": "Description of grandchild thought 1",
            "depth": 2,
            "children": []
          },
          {
            "id": "grandchild_2",
            "content": "Description of grandchild thought 2",
            "depth": 2,
            "children": [
              {
                "id": "great_grandchild_1",
                "content": "Description of great grandchild thought 1",
                "depth": 3,
                "children": []
              }
            ]
          }
        ]
      },
      {
        "id": "child_thought_2",
        "content": "Description of child thought 2",
        "depth": 1,
        "children": []
      }
    ]
  }
*/
// Irarium is essentially a collection of loosely-linked thoughts
export type Irarium = {
  id: string;
  userId: string;
  created: string;
  updated: string;
  title: string;
  description: string;
  tags: string;
  content: string;
  children: Thought[];
  isPublic: boolean;
  spaceId?: string;
  position?: [number, number, number];
  username?: string; // Current username (for expand queries)
  createdBy?: string; // Username at time of creation (fluid identity)
};

export type Space = {
  id: string;
  name: string;
  description: string;
  slug: string;
  tags: string;
  type: string;
  createdBy: string;
  mods: string[];
  isPublic: boolean;
  created: string;
  username?: string;
};
