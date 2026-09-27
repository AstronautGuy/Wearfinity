import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser, User } from '../hooks/useUser';

export default function ProfilesScreen() {
  const { users, createUser, setActiveUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const router = useRouter();

  const handleCreateUser = async () => {
    if (newUserName.trim() === '') return;
    const user = await createUser(newUserName);
    if (user) {
      setNewUserName('');
      setModalVisible(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setActiveUser(user);
    router.replace('/');
  };

  const getColorForUser = (id: number, name: string) => {
    const colors = ['#4F46E5', '#E11D48', '#16A34A', '#D97706', '#0284C7', '#7C3AED', '#DB2777'];
    const index = (id + name.charCodeAt(0)) % colors.length;
    return colors[index];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who is choosing an outfit?</Text>
      
      <View style={styles.gridContainer}>
        {users.map(user => (
          <TouchableOpacity key={user.id} style={styles.profileItem} onPress={() => handleSelectUser(user)}>
            <View style={[styles.circle, { backgroundColor: getColorForUser(user.id, user.name) }]}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <Text style={styles.userName}>{user.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.profileItem} onPress={() => setModalVisible(true)}>
          <View style={[styles.circle, styles.createCircle]}>
            <Ionicons name="add" size={40} color="#666" />
          </View>
          <Text style={styles.userName}>Create</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newUserName}
              onChangeText={setNewUserName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#666" />
              <Button title="Create" onPress={handleCreateUser} color="#4F46E5" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  profileItem: {
    alignItems: 'center',
    margin: 10,
    width: 80,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createCircle: {
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});
