import { useLocation, useNavigate } from "react-router-native";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icon for back button


export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;  


  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email_id || "");
  const [mobile, setMobile] = useState(user?.mobile_no || "");
  const [successMessage, setSuccessMessage] = useState("");


  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/profile/${user.student_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email_id: email, gender: user.gender, mobile_no: mobile }),
      });


      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        Alert.alert("Error", result.message || "Failed to update profile.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };


  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigate("/dashboard")}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>


      <Text style={styles.heading}>Profile</Text>
     
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />


      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />


      <Text style={styles.label}>Student ID:</Text>
      <TextInput style={styles.input} value={user?.student_id} editable={false} />


      <Text style={styles.label}>Mobile No:</Text>
      <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />


      <Text style={styles.label}>Rating:</Text>
      <TextInput style={styles.input} value={user?.rating || "N/A"} editable={false} />


      <Button title="Save Changes" onPress={handleSave} />


      {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a237e", padding: 20 },
  backButton: { position: "absolute", top: 40, left: 20 }, // Positioned back button
  heading: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 20 },
  label: { color: "white", fontSize: 16, marginTop: 10 },
  input: { width: "80%", backgroundColor: "white", padding: 10, marginBottom: 10, borderRadius: 5 },
  successMessage: { color: "#c8e6c9", fontSize: 16, marginTop: 10 },
});
