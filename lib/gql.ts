import { REPOSITORY_NAME, REPOSITORY_OWNER } from './contansts'

export function meProfileGql() {
    return `{
    viewer {
      login
      name
      avatarUrl
    }
  }`
}

export function discussionGql() {
    return `{
    repository(owner: "${REPOSITORY_OWNER}", name: "${REPOSITORY_NAME}") {
      discussions(first: 99, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          title
          number
          bodyText
          createdAt
          author {
            login
            url
            avatarUrl
          }
          labels(first: 20) {
            nodes {
              name
            }
          }
        }
      }
    }
  }`
}

export function discussionDetailGql(postId: number) {
    return `{
        repository(owner: "${REPOSITORY_OWNER}", name: "${REPOSITORY_NAME}") {
            discussion(number: ${postId}) {
                title
                body
                createdAt

                author {
                    login
                    url
                    avatarUrl
                }

                labels(first: 20) {
                    nodes {
                        name
                    }
                }

                comments(first: 50) {
                    totalCount

                    nodes {
                        body
                        createdAt

                        author {
                            login
                            avatarUrl
                            url
                        }

                        replies(first: 20) {
                            totalCount

                            nodes {
                                body
                                createdAt

                                author {
                                    login
                                    avatarUrl
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }
    }`
}
