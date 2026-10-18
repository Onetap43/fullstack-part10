import { useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-native';

import { GET_ME } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';
import ReviewItem from './ReviewItem';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 10,
  },
  message: {
    padding: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: '#d73a4a',
  },
  buttonText: {
    color: '#fff',
  },
});

const formatRepositoryName = (id) => {
  if (!id) return 'Repository';

  const dot = id.indexOf('.');
  if (dot === -1) return id;

  return `${id.slice(0, dot)}/${id.slice(dot + 1)}`;
};

const MyReviews = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteReview, { loading: deleting }] = useMutation(DELETE_REVIEW);

  const reviews = data?.me?.reviews?.edges.map((edge) => edge.node) || [];

  const handleDelete = async (id) => {
    setErrorMessage('');

    try {
      await deleteReview({ variables: { id } });
      await refetch();
    } catch (err) {
      setErrorMessage(err.message || 'Could not delete review');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void handleDelete(id);
          },
        },
      ]
    );
  };

  if (error) {
    return <Text style={styles.message}>Error: {error.message}</Text>;
  }

  if (loading && !data) {
    return <ActivityIndicator size="large" style={styles.message} />;
  }

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.message}>{errorMessage}</Text>
      ) : null}

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.message}>You have not written any reviews yet.</Text>
        }
        renderItem={({ item }) => (
          <View>
            <ReviewItem
              review={item}
              title={formatRepositoryName(item.repositoryId)}
            />

            <View style={styles.actions}>
              <Pressable
                style={[styles.button, styles.viewButton]}
                onPress={() => navigate(
                  `/repository/${encodeURIComponent(item.repositoryId)}`
                )}
              >
                <Text fontWeight="bold" style={styles.buttonText}>
                  View repository
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.deleteButton]}
                onPress={() => confirmDelete(item.id)}
                disabled={deleting}
              >
                <Text fontWeight="bold" style={styles.buttonText}>
                  Delete review
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MyReviews;
