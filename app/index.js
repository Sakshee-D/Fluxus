import React, { useState } from 'react';
import { NativeRouter, Route, Routes, useNavigate } from 'react-router-native';
import { AppRegistry, View } from 'react-native';

import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateRideScreen from './screens/CreateRideScreen'; // Import Create Ride screen
import SearchScreen from './screens/SearchScreen'; // Import Create Ride screen

export default function App() {
  const [user, setUser] = useState(null); // ✅ Store user globally

  const dashboardData = { 
    student_id: "12345", // Example data, replace with actual dashboard data
    destination: "Mumbai",
    ride_datetime: "2025-03-15T10:00:00"
  };

  return (
    <NativeRouter>
      <View style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/login" element={<LoginScreen setUser={setUser} />} /> 
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/dashboard" element={<DashboardScreen user={user} />} />
          <Route path="/profile" element={<ProfileScreen user={user} setUser={setUser} />} />
          
          <Route path="/search" element={<SearchScreen user={user} setUser={setUser} />} /><Route 
            path="/create-ride" 
            element={<CreateRideScreen 
                      studentId={dashboardData.student_id} 
                      destination={dashboardData.destination} 
                      rideDatetime={dashboardData.ride_datetime} 
                    />} 
          /> {/* Pass data to CreateRideScreen */}
        </Routes>
      </View>
    </NativeRouter>
  );
}

AppRegistry.registerComponent('Ride', () => App);


