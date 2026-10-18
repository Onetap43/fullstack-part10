import { useQuery } from '@apollo/client/react';

import {
  GET_REPOSITORIES,
  GET_REPOSITORIES_HIGHEST,
  GET_REPOSITORIES_LOWEST,
} from '../graphql/queries';

const useRepositories = ({ sortBy = 'latest', searchKeyword = '' } = {}) => {
  let query = GET_REPOSITORIES;

  if (sortBy === 'highest') {
    query = GET_REPOSITORIES_HIGHEST;
  } else if (sortBy === 'lowest') {
    query = GET_REPOSITORIES_LOWEST;
  }

  const { data, loading, error, refetch } = useQuery(query, {
    variables: { searchKeyword },
    fetchPolicy: 'cache-and-network',
  });

  return {
    repositories: data?.repositories,
    loading,
    error,
    refetch,
  };
};

export default useRepositories;
