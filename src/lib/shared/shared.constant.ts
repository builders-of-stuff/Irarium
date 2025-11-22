export const DISCORD_INVITE_LINK = 'https://discord.gg/kDAS7QMWdq';
export const X_LINK = 'https://x.com/irarium';
export const GITHUB_LINK = 'https://github.com/builders-of-stuff/Irarium';
export const IRARIUM_LINK = 'https://irarium.com/public';

export const ROUTE_IDS = {
  // Public routes
  LANDING: '/',
  LOGIN: '/(auth)/login',
  SIGNUP: '/(auth)/signup',
  PUBLIC: '/(app)/(public)/public',
  IRARIUM: '/(app)/(irarium)/[irariumId]',

  // Private routes
  HOME: '/(app)/(user)/home',
  COLLECTION: '/(app)/(user)/collections',
  CHECKOUT: '/(app)/(user)/billing/checkout',
  SETTINGS: '/(app)/(user)/settings',
  CREATE: '/(app)/(user)/create',
  PROFILE: '/(app)/(user)/user/[username]',
  SPACES: '/(app)/(space)/spaces',
  SPACE: '/(app)/(space)/spaces/[slug]',

  // Webhook routes
  STRIPE_WEBHOOK: '/(webhooks)/payments'
};

export const ROUTE = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/home',
  CHECKOUT: '/billing/checkout',
  CREATE: '/create',
  COLLECTION: '/collections',
  SETTINGS: '/settings',
  SPACES: '/spaces',
  PROFILE: '/user'
};

// event.route.id -> e.g. for `src/routes/blog/[slug]`, it would be `/blog/[slug]`
export const PUBLIC_ROUTE_IDS = [
  ROUTE_IDS.LANDING,
  ROUTE_IDS.SIGNUP,
  ROUTE_IDS.LOGIN,
  ROUTE_IDS.PUBLIC,
  ROUTE_IDS.IRARIUM
];

export const PRIVATE_ROUTE_IDS = [
  ROUTE_IDS.HOME,
  ROUTE_IDS.CHECKOUT,
  ROUTE_IDS.COLLECTION,
  ROUTE_IDS.SETTINGS,
  ROUTE_IDS.CREATE,
  ROUTE_IDS.PROFILE,
  ROUTE_IDS.SPACES,
  ROUTE_IDS.SPACE
];

// Public routes that should redirect to home if logged in
export const PUBLIC_REDIRECT_ROUTE_IDS = [
  ROUTE_IDS.LANDING,
  ROUTE_IDS.SIGNUP,
  ROUTE_IDS.LOGIN
];

export const DEFAULT_IRARIUM_ID = 'ROOT';

// Keyboard event key constants
export const KEYBOARD_KEYS = {
  // Navigation keys
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',

  // Action keys
  ENTER: 'Enter',
  TAB: 'Tab',
  ESCAPE: 'Escape',
  SPACE: ' '
};
