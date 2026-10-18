import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-native';
import * as yup from 'yup';

import Text from './Text';
import theme from '../theme';
import useSignIn from '../hooks/useSignIn';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5da',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  inputError: {
    borderColor: '#d73a4a',
  },
  error: {
    color: '#d73a4a',
    marginBottom: 12,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
  },
});

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignIn = () => {
  const [signIn, result] = useSignIn();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError('');

      try {
        await signIn(values);
        console.log('Sign in successful');
        navigate('/', { replace: true });
      } catch (error) {
        setServerError(error.message || 'Sign in failed');
      }
    },
  });

  const usernameError =
    formik.touched.username && formik.errors.username;

  const passwordError =
    formik.touched.password && formik.errors.password;

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, usernameError && styles.inputError]}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur('username')}
        autoCapitalize="none"
      />

      {usernameError && (
        <Text style={styles.error}>{formik.errors.username}</Text>
      )}

      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        secureTextEntry
      />

      {passwordError && (
        <Text style={styles.error}>{formik.errors.password}</Text>
      )}

      {serverError ? (
        <Text style={styles.error}>{serverError}</Text>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={formik.handleSubmit}
        disabled={result.loading}
      >
        <Text fontWeight="bold" style={styles.buttonText}>
          {result.loading ? 'Signing in...' : 'Sign in'}
        </Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
