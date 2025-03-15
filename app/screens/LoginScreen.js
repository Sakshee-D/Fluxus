import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigate } from 'react-router-native';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!studentId.trim() || !pin.trim()) {
      setMessage('Both fields are required.');
      return;
    }

    console.log('Attempting login with:', { student_id: studentId.trim(), password: pin.trim() });

    try {
      const response = await axios.post('http://localhost:5000/login', {
        student_id: studentId.trim(),
        password: pin.trim(),
      });

      console.log('Response received:', response.data);

      if (response.data.message === 'Login Successful' && response.data.user) {
        setMessage('');
        
        // Navigate to the Profile screen and pass user data
        navigate('/dashboard', { state: { user: response.data.user } });

      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error.response || error);
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login to Your Account</Text>

      <Text style={styles.label}>Enter Student ID</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={studentId}
        onChangeText={setStudentId}
        placeholder="Enter your Student ID"
        placeholderTextColor="gray"
      />

      <Text style={styles.label}>Enter PIN</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        placeholder="Enter your PIN"
        placeholderTextColor="gray"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a237e',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    width: '80%',
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#f4a261',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    color: 'yellow',
    fontSize: 16,
    textAlign: 'center',
  },
});

