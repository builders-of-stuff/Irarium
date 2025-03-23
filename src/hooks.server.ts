import PocketBase from 'pocketbase';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { WEBOOK_ADMIN_EMAIL, WEBOOK_ADMIN_PASSWORD } from '$env/static/private';

import {
  ROUTE,
  ROUTE_IDS,
  PRIVATE_ROUTE_IDS,
  PUBLIC_ROUTE_IDS,
  PUBLIC_REDIRECT_ROUTE_IDS
} from '$lib/shared/shared.constant';
import { COLLECTION } from '$lib/shared/shared.type';

export async function handle({ event, resolve }) {
  const isWebhook = event.route.id === ROUTE_IDS.STRIPE_WEBHOOK;

  /**
   * CORS
   */
  const requestMethod = event.request?.method?.toUpperCase?.() || '';

  const cspHeader = [
    "default-src 'self' https: http: data: blob:",
    // Add style-src directive to allow CSS
    "style-src 'self' 'unsafe-inline'",
    // Add Google Analytics and Google Tag Manager domains
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.analytics.google.com *.ggpht.com *.doubleclick.net www.googleadservices.com *.googlesyndication.com googleads.g.doubleclick.net",
    "connect-src 'self' https: http: *.google-analytics.com *.analytics.google.com *.googletagmanager.com *.g.doubleclick.net *.googlesyndication.com stats.g.doubleclick.net ampcid.google.com analytics.google.com www.google-analytics.com www.googletagmanager.com region1.google-analytics.com",
    // Add img-src for GA
    "img-src 'self' https: http: data: *.google-analytics.com *.googletagmanager.com *.g.doubleclick.net *.google.com *.google.ae *.google.al *.google.am *.google.as *.google.at *.google.az *.google.ba *.google.be www.googleadservices.com",
    // Add frame-src for GTM iframe functionality
    "frame-src 'self' *.googletagmanager.com *.doubleclick.net *.google.com",
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

  /**
   * Auth handling
   */
  if (isWebhook) {
    await event.locals.pb
      .collection(COLLECTION.SUPERUSERS)
      .authWithPassword(WEBOOK_ADMIN_EMAIL, WEBOOK_ADMIN_PASSWORD);
  } else {
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
     * Auth/Route guards (skip for webhook routes)
     */
    const routeId = event.route.id;
    const isLoggedIn = event.locals.pb.authStore.isValid;

    const isPublicRedirectRouteId = PUBLIC_REDIRECT_ROUTE_IDS.some(
      (id) => id === routeId
    );
    const isPrivateRouteId = PRIVATE_ROUTE_IDS.some((id) => id === routeId);

    if (routeId) {
      if (isPublicRedirectRouteId && isLoggedIn) {
        return redirect(302, ROUTE.HOME);
      } else if (isPrivateRouteId && !isLoggedIn) {
        return redirect(302, ROUTE.LOGIN);
      }
    }
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

  // Set pb_auth cookie with latest store state (skip for webhook routes)
  if (!isWebhook) {
    const updatedCookie = event.locals.pb.authStore.exportToCookie({
      httpOnly: false,
      secure: true,
      sameSite: 'lax'
    });

    response.headers.set('Set-Cookie', updatedCookie);
  }

  return response;
}
