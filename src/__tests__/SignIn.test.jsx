import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import SignInContainer from '../components/SignInContainer';

describe('SignInContainer', () => {
  it('submits correct username and password', async () => {
    const onSubmit = jest.fn();

    await render(<SignInContainer onSubmit={onSubmit} />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Username'),
      'kalle'
    );

    await fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'password'
    );

    await fireEvent.press(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toEqual({
        username: 'kalle',
        password: 'password',
      });
    });
  });
});
