import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocation, useNavigate } from 'react-router-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function SearchResultsScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { from, destination, selectedDate, selectedMonth, selectedYear, selectedTime } = state || {};
  const [rides, setRides] = useState([]);

  
  const ride_date = selectedYear && selectedMonth && selectedDate 
    ? `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
    : null;

  
  const fetchRides = () => {
    axios
      .get(`http://localhost:5000/get_rides`)
      .then(response => {
        let fetchedRides = response.data;

       
        const filteredRides = fetchedRides.filter(ride =>
          ride.ride_date === ride_date && ride.ride_time === selectedTime
        );

        setRides(filteredRides);
      })
      .catch(error => {
        console.error("Error fetching rides:", error);
      });
  };

  useEffect(() => {
    if (ride_date && selectedTime) {
      fetchRides();
    }
  }, [ride_date, selectedTime]);

  const handleBookRide = (rideId) => {
    navigate('/book-ride', { state: { rideId } });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigate('/dashboard', { state })}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerText}>Search Results</Text>
        <Text style={styles.headerSubText}>From: {from} | To: {destination || 'Not Available'}</Text>
        <Text style={styles.headerSubText}>Date: {ride_date} | Time: {selectedTime || 'Not Available'}</Text>
      </View>

      <View style={styles.resultsContainer}>
        {rides.length === 0 ? (
          <Text style={styles.noResultsText}>No rides found</Text>
        ) : (
          rides.map((ride) => (
            <View key={ride.ride_id} style={styles.rideCard}>
              <Text style={styles.rideText}>Time: {ride.ride_time}</Text>
              <Text style={styles.rideText}>Available Seats: {ride.available_seats}</Text>
              <Text style={styles.rideText}>Destination: {ride.destination || 'Not Available'}</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookRide(ride.ride_id)}
              >
                <Text style={styles.bookButtonText}>Book Ride</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0a192f',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSubText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  resultsContainer: {
    marginTop: 20,
  },
  rideCard: {
    backgroundColor: '#f4a261',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  rideText: {
    fontSize: 16,
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#264653',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});


