import { FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client/react';

import { GET_REPOSITORY } from '../graphql/queries';
import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem';
import Text from './Text';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  message: {
    padding: 20,
  },
  header: {
    marginBottom: 10,
  },
});

const Separator = () => <View style={styles.separator} />;

const SingleRepository = () => {
  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_REPOSITORY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  if (error) {
    return <Text style={styles.message}>Error: {error.message}</Text>;
  }

  const repository = data?.repository;

  if (loading && !repository) {
    return <ActivityIndicator size="large" style={styles.message} />;
  }

  if (!repository) {
    return <Text style={styles.message}>Repository not found</Text>;
  }

  const reviews = repository.reviews.edges.map((edge) => edge.node);

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReviewItem review={item} />}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={
        <View style={styles.header}>
          <RepositoryItem item={repository} showGitHubButton />
        </View>
      }
    />
  );
};

export default SingleRepository;
