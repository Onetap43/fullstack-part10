import { View, StyleSheet } from 'react-native';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
  },
  rating: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  date: {
    marginVertical: 4,
  },
  reviewText: {
    marginTop: 4,
  },
});

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const ReviewItem = ({ review }) => (
  <View style={styles.container}>
    <View style={styles.rating}>
      <Text fontWeight="bold" style={styles.ratingText}>
        {review.rating}
      </Text>
    </View>

    <View style={styles.content}>
      <Text fontWeight="bold" fontSize="subheading">
        {review.user.username}
      </Text>

      <Text color="textSecondary" style={styles.date}>
        {formatDate(review.createdAt)}
      </Text>

      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  </View>
);

export default ReviewItem;
