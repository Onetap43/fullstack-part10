import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import { useQuery, useApolloClient } from '@apollo/client/react';
import Constants from 'expo-constants';

import Text from './Text';
import theme from '../theme';
import { GET_ME } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';

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
  const { data } = useQuery(GET_ME, {
    fetchPolicy: 'cache-and-network',
  });

  const apolloClient = useApolloClient();
  const authStorage = useAuthStorage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authStorage.removeAccessToken();
      await apolloClient.resetStore();
      navigate('/', { replace: true });
    } catch (error) {
      console.log('Sign out failed:', error.message);
    }
  };

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

        {data?.me ? (
          <Pressable style={styles.tab} onPress={handleSignOut}>
            <Text fontWeight="bold" style={styles.text}>
              Sign out
            </Text>
          </Pressable>
        ) : (
          <Link to="/signin" style={styles.tab}>
            <Text fontWeight="bold" style={styles.text}>
              Sign in
            </Text>
          </Link>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;
