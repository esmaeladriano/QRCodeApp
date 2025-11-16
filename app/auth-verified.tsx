import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { storage } from '@/lib/storage';

export default function AuthVerified() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      if (token && typeof token === 'string') {
        await storage.setToken(token);
      }
      setDone(true);
    })();
  }, [token]);

  if (!done) return <View />;
  return <Redirect href="/(tabs)" />;
}
