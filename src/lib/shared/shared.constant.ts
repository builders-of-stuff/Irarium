export const ROUTE_IDS = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup'
};

// event.route.id -> e.g. for `src/routes/blog/[slug]`, it would be `/blog/[slug]`
export const UNPROTECTED_ROUTE_IDS = [
  ROUTE_IDS.HOME,
  ROUTE_IDS.SIGNUP,
  ROUTE_IDS.LOGIN
];
