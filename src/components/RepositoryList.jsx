import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  message: {
    padding: 20,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({ repositories }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RepositoryItem item={item} />}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

const RepositoryList = () => {
  const { repositories, loading, error } = useRepositories();

  if (error) {
    return <Text style={styles.message}>Error: {error.message}</Text>;
  }

  if (loading && !repositories) {
    return <ActivityIndicator size="large" style={styles.message} />;
  }

  return <RepositoryListContainer repositories={repositories} />;
};

export default RepositoryList;
