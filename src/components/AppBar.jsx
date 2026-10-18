import { ScrollView, Pressable, StyleSheet } from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import { useQuery, useApolloClient } from '@apollo/client/react';

import { GET_ME } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#24292e',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  tab: {
    marginHorizontal: 12,
    color: '#fff',
  },
});

const AppBar = () => {
  const { data } = useQuery(GET_ME, { fetchPolicy: 'cache-and-network' });
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
    navigate('/', { replace: true });
  };

  return (
    <ScrollView
      horizontal
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      <Link to="/">
        <Text fontWeight="bold" style={styles.tab}>Repositories</Text>
      </Link>

      {data?.me ? (
        <>
          <Link to="/review">
            <Text fontWeight="bold" style={styles.tab}>Create a review</Text>
          </Link>

          <Link to="/myreviews">
            <Text fontWeight="bold" style={styles.tab}>My reviews</Text>
          </Link>

          <Pressable onPress={handleSignOut}>
            <Text fontWeight="bold" style={styles.tab}>Sign out</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Link to="/signin">
            <Text fontWeight="bold" style={styles.tab}>Sign in</Text>
          </Link>

          <Link to="/signup">
            <Text fontWeight="bold" style={styles.tab}>Sign up</Text>
          </Link>
        </>
      )}
    </ScrollView>
  );
};

export default AppBar;
