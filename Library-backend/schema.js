

const typeDefs = `
type Subscription {
    bookAdded: Book!
  }    
  type Query {
    dummy: Int
    bookCount: Int!
  authorCount: Int!
  allBooks(author: String, genre: String):[Book]
  allAuthors:[Author]!
  me: User

  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]
  }
  type Author{
    name: String!
    born: Int
    authorOf: [Book]!
    bookCount: Int!
    id: ID!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type Mutation{
    addBook(
    title: String!
    published: Int!
    author: String!
    genres: [String]
    ):Book
    editAuthor(
      name: String!
      setBornTo: Int
    ):Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ):Token
  }
  
`
module.exports = typeDefs