import { View, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import Constants from 'expo-constants';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tab: {
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  text: {
    color: '#fff',
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        <Link to="/" style={styles.tab}>
          <Text fontWeight="bold" style={styles.text}>
            Repositories
          </Text>
        </Link>

        <Link to="/signin" style={styles.tab}>
          <Text fontWeight="bold" style={styles.text}>
            Sign in
          </Text>
        </Link>
      </ScrollView>
    </View>
  );
};

export default AppBar;
