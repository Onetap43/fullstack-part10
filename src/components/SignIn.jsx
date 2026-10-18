import { useState } from 'react';
import { useNavigate } from 'react-router-native';

import SignInContainer from './SignInContainer';
import useSignIn from '../hooks/useSignIn';

const SignIn = () => {
  const [signIn, result] = useSignIn();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (values) => {
    setServerError('');

    try {
      await signIn(values);
      console.log('Sign in successful');
      navigate('/', { replace: true });
    } catch (error) {
      setServerError(error.message || 'Sign in failed');
    }
  };

  return (
    <SignInContainer
      onSubmit={onSubmit}
      loading={result.loading}
      serverError={serverError}
    />
  );
};

export default SignIn;
