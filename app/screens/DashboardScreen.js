import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigate, useLocation } from 'react-router-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function DashboardScreen() {
  const { state } = useLocation();
  const selectedLanguage = state?.language || 'English';
  const navigate = useNavigate();
  const user = state?.user;

  const [from, setFrom] = useState('IIT Indore Campus');
  const [destination, setDestination] = useState(state?.destination || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i);

  const destinations = [
    'Indore Airport', 'Indore Railway Station', 'Sarvate Bus Stand', 'Rajwada',
    'Treasure Island Mall', 'C21 Mall', 'Vijay Nagar', 'Chappan Dukan', 'Ralamandal'
  ];

  const timeSlots = [
    '6-7 AM', '7-8 AM', '8-9 AM', '9-10 AM', '10-11 AM', '11-12 PM',
    '12-1 PM', '1-2 PM', '2-3 PM', '3-4 PM', '4-5 PM', '5-6 PM',
    '6-7 PM', '7-8 PM', '8-9 PM', '9-10 PM'
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigate('/login', { state: { language: selectedLanguage } })}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.editProfileButton} onPress={() => navigate('/profile', { state: { user } })}>
        <Ionicons name="person-circle-outline" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Welcome to Ride Share!</Text>
        <Text style={styles.tagline}>Find and Share Your Ride</Text>
      </View>

      <View style={styles.createRideBox}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigate('/create-ride', { state: { from, destination, ride_datetime: `${selectedDate} ${selectedMonth} ${selectedYear} ${selectedTime}` } })}
        >
          <Text style={styles.optionText}>Create a Ride</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <TextInput style={styles.fromInput} value={from} editable={false} />

        <View style={styles.pickerContainer}>
          <Picker selectedValue={destination} onValueChange={(itemValue) => setDestination(itemValue)} style={styles.picker}>
            <Picker.Item label="Select Destination" value="" />
            {destinations.map((dest, index) => (
              <Picker.Item key={index} label={dest} value={dest} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Select Date</Text>
        <View style={styles.datePickerRow}>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedDate} onValueChange={(itemValue) => setSelectedDate(itemValue)} style={styles.picker}>
              <Picker.Item label="Day" value="" />
              {days.map((day) => (
                <Picker.Item key={day} label={day.toString()} value={day} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedMonth} onValueChange={(itemValue) => setSelectedMonth(itemValue)} style={styles.picker}>
              <Picker.Item label="Month" value="" />
              {months.map((month, index) => (
                <Picker.Item key={index} label={month} value={month} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedYear} onValueChange={(itemValue) => setSelectedYear(itemValue)} style={styles.picker}>
              <Picker.Item label="Year" value="" />
              {years.map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={[styles.selectedDateText, { color: 'white' }]}>
          {selectedDate && selectedMonth && selectedYear
            ? `${selectedDate} ${selectedMonth} ${selectedYear}`
            : 'Not Selected'}
        </Text>

        <Text style={styles.label}>Select Time Slot</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedTime} onValueChange={(itemValue) => setSelectedTime(itemValue)} style={styles.picker}>
            <Picker.Item label="Select Time Slot" value="" />
            {timeSlots.map((slot, index) => (
              <Picker.Item key={index} label={slot} value={slot} />
            ))}
          </Picker>
        </View>

        <Text style={[styles.selectedDateText, { color: 'white' }]}>
          Selected Time: {selectedTime ? selectedTime : 'Not Selected'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigate('/search', { state: { from, destination, selectedDate, selectedMonth, selectedYear, selectedTime } })}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0a192f' },
  backButton: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
  editProfileButton: { position: 'absolute', top: 10, right: 10, zIndex: 1 },
  welcomeCard: { backgroundColor: '#f4a261', padding: 20, borderRadius: 10, marginTop: 50, marginBottom: 20, alignItems: 'center' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  tagline: { fontSize: 18, color: '#fff', marginTop: 10 },
  createRideBox: { backgroundColor: '#2a9d8f', padding: 20, borderRadius: 10, marginBottom: 20, alignItems: 'center' }, 
  inputSection: { marginTop: 20 },
  fromInput: { backgroundColor: '#fff', padding: 10, borderRadius: 5, marginTop: 10, color: 'black' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, color: 'white' },
  selectedDateText: { fontSize: 16, marginTop: 5 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', backgroundColor: 'white', borderRadius: 5, marginBottom: 12 },
  optionButton: { backgroundColor: '#264653', padding: 10, borderRadius: 5, marginTop: 5, alignItems: 'center' },
  optionText: { color: 'white', fontSize: 14 },
  searchButton: { backgroundColor: '#2a9d8f', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  searchButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});







