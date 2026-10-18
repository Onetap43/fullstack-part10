import { useState } from 'react';
import {
  FlatList,
  View,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigate } from 'react-router-native';
import { useDebounce } from 'use-debounce';

import RepositoryItem from './RepositoryItem';
import Text from './Text';
import useRepositories from '../hooks/useRepositories';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  message: {
    padding: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5da',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 15,
  },
  heading: {
    marginBottom: 10,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#edf0f3',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
  },
  sortText: {
    fontSize: 12,
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'highest', label: 'Highest rated' },
  { value: 'lowest', label: 'Lowest rated' },
];

const RepositoryListHeader = ({
  sortBy,
  onSortChange,
  searchKeyword,
  onSearchChange,
}) => (
  <View style={styles.header}>
    <TextInput
      style={styles.searchInput}
      placeholder="Search repositories..."
      value={searchKeyword}
      onChangeText={onSearchChange}
      autoCapitalize="none"
      autoCorrect={false}
    />

    <Text fontWeight="bold" style={styles.heading}>
      Sort repositories
    </Text>

    <View style={styles.sortRow}>
      {sortOptions.map((option) => {
        const selected = sortBy === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSortChange(option.value)}
            style={[
              styles.sortButton,
              selected && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.sortText,
                selected && styles.selectedText,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

export const RepositoryListContainer = ({
  repositories,
  onRepositoryPress,
  sortBy = 'latest',
  onSortChange = () => {},
  searchKeyword = '',
  onSearchChange = () => {},
}) => {
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
      ListHeaderComponent={
        <RepositoryListHeader
          sortBy={sortBy}
          onSortChange={onSortChange}
          searchKeyword={searchKeyword}
          onSearchChange={onSearchChange}
        />
      }
      ListEmptyComponent={
        <Text style={styles.message}>No repositories found</Text>
      }
      keyboardShouldPersistTaps="handled"
    />
  );
};

const RepositoryList = () => {
  const [sortBy, setSortBy] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [debouncedSearch] = useDebounce(searchKeyword, 500);

  const { repositories, loading, error } = useRepositories({
    sortBy,
    searchKeyword: debouncedSearch.trim(),
  });

  const navigate = useNavigate();

  if (error) {
    return <Text style={styles.message}>Error: {error.message}</Text>;
  }

  const handleRepositoryPress = (id) => {
    navigate(`/repository/${encodeURIComponent(id)}`);
  };

  return (
    <>
      <RepositoryListContainer
        repositories={repositories}
        onRepositoryPress={handleRepositoryPress}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
      />

      {loading && (
        <ActivityIndicator
          size="small"
          style={styles.message}
        />
      )}
    </>
  );
};

export default RepositoryList;
