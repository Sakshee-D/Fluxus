import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigate } from 'react-router-native';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!gender) {
      setMessage('Please select your gender.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        student_id: studentId,  // ✅ Fixed backend key
        email_id: email,        // ✅ Ensured backend consistency
        name,
        gender,
        mobile_no: mobile || null, // ✅ Handled optional mobile input
        password,
      });

      setMessage(response.data.message);

      if (response.data.message === 'Registration Successful') {
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage('User already exists');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Your Account</Text>

      <TextInput
        style={styles.input}
        value={studentId}
        onChangeText={setStudentId}
        placeholder="Enter Student ID"
        placeholderTextColor="black"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter Email ID"
        placeholderTextColor="black"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter Your Name"
        placeholderTextColor="black"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" color="black" />
          <Picker.Item label="Male" value="Male" color="black" />
          <Picker.Item label="Female" value="Female" color="black" />
          <Picker.Item label="Other" value="Other" color="black" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        placeholder="Enter Mobile Number (Optional)"
        placeholderTextColor="black"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Set Password"
        placeholderTextColor="black"
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        placeholderTextColor="black"
      />

      <Button title="Register" onPress={handleRegister} color="#f4a261" />

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'navy',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
  pickerContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    color: 'black',
  },
  message: {
    marginTop: 10,
    color: 'yellow',
    fontSize: 16,
  },
});



