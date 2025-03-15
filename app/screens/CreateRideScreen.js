import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigate } from 'react-router-native';
import { Picker } from '@react-native-picker/picker';

export default function CreateRideScreen({ studentId, destination, rideDatetime }) {
  const [studentIdValue, setStudentId] = useState(studentId || '');
  const [destinationValue, setDestination] = useState(destination || '');
  const [rideDatetimeValue, setRideDatetime] = useState(rideDatetime || '');
  const [price, setPrice] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
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

  const handleCreateRide = async () => {
    
    if (!studentIdValue || !destinationValue || !selectedDate || !selectedMonth || !selectedYear || !price || !availableSeats || !selectedTime) {
      setMessage('Please fill in all fields.');
      return;
    }

    
    const rideDate = `${selectedYear}-${months.indexOf(selectedMonth) + 1}-${selectedDate < 10 ? '0' + selectedDate : selectedDate}`;

    try {
      const response = await axios.post('http://localhost:5000/create-ride', {
        student_id: studentIdValue,
        destination: destinationValue,
        ride_date: rideDate, 
        ride_time: selectedTime, 
        price,
        available_seats: availableSeats,
      });

      setMessage(response.data.message);

      if (response.data.message === 'Ride created successfully') {
        setTimeout(() => {
          navigate('/dashboard');  
        }, 3000);
      }
    } catch (error) {
      setMessage('An error occurred while creating the ride.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('/dashboard')}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Create Ride</Text>

      <TextInput
        style={styles.input}
        value={studentIdValue}
        onChangeText={setStudentId}
        placeholder="Enter Student ID"
        placeholderTextColor="lightgrey"
        keyboardType="numeric"
      />

      {/* DESTINATION PICKER */}
      <Text style={styles.label}>Select Destination</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={destinationValue}
          onValueChange={(itemValue) => setDestination(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Destination" value="" />
          {destinations.map((dest, index) => (
            <Picker.Item key={index} label={dest} value={dest} />
          ))}
        </Picker>
      </View>

      {/* DATE PICKERS */}
      <Text style={styles.label}>Select Date</Text>
      <View style={styles.datePickerRow}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedDate}
            onValueChange={(itemValue) => setSelectedDate(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Day" value="" />
            {days.map((day) => (
              <Picker.Item key={day} label={day.toString()} value={day} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Month" value="" />
            {months.map((month, index) => (
              <Picker.Item key={index} label={month} value={month} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Year" value="" />
            {years.map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
      </View>

      {/* TIME SLOT PICKER */}
      <Text style={styles.label}>Select Time Slot</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Time Slot" value="" />
          {timeSlots.map((slot, index) => (
            <Picker.Item key={index} label={slot} value={slot} />
          ))}
        </Picker>
      </View>

      <Text style={styles.selectedDateText}>
        {selectedDate && selectedMonth && selectedYear
          ? `${selectedDate} ${selectedMonth} ${selectedYear}`
          : 'Date not selected'}
      </Text>

      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter Price"
        placeholderTextColor="lightgrey"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={availableSeats}
        onChangeText={setAvailableSeats}
        placeholder="Enter Available Seats"
        placeholderTextColor="lightgrey"
        keyboardType="numeric"
      />

      <Button title="Create Ride" onPress={handleCreateRide} color="#f4a261" />

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',  
    padding: 20,
  },
  header: {
    width: '100%',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  backText: {
    color: 'lightgrey',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'lightgrey',  
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    width: '80%',
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 5,
    color: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'lightgrey',  
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 12,
    width: '80%',
  },
  picker: {
    height: 50,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  selectedDateText: {
    marginTop: 10,
    color: 'lightgrey',
    fontSize: 16,
  },
  message: {
    marginTop: 10,
    color: 'lightgrey',
    fontSize: 16,
  },
});
