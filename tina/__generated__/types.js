export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const HomePartsFragmentDoc = gql`
    fragment HomeParts on Home {
  __typename
  name
  tagline
  work {
    __typename
    title
    role
    companies
  }
  canopyTitle
  projects {
    __typename
    title
    company
    preview
    caseSlug
  }
  thoughtsTitle
  thoughtsNote
  thoughts {
    __typename
    title
    image
  }
  contact {
    __typename
    label
    href
  }
}
    `;
export const CaseStudyPartsFragmentDoc = gql`
    fragment CaseStudyParts on CaseStudy {
  __typename
  slug
  locked
  title
  subtitle
  hero {
    __typename
    src
    alt
  }
  index
  body {
    __typename
    style
    text
  }
  cards {
    __typename
    src
    alt
  }
  closing
  sections {
    __typename
    title
    media {
      __typename
      image
      video
      alt
    }
    body
    stats {
      __typename
      value
      label
    }
  }
}
    `;
export const HomeDocument = gql`
    query home($relativePath: String!) {
  home(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HomeParts
  }
}
    ${HomePartsFragmentDoc}`;
export const HomeConnectionDocument = gql`
    query homeConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HomeFilter) {
  homeConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HomeParts
      }
    }
  }
}
    ${HomePartsFragmentDoc}`;
export const CaseStudyDocument = gql`
    query caseStudy($relativePath: String!) {
  caseStudy(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...CaseStudyParts
  }
}
    ${CaseStudyPartsFragmentDoc}`;
export const CaseStudyConnectionDocument = gql`
    query caseStudyConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: CaseStudyFilter) {
  caseStudyConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...CaseStudyParts
      }
    }
  }
}
    ${CaseStudyPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    home(variables, options) {
      return requester(HomeDocument, variables, options);
    },
    homeConnection(variables, options) {
      return requester(HomeConnectionDocument, variables, options);
    },
    caseStudy(variables, options) {
      return requester(CaseStudyDocument, variables, options);
    },
    caseStudyConnection(variables, options) {
      return requester(CaseStudyConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
