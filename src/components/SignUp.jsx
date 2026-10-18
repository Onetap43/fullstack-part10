import { useState } from 'react';
import { ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-native';

import { CREATE_USER } from '../graphql/mutations';
import useSignIn from '../hooks/useSignIn';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
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
  username: yup.string()
    .required('Username is required')
    .min(5, 'Username must have at least 5 characters')
    .max(30, 'Username must have at most 30 characters'),
  password: yup.string()
    .required('Password is required')
    .min(5, 'Password must have at least 5 characters')
    .max(50, 'Password must have at most 50 characters'),
  passwordConfirmation: yup.string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const SignUp = () => {
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError('');

      try {
        const username = values.username.trim();
        const password = values.password;

        const response = await createUser({
          variables: { username, password },
        });

        if (!response.data?.createUser?.id) {
          throw new Error('User registration failed');
        }

        await signIn({ username, password });
        navigate('/', { replace: true });
      } catch (error) {
        setServerError(error.message || 'Sign up failed');
      }
    },
  });

  const fields = [
    { name: 'username', placeholder: 'Username' },
    { name: 'password', placeholder: 'Password', secure: true },
    {
      name: 'passwordConfirmation',
      placeholder: 'Password confirmation',
      secure: true,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {fields.map((field) => {
        const error = formik.touched[field.name] && formik.errors[field.name];

        return (
          <ReactInput
            key={field.name}
            field={field}
            value={formik.values[field.name]}
            error={error}
            onChangeText={formik.handleChange(field.name)}
            onBlur={formik.handleBlur(field.name)}
          />
        );
      })}

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <Pressable
        style={styles.button}
        onPress={formik.handleSubmit}
        disabled={loading || formik.isSubmitting}
      >
        <Text fontWeight="bold" style={styles.buttonText}>
          {loading ? 'Creating account...' : 'Sign up'}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const ReactInput = ({ field, value, error, onChangeText, onBlur }) => (
  <>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder={field.placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      secureTextEntry={field.secure || false}
      autoCapitalize="none"
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </>
);

export default SignUp;
