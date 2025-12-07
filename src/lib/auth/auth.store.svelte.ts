import { pb } from '$lib/db/client';
import { COLLECTION } from '$lib/shared/shared.type';
import type { User, UserSettings } from '$lib/shared/shared.type';

class AuthStore {
  /**
   * Auth.
   */
  user = $state<User>({} as User);
  userSettings = $state<UserSettings>({} as UserSettings);

  hasUser = $derived(!!this.user?.id);
  userId = $derived(this.user?.id);
  username = $derived(this.user?.username);

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
      this.fetchAndSetUserSettings();
    }

    pb.authStore.onChange((token, record) => {
      if (token && record?.id) {
        this.user = this.mapAuthRecordToUser(record);
        this.fetchAndSetUserSettings();
      } else {
        this.user = {} as User;
        this.userSettings = {} as UserSettings;
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
      await this.fetchAndSetUserSettings();

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

  async loginWithGoogle() {
    try {
      const authResponse = await pb.collection(COLLECTION.USERS).authWithOAuth2({
        provider: 'google'
      });

      this.user = this.mapAuthRecordToUser(authResponse.record);
      
      // Ensure username is set (Google OAuth might not set it)
      if (!this.user.username && this.user.id) {
        try {
          await pb.collection(COLLECTION.USERS).update(this.user.id, {
            username: this.user.id
          });
          // Refresh user to get the updated username
          await this.refreshUser();
        } catch (err) {
          console.error('Failed to auto-set username:', err);
        }
      }

      await this.fetchAndSetUserSettings();

      // Set cookie
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        secure: true,
        sameSite: 'lax'
      });

      return { success: true, data: authResponse };
    } catch (error) {
      console.error('Google login error:', error);
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

      // Login user
      const authResponse = await pb
        .collection(COLLECTION.USERS)
        .authWithPassword(email, password);

      // Update user username
      await pb.collection(COLLECTION.USERS).update(newUser.id, {
        username: newUser.id
      });

      // Create user settings
      const userSettings = await pb.collection(COLLECTION.USER_SETTINGS).create({
        userId: newUser.id,
        isFullyUpgraded: false
      });

      this.user = this.mapAuthRecordToUser(authResponse.record);
      this.userSettings = this.mapRecordToUserSettings(userSettings);

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
      this.userSettings = {} as UserSettings;
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
      await this.fetchAndSetUserSettings();

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

  /**
   * Space Subscription
   */
  async toggleSpaceSubscription(spaceId: string) {
    if (!this.userId || !this.userSettings?.hasAnsible) return;

    const currentSubscriptions = this.userSettings.subscribedSpaces || [];
    const isSubscribed = currentSubscriptions.includes(spaceId);

    let newSubscriptions: string[];
    if (isSubscribed) {
      newSubscriptions = currentSubscriptions.filter((id) => id !== spaceId);
    } else {
      newSubscriptions = [...currentSubscriptions, spaceId];
    }

    try {
      await pb.collection(COLLECTION.USER_SETTINGS).update(this.userSettings.id, {
        subscribedSpaces: newSubscriptions
      });

      // Update local state
      this.userSettings.subscribedSpaces = newSubscriptions;
      return { success: true, isSubscribed: !isSubscribed };
    } catch (error) {
      console.error('Error toggling subscription:', error);
      return { success: false, error };
    }
  }

  /**
   * Fetch user settings from the database
   */
  private async fetchAndSetUserSettings() {
    if (!this.userId) return;

    try {
      const result = await pb
        .collection(COLLECTION.USER_SETTINGS)
        .getFirstListItem(`userId="${this.userId}"`);

      if (result) {
        this.userSettings = this.mapRecordToUserSettings(result);
      }
    } catch (error: any) {
      if (error.status === 404) {
        try {
          const newSettings = await pb.collection(COLLECTION.USER_SETTINGS).create({
            userId: this.userId,
            isFullyUpgraded: false,
            spaceLimit: 1,
            spaceExpanders: 0
          });
          this.userSettings = this.mapRecordToUserSettings(newSettings);
        } catch (createError) {
          console.error('Error creating user settings:', createError);
        }
      } else {
        console.error('Error fetching user settings:', error);
      }
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

      subscriptionType: record.subscriptionType || '',
      isPremium: record.isPremium || false,
      premiumSince: record.premiumSince || null
    };
  }

  private mapRecordToUserSettings(record: any): UserSettings {
    return {
      id: record.id,
      userId: record.userId,
      isFullyUpgraded: record.isFullyUpgraded,
      spaceLimit: record.spaceLimit,
      spaceExpanders: record.spaceExpanders || 0,
      hasAnsible: record.hasAnsible || false,
      subscribedSpaces: record.subscribedSpaces || []
    };
  }
}

export const authStore = new AuthStore();
