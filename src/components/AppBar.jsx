import { View, Pressable, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  tab: {
    paddingTop: 16,
  },
  title: {
    color: '#fff',
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.tab}>
        <Text fontWeight="bold" style={styles.title}>
          Repositories
        </Text>
      </Pressable>
    </View>
  );
};

export default AppBar;
