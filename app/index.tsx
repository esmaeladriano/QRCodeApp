import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { storage } from '@/lib/storage';

export default function Index() {
  const [dest, setDest] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = await storage.getToken();
      setDest(token ? '/(tabs)' : '/login');
    })();
  }, []);

  if (!dest) return <View />;
  return <Redirect href={dest as any} />;
}
