import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/public';

// Remove any fallback value if it exists
export const pb = new PocketBase(env.PUBLIC_POCKETBASE_URL);

/**
 * https://github.com/pocketbase/js-sdk?tab=readme-ov-file
 * 
 * BaseAuthStore {
    // base fields
    record:       RecordModel|null // the authenticated auth record
    token:        string  // the authenticated token
    isValid:      boolean // checks if the store has existing and unexpired token
    isSuperuser:  boolean // checks if the store state is for superuser

    // main methods
    clear()             // "logout" the authenticated record
    save(token, record) // update the store with the new auth data
    onChange(callback, fireImmediately = false) // register a callback that will be called on store change

    // cookie parse and serialize helpers
    loadFromCookie(cookieHeader, key = 'pb_auth')
    exportToCookie(options = {}, key = 'pb_auth')
}
 */
export const isAuthenticated = () => pb?.authStore?.isValid;
export const authToken = () => pb?.authStore?.token;
