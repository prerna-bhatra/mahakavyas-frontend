import { StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function TabOneScreen() {

  const [data, setData] = useState(null);
  const [purans, setPurans] = useState([])


  const navigation = useNavigation();

  useEffect(() => {
    // Make the API call when the component mounts
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const response = await fetch('https://doubtful-pear-squid.cyclic.cloud/puran/');
      // console.log({ response });

      const jsonData = await response.json();
      // console.log({ jsonData });

      setPurans(jsonData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleItemPress = (_id: any) => {
    // Navigate to a new screen and pass the _id as a parameter
    navigation.navigate('two', { itemId: _id })
  };

  return (
    <View style={styles.container}>
      <Text >Purans</Text>
      <ScrollView >
      {purans.length > 0 && purans.map((item: any) => (
     
        <TouchableOpacity
          key={item._id}
          style={styles.itemContainer}
          onPress={() => handleItemPress(item._id)}
        >
          <View style={styles.itemContainer} >
            <Text style={styles.name}>{item.name}</Text>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
              </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  name: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
