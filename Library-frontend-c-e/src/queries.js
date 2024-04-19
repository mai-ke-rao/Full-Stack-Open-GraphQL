import { gql } from '@apollo/client'


const BOOK_DETAILS = gql`
fragment BookDetails on Book{
    title
    author{
      name
      born
    }
    published
    genres
    } 
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
  }
}
`

export const ALL_BOOKS = gql`
query allBooks($genre: String) {
  allBooks(genre: $genre) {
  ...BookDetails
}
}
${BOOK_DETAILS}
`

export const BOOK_GENRES= gql`
query{ 
  allBooks{
  genres
  }
}`

export const ME = gql`
query {
  me{
       username
    id
    favoriteGenre
    }
}`
export const ADD_BOOK = gql`
mutation addBook($title:String!, $author: String!, $published: Int!,$genres: [String]){
    addBook(title: $title,
        author: $author,
        published: $published,
        genres: $genres
        ){
              ...BookDetails
        }
}
${BOOK_DETAILS}
`

export const BOOK_CREATED = gql`
subscription{
    bookAdded{
        ...BookDetails
    }
}
${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int){
  editAuthor(name: $name,
    setBornTo: $setBornTo){
      name
      born
  
    }
}`

export const CREATE_USER =  gql`
mutation createUser($username:String!, $favoriteGenre: String!){
  createUser(username: $username,
      favoriteGenre:  $favoriteGenre
      ){
          username
          favoriteGenre
          id
      }
}`

export const LOGIN = gql`
mutation login($username:String!, $password: String!){
  login(username: $username,
  password: $password){
    value
  }
}`
