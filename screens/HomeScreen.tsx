import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  FlatList,
  ScrollView,
  StyleSheet,
  SectionList,
  Alert,
} from 'react-native';
import {Button, TextInput, Text, Divider, FAB, Card} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}) => {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState({client: '', category: '', text: ''});

  const key = 'NoteList';

  useEffect(() => {
    getNoteList(); // Fetch notes on component mount
  }, []);

  const getNoteList = async () => {
    try {
      // await AsyncStorage.removeItem(key) // use if required to delete all items from storage

      const storedNotes = await AsyncStorage.getItem(key);
      if (storedNotes) {
        console.log('getList', storedNotes);
        await setNotes(JSON.parse(storedNotes)); // If data exists, update state
      }
    } catch (error) {
      console.log('Error retrieving notes: ', error);
    }
  };

  const categories = ['Goal Evidence', 'Support Coordination', 'Active Duty'];

  const addNote = () => {
    if (newNote.client && newNote.category && newNote.text) {
      console.log('before', notes);
      setNotes(prevNotes => [...prevNotes, newNote]);

      console.log('after', notes);

      setShowModal(false);
      setNewNote({client: '', category: '', text: ''});
      saveNotes(); // Persist notes to AsyncStorage
    } else {
      Alert.alert('Client, Category and Notes are required to add notes');
    }
  };

  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(notes));
    } catch (error) {
      console.log('Error storing notes: ', error);
      Alert.alert('Storage Error', 'Could not save notes. Please try again.');
    }
  };

  const deleteNote = index => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete the item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedNotes = [...notes];
            updatedNotes.splice(index, 1); // Remove the note at the specified index
            setNotes(updatedNotes);
            saveNotes(); // Persist the updated notes to AsyncStorage
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleEdit = selectedNote => {
    // You can set the selected note to the state and use a modal or navigate to an edit screen.
    navigation.navigate('Edit', {
      note: selectedNote,
      categories,
      saveNotes,
      setNotes,
    });
    // setNewNote(selectedNote); // set the selected note to be edited
    // console.log(selectedNote)
    // show the modal with populated data for editing
  };

  return (
    <View style={styles.container}>
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <Card>
              <Card.Title title={item.client} />
              <Card.Content>
                <Text variant="bodySmall">Category: {item.category}</Text>
                <Text variant="bodySmall">Note: {item.text}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => handleEdit(item)} mode="elevated">
                  Edit
                </Button>
                <Button
                  onPress={() => deleteNote(index)}
                  mode="contained-tonal">
                  Delete
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      ) : (
        <View>
          <Text> No notes in list , add new notes</Text>
        </View>
      )}

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalView}>
          <TextInput
            mode="outlined"
            label="Client"
            placeholder="Client"
            value={newNote.client}
            onChangeText={client => setNewNote({...newNote, client})}
          />
          <SelectDropdown
            data={categories}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              setNewNote({...newNote, category: selectedItem});
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
          <TextInput
            mode="outlined"
            placeholder="Note"
            label="Note"
            value={newNote.text}
            onChangeText={text => setNewNote({...newNote, text})}
          />
          <Divider />
          <Button onPress={addNote} mode="contained">
            Add Note
          </Button>
        </View>
      </Modal>

      <FAB
        style={styles.fab}
        label="Add New Note"
        onPress={() => setShowModal(true)}
      />
    </View>
  );
};

export default HomeScreen;

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 5,
  },
  fab: {
    position: 'absolute',
    marginBottom: 20,
    right: 10,
    bottom: 0,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
