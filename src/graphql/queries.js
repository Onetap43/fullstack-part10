import { gql } from '@apollo/client';

const REPOSITORY_FIELDS = gql`
  fragment RepositoryFields on Repository {
    id
    fullName
    description
    language
    stargazersCount
    forksCount
    reviewCount
    ratingAverage
    ownerAvatarUrl
  }
`;

export const GET_REPOSITORIES = gql`
  query GetRepositories($searchKeyword: String) {
    repositories(
      orderBy: CREATED_AT
      orderDirection: DESC
      searchKeyword: $searchKeyword
    ) {
      edges {
        node {
          ...RepositoryFields
        }
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;

export const GET_REPOSITORIES_HIGHEST = gql`
  query GetRepositoriesHighest($searchKeyword: String) {
    repositories(
      orderBy: RATING_AVERAGE
      orderDirection: DESC
      searchKeyword: $searchKeyword
    ) {
      edges {
        node {
          ...RepositoryFields
        }
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;

export const GET_REPOSITORIES_LOWEST = gql`
  query GetRepositoriesLowest($searchKeyword: String) {
    repositories(
      orderBy: RATING_AVERAGE
      orderDirection: ASC
      searchKeyword: $searchKeyword
    ) {
      edges {
        node {
          ...RepositoryFields
        }
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;

export const GET_ME = gql`
  query GetMe($includeReviews: Boolean = false) {
    me {
      id
      username
      reviews @include(if: $includeReviews) {
        edges {
          node {
            id
            repositoryId
            text
            rating
            createdAt
          }
        }
      }
    }
  }
`;

export const GET_REPOSITORY = gql`
  query GetRepository($id: ID!) {
    repository(id: $id) {
      ...RepositoryFields
      url
      reviews {
        edges {
          node {
            id
            text
            rating
            createdAt
            user {
              id
              username
            }
          }
        }
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;
