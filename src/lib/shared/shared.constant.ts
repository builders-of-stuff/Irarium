export const ROUTE_IDS = {
  LANDING: '/',
  LOGIN: '/(auth)/login',
  SIGNUP: '/(auth)/signup',

  // User routes
  HOME: '/(app)/(user)/home'
};

export const ROUTE = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/home'
};

// event.route.id -> e.g. for `src/routes/blog/[slug]`, it would be `/blog/[slug]`
export const UNPROTECTED_ROUTE_IDS = [
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
