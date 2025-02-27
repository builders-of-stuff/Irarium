export const ROUTE_IDS = {
  LANDING: '/',
  LOGIN: '/(auth)/login',
  SIGNUP: '/(auth)/signup',

  // User routes
  HOME: '/home'
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
