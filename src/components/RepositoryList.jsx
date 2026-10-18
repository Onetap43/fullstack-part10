import { FlatList, View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigate } from 'react-router-native';

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

export const RepositoryListContainer = ({ repositories, onRepositoryPress }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => onRepositoryPress?.(item.id)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

const RepositoryList = () => {
  const { repositories, loading, error } = useRepositories();
  const navigate = useNavigate();

  if (error) {
    return <Text style={styles.message}>Error: {error.message}</Text>;
  }

  if (loading && !repositories) {
    return <ActivityIndicator size="large" style={styles.message} />;
  }

  const handleRepositoryPress = (id) => {
    navigate(`/repository/${encodeURIComponent(id)}`);
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onRepositoryPress={handleRepositoryPress}
    />
  );
};

export default RepositoryList;
