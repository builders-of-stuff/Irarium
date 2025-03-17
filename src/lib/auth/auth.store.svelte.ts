import { pb } from '$lib/db/client';
import { COLLECTION } from '$lib/shared/shared.type';
import type { User } from '$lib/shared/shared.type';

class AuthStore {
  /**
   * Auth.
   */
  user = $state<User>({} as User);
  hasUser = $derived(!!this.user?.id);
  userId = $derived(this.user?.id);
  username = $derived(this.user?.username);
  /**
   * User settings
   */
  userSettings = $derived({});

  /**
   * Form states
   */
  isUpdating = $state(false);
  updateError = $state('');

  constructor() {
    const cookies = document.cookie;
    pb.authStore.loadFromCookie(cookies);

    if (pb.authStore.isValid && pb.authStore.record) {
      this.user = this.mapAuthRecordToUser(pb.authStore.record);
    }

    pb.authStore.onChange((token, record) => {
      if (token && record?.id) {
        this.user = this.mapAuthRecordToUser(record);
      } else {
        this.user = {} as User;
      }
    });
  }

  /**
   * Auth
   */
  async login(email: string, password: string) {
    try {
      const authResponse = await pb
        .collection(COLLECTION.USERS)
        .authWithPassword(email, password);

      this.user = this.mapAuthRecordToUser(authResponse.record);

      // Set cookie
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        secure: true,
        sameSite: 'lax'
      });

      return { success: true, data: authResponse };
    } catch (error) {
      return { success: false, error };
    }
  }

  async signUp(email: string, password: string, passwordConfirm: string) {
    try {
      // Create user
      const newUser = await pb.collection(COLLECTION.USERS).create({
        email,
        password,
        passwordConfirm
      });

      // Update the user to set username as the ID
      await pb.collection(COLLECTION.USERS).update(newUser.id, {
        username: newUser.id
      });

      // Login user
      const authResponse = await pb
        .collection(COLLECTION.USERS)
        .authWithPassword(email, password);

      this.user = this.mapAuthRecordToUser(authResponse.record);

      // Set cookie
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        secure: true,
        sameSite: 'lax'
      });

      return { success: true, data: authResponse };
    } catch (error) {
      return { success: false, error };
    }
  }

  async signOut() {
    try {
      pb.authStore.clear();
      this.user = {} as User;
      // Delete specific pb_auth cookie by setting name, path, and expired date
      document.cookie = `pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async refreshUser() {
    try {
      const authResponse = await pb.collection(COLLECTION.USERS).authRefresh();
      this.user = this.mapAuthRecordToUser(authResponse.record);
      return { success: true };
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { success: false, error };
    }
  }

  /**
   * Profile management
   */
  async updateProfile(name: string, bio: string, username: string) {
    if (!this.userId) {
      this.updateError = 'User not logged in';
      return { success: false, error: this.updateError };
    }

    this.isUpdating = true;
    this.updateError = '';

    try {
      // Validate username
      if (!username) {
        this.updateError = 'Username cannot be empty';
        return { success: false, error: this.updateError };
      }

      await pb.collection(COLLECTION.USERS).update(this.userId, {
        name,
        bio,
        username
      });

      // Refresh user data
      await this.refreshUser();

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      this.updateError = 'Failed to update profile. Please try again.';
      return { success: false, error };
    } finally {
      this.isUpdating = false;
    }
  }

  private mapAuthRecordToUser(record: any): User {
    return {
      id: record.id,
      name: record.name,
      username: record.username,
      displayName: record.displayName,
      bio: record.bio,
      created: record.created,
      updated: record.updated,
      verified: record.verified,
      emailVisibility: record.emailVisibility,

      subscriptionType: record.subscriptionType || ''
    };
  }
}

export const authStore = new AuthStore();
