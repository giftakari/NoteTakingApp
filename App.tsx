import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import EditScreen from './screens/EditScreen';
import DeleteScreen from './screens/DeleteScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{title: 'Edit'}}
        />
        <Stack.Screen
          name="Delete"
          component={DeleteScreen}
          options={{title: 'Delete'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
