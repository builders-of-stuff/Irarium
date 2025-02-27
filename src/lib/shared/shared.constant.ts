export const ROUTE_IDS = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',

  // User routes
  HOME: '/home'
};

// event.route.id -> e.g. for `src/routes/blog/[slug]`, it would be `/blog/[slug]`
export const UNPROTECTED_ROUTE_IDS = [
  ROUTE_IDS.LANDING,
  ROUTE_IDS.SIGNUP,
  ROUTE_IDS.LOGIN
];
