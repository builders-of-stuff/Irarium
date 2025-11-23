import { error, json } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { COLLECTION } from '$lib/shared/shared.type';
import { SPACE_EXPANSION_UNIT, DEFAULT_SPACE_SIZE } from '$lib/shared/space.constants';

export async function POST({ request, locals, params }) {
  if (!locals.pb.authStore.isValid) {
    throw error(401, 'Unauthorized');
  }

  const slug = params.slug;
  const spaceId = slug.split('-').pop();

  if (!spaceId) {
    throw error(400, 'Invalid space ID');
  }

  try {
    // 1. Fetch space and user settings
    const space = await locals.pb.collection(COLLECTION.SPACES).getOne(spaceId);
    const userSettings = await locals.pb.collection(COLLECTION.USER_SETTINGS).getFirstListItem(`userId="${locals.pb.authStore.model.id}"`);

    // 2. Check permissions
    if (space.createdBy !== locals.pb.authStore.model.id) {
      throw error(403, 'You do not have permission to expand this space');
    }

    // 3. Check if user has expanders
    if (userSettings.spaceExpanders < 1) {
      throw error(400, 'No space expanders available');
    }

    // 4. Update space size
    // 4. Update space size
    // If size is 0 or missing, treat it as DEFAULT_SPACE_SIZE (50)
    // But if we are expanding, we want to add to the *actual* stored size, or default if 0
    // The issue was likely: stored=0 -> current=50 (default) -> new=100.
    // Wait, if stored is 0, and we set it to 100, that's a +100 jump.
    // We should ensure we are adding to the *effective* size.
    
    const currentSize = space.size || DEFAULT_SPACE_SIZE;
    const newSize = currentSize + SPACE_EXPANSION_UNIT;

    await locals.pb.collection(COLLECTION.SPACES).update(spaceId, {
      size: newSize
    });

    // 5. Decrement user expanders (using admin client for security)
    const adminPb = new PocketBase(publicEnv.PUBLIC_POCKETBASE_URL);
    await adminPb.collection(COLLECTION.SUPERUSERS).authWithPassword(env.WEBOOK_ADMIN_EMAIL, env.WEBOOK_ADMIN_PASSWORD);

    await adminPb.collection(COLLECTION.USER_SETTINGS).update(userSettings.id, {
      spaceExpanders: userSettings.spaceExpanders - 1
    });

    return json({ success: true, newSize });
  } catch (err: any) {
    console.error('Error expanding space:', err);
    throw error(err.status || 500, err.message || 'Failed to expand space');
  }
}
