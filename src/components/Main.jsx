import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';

import RepositoryList from './RepositoryList';
import SingleRepository from './SingleRepository';
import CreateReview from './CreateReview';
import MyReviews from './MyReviews';
import SignUp from './SignUp';
import AppBar from './AppBar';
import SignIn from './SignIn';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flex: 1,
  },
});

const Main = () => (
  <View style={styles.container}>
    <AppBar />

    <Routes>
      <Route path="/" element={<RepositoryList />} />
      <Route path="/repository/:id" element={<SingleRepository />} />
      <Route path="/review" element={<CreateReview />} />
      <Route path="/myreviews" element={<MyReviews />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </View>
);

export default Main;
