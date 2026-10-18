import { render, screen, within } from '@testing-library/react-native';
import { RepositoryListContainer } from '../components/RepositoryList';

describe('RepositoryListContainer', () => {
  it('renders repository information correctly', async () => {
    const repositories = {
      totalCount: 8,
      pageInfo: {
        hasNextPage: true,
        endCursor: 'cursor2',
        startCursor: 'cursor1',
      },
      edges: [
        {
          node: {
            id: 'jaredpalmer.formik',
            fullName: 'jaredpalmer/formik',
            description: 'Build forms in React, without the tears',
            language: 'TypeScript',
            forksCount: 1619,
            stargazersCount: 21856,
            ratingAverage: 88,
            reviewCount: 3,
            ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
          },
        },
        {
          node: {
            id: 'async-library.react-async',
            fullName: 'async-library/react-async',
            description: 'Flexible promise-based React data loader',
            language: 'JavaScript',
            forksCount: 69,
            stargazersCount: 1760,
            ratingAverage: 72,
            reviewCount: 3,
            ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/54310907?v=4',
          },
        },
      ],
    };

    await render(<RepositoryListContainer repositories={repositories} />);

    const items = screen.getAllByTestId('repositoryItem');
    expect(items).toHaveLength(2);

    const first = within(items[0]);
    expect(first.getByText('jaredpalmer/formik')).toBeTruthy();
    expect(first.getByText('Build forms in React, without the tears')).toBeTruthy();
    expect(first.getByText('TypeScript')).toBeTruthy();
    expect(first.getByText('21.9k')).toBeTruthy();
    expect(first.getByText('1.6k')).toBeTruthy();
    expect(first.getByText('3')).toBeTruthy();
    expect(first.getByText('88')).toBeTruthy();

    const second = within(items[1]);
    expect(second.getByText('async-library/react-async')).toBeTruthy();
    expect(second.getByText('Flexible promise-based React data loader')).toBeTruthy();
    expect(second.getByText('JavaScript')).toBeTruthy();
    expect(second.getByText('1.8k')).toBeTruthy();
    expect(second.getByText('69')).toBeTruthy();
    expect(second.getByText('3')).toBeTruthy();
    expect(second.getByText('72')).toBeTruthy();
  });
});
