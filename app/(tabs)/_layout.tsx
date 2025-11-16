import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '@/lib/storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await storage.getToken();
      if (!token) router.replace('/login');
    })();
  }, [router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        headerRight: () => (
          <TouchableOpacity
            onPress={async () => {
              await storage.clearToken();
              router.replace('/login');
            }}
            style={{ paddingHorizontal: 12 }}
          >
            <Text style={{ color: Colors[colorScheme ?? 'light'].tint, fontWeight: '700' }}>Sair</Text>
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" color={color} size={size ?? 24} />,
        }}
      />
      <Tabs.Screen
        name="eventos"
        options={{
          title: 'Meus Eventos',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="event" color={color} size={size ?? 24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="participantes"
        options={{
          title: 'Participantes',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="group" color={color} size={size ?? 24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" color={color} size={size ?? 24} />,
        }}
      />
    </Tabs>
  );
}
