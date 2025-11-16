import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

export const storage = {
  async getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async setToken(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async clearToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};
