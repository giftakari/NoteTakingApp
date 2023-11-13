import React, {useState} from 'react';
import { Alert, View } from "react-native";
import { Button, Text, TextInput, Divider } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

export default function EditScreen({navigation, route}) {
  const {note, categories, saveNotes, setNotes} = route.params;

  const [editedNote, setEditedNote] = useState(note);

  const saveChanges = () => {
    if (editedNote.client && editedNote.category && editedNote.text) {
      setNotes(prevNotes => {
        // Replace the edited note within the notes array
        const updatedNotes = prevNotes.map(prevNote => {
          if (prevNote === note) {
            return editedNote; // Update the edited note
          }
          return prevNote;
        });
        saveNotes(updatedNotes); // Persist updated notes to AsyncStorage
        return updatedNotes;
      });
      navigation.navigate('Home');
    } else {
      Alert.alert('Client, Category, and Note are required to save changes');
    }
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        label="Client"
        placeholder="Client"
        value={editedNote.client}
        onChangeText={client => setEditedNote({ ...editedNote, client })}
      />
      <SelectDropdown
        data={categories}
        onSelect={(selectedItem, index) => {
          setEditedNote({ ...editedNote, category: selectedItem });
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
        value={editedNote.text}
        onChangeText={text => setEditedNote({ ...editedNote, text })}
      />
      <Divider />
      <Button mode="outlined" onPress={saveChanges}>
        Save Changes
      </Button>
    </View>
  );
}
