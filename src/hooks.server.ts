import PocketBase from 'pocketbase';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

import { ROUTE, ROUTE_IDS, UNPROTECTED_ROUTE_IDS } from '$lib/shared/shared.constant';
import { COLLECTION } from '$lib/shared/shared.type';

export async function handle({ event, resolve }) {
  /**
   * CORS
   */
  const requestMethod = event.request?.method?.toUpperCase?.() || '';

  const cspHeader = [
    "default-src 'self' https: http: data: blob:",
    // Add style-src directive to allow CSS
    "style-src 'self' 'unsafe-inline'",
    // Add Google Analytics domains
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com",
    "connect-src 'self' https: http: *.google-analytics.com *.analytics.google.com *.googletagmanager.com",
    // Add img-src for GA
    "img-src 'self' https: http: data: *.google-analytics.com *.googletagmanager.com",
    // Add media-src for TTS blob URLs
    "media-src 'self' blob:"
  ].join('; ');

  if (requestMethod === 'OPTIONS') {
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
    return new Response('{}', {
      status: 204,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Content-Security-Policy': cspHeader,
        'X-Frame-Options': 'SAMEORIGIN',
        // Adding this one additional important header
        'X-XSS-Protection': '1; mode=block'
      }
    });
  }

  /**
   * PocketBase
   */
  event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

  const cookie =
    event.request.headers.get('cookie') || event.cookies.get('pb_auth') || '';
  // Will parse pb_auth cookie out of any cookie string
  event.locals.pb.authStore.loadFromCookie(cookie);

  // Refresh auth store & user record
  try {
    if (event.locals.pb.authStore.isValid) {
      await event.locals.pb.collection(COLLECTION.USERS).authRefresh();
    }
  } catch (_) {
    event.locals.pb.authStore.clear();
  }

  /**
   * Auth/Route guards
   */
  const routeId = event.route.id;

  // Redirect to home if logged in and on unprotected route
  if (
    routeId &&
    UNPROTECTED_ROUTE_IDS.some((id) => id === routeId) &&
    event.locals.pb.authStore.isValid
  ) {
    return redirect(302, ROUTE.HOME);
  }

  // Redirect to login if not logged in
  if (
    routeId &&
    !UNPROTECTED_ROUTE_IDS.some((id) => id === routeId) &&
    !event.locals.pb.authStore.isValid
  ) {
    return redirect(302, ROUTE_IDS.LOGIN);
  }

  /**
   * Routes
   */
  const response = await resolve(event);

  /**
   * Post-route processing
   */
  // Add the same headers to all responses
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // set pb_auth cookie with latest store state
  const updatedCookie = event.locals.pb.authStore.exportToCookie({
    httpOnly: false,
    secure: true,
    sameSite: 'lax'
  });

  response.headers.set('Set-Cookie', updatedCookie);

  return response;
}
