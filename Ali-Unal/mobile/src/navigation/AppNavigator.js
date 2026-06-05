// ─────────────────────────────────────────────
// App Navigator — Doğrusal Akış (Presentation Mode)
// Splash -> Login -> Profile -> Addresses
// ─────────────────────────────────────────────

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Ekranlar
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AddressesScreen from '../screens/profile/AddressesScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import PaymentsScreen from '../screens/profile/PaymentsScreen';
import PromotionsScreen from '../screens/profile/PromotionsScreen';
import HelpScreen from '../screens/profile/HelpScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Onboarding"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Addresses" component={AddressesScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="Promotions" component={PromotionsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        {/* Admin Flow */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
