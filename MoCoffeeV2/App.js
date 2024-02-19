import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// supabase: https://klkbsgrcrnwkdwbwhidl.supabase.co
// API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa2JzZ3Jjcm53a2R3YndoaWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgzMjc4NjUsImV4cCI6MjAyMzkwMzg2NX0.lgBJIvBqHEo7lHYvfFQ8ePE2AsQXKTiknlwBPyu9lEQ
