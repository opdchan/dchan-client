import { gql } from "apollo-boost";

const CATALOG = gql`
  fragment Post on Post {
    id
    n
    from {
      id
    }
    name
    comment
    image {
      id
      name
      byteSize
      ipfsHash
      score
      isSpoiler
      isNsfw
    }
    createdAt
  }

  fragment Thread on Thread {
    id
    isPinned
    isLocked
    op {
      ...Post
    }
    subject
    replyCount
    imageCount
    score
    createdAtBlock
  }
  
  query ThreadList($boardId: String!, $limit: Int!) {
    board(id: $boardId) {
      id
      title
      postCount
      name
      isLocked
      isNsfw
      lastBumpedAt
      createdAtBlock
      jannies {
        user {
          address
        }
      }
    }
    pinned: threads(where: {board: $boardId, isPinned: true}, orderBy: lastBumpedAt, orderDirection: desc) {
      ...Thread
    }
    threads(where: {board: $boardId, isPinned: false}, orderBy: lastBumpedAt, orderDirection: desc, first: $limit) {
      ...Thread
    }
  }
`;

export default CATALOG