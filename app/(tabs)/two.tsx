import { Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeadphones } from '@fortawesome/free-solid-svg-icons';
import * as Speech from 'expo-speech'; // Import the Speech module



export default function TabTwoScreen() {
  const route:any = useRoute();
  const { itemId } = route.params; // Access the itemId from route.params

  const [itemData, setItemData] = useState([]);

  const [expandedIndex, setExpandedIndex] = useState(-1);
  const toggleChapter = (index: any) => {
    if (index === expandedIndex) {
      setExpandedIndex(-1); // Collapse the clicked chapter
    } else {
      setExpandedIndex(index); // Expand the clicked chapter
    }
  };

  useEffect(() => {
    // Fetch data using the itemId

    // Tts.setDefaultLanguage('hi-IN')
    fetchData(itemId);
  }, [itemId]);



  const fetchData = async (id: any) => {
    try {
      const response = await fetch('https://doubtful-pear-squid.cyclic.cloud/puran/chapterByPuran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puranId: itemId
        }),
      });

      const jsonResponse = await response.json();

      setItemData(jsonResponse.data)
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };


  const handleListen = (content: string) => {
    const chunkSize = 2000; // Set the desired chunk size (adjust as needed)
    const chunks = [];

    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }

    playChunksSequentially(chunks);
  };


  const playChunksSequentially = async (chunks: Array<string>) => {
    for (const chunk of chunks) {
      try {
        await Speech.speak(chunk, {
          language: 'hi-IN', // Set the language code for Hindi (India)
          rate: 0.8,
        });
      } catch (error) {
        console.error("Error while playing chunk:", error);
      }
    }
  };

  const handlePause = () => {
    Speech.pause();
  };

  const handleStop = () => {
    Speech.stop();
  };

  return (
    <View style={styles.container}>
      <ScrollView >
        <Text style={styles.title} >Chapters</Text>
        {itemData && itemData?.length > 0 && itemData.map((item: any, index) => (
          <View key={index} style={styles.chapterContainer}>
            <TouchableOpacity onPress={() => toggleChapter(index)}>
              <Text style={styles.chapterTitle}>Chapter {index + 1}</Text>
              <Text style={styles.itemName}>{item.title}
              </Text>

            </TouchableOpacity>
            {expandedIndex === index && (
              <>
                <ScrollView style={styles.itemContentContainer}>
                  {/* <FontAwesomeIcon icon={faHeadphones} style={styles.listenIcon} /> */}
                  <View style={styles.listenButtonContainer}>
                    <Button
                      title="Listen"
                      onPress={() => handleListen(item.content)}
                    />
                    <View style={styles.listenButtonSpacer} />
                    <Button
                      title="Pause"
                      onPress={handlePause}
                    />
                    <View style={styles.listenButtonSpacer} />

                    <Button
                      title="Stop"
                      onPress={handleStop}
                    />
                  </View>
                  <Text >{item.content}</Text>
                </ScrollView>
              </>
            )}
          </View>
        ))}
      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chapterContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16, // Add margin between chapters
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  itemContentContainer: {

  },
  listenIcon: {
    borderColor: 'pink',
    color: 'white',
    fontSize: 16
  },
  // listenIcon: {
  //   marginLeft: 8, // Adjust the spacing between text and icon
  //   fontSize: 16, // Adjust the icon size
  //   color: '#888', // Adjust the icon color
  // },
  listenButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  listenButtonSpacer: {
    width: 10,
  },
  itemName: {
    fontSize: 16,
    marginTop: 4,
  },
});
