import { Image, View, Pressable, Linking, StyleSheet } from 'react-native';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 5,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  description: {
    marginTop: 5,
    marginBottom: 8,
  },
  language: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
  },
  languageText: {
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  githubButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 18,
  },
  githubText: {
    color: '#fff',
  },
});

const formatCount = (count) =>
  count >= 1000
    ? `${Number((count / 1000).toFixed(1))}k`
    : String(count);

const Stat = ({ value, label }) => (
  <View style={styles.stat}>
    <Text fontWeight="bold">{formatCount(value)}</Text>
    <Text color="textSecondary">{label}</Text>
  </View>
);

const RepositoryItem = ({ item, showGitHubButton = false }) => (
  <View style={styles.container} testID="repositoryItem">
    <View style={styles.top}>
      <Image
        source={{ uri: item.ownerAvatarUrl }}
        style={styles.avatar}
      />

      <View style={styles.details}>
        <Text fontWeight="bold" fontSize="subheading">
          {item.fullName}
        </Text>

        <Text color="textSecondary" style={styles.description}>
          {item.description}
        </Text>

        <View style={styles.language}>
          <Text style={styles.languageText}>{item.language}</Text>
        </View>
      </View>
    </View>

    <View style={styles.stats}>
      <Stat value={item.stargazersCount} label="Stars" />
      <Stat value={item.forksCount} label="Forks" />
      <Stat value={item.reviewCount} label="Reviews" />
      <Stat value={item.ratingAverage} label="Rating" />
    </View>

    {showGitHubButton && item.url && (
      <Pressable
        style={styles.githubButton}
        onPress={() => Linking.openURL(item.url)}
      >
        <Text fontWeight="bold" style={styles.githubText}>
          Open in GitHub
        </Text>
      </Pressable>
    )}
  </View>
);

export default RepositoryItem;
