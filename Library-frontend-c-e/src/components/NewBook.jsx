import { useState } from 'react'
import {  gql, useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries'
import { updateCache } from '../App'
const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState()
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  
  
  const [ addBook ] = useMutation(ADD_BOOK, {
    //refetching Queries is done only on client giving Add Book request which is insufficent.
    /*refetchQueries: [ { query: ALL_BOOKS }, {query: ALL_AUTHORS} ],*/
    onError: (error) => {      
      const messages = error.graphQLErrors.map(e => e.message).join('\n')      
      props.setError(messages)    },
      update: (cache, response) => {
        updateCache(cache, { query: ALL_BOOKS}, response.data.addBook)  
      },
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
      addBook({variables: {title, author, published, genres}})
    console.log('add book...')

    setTitle('')
    setPublished()
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value.split(/[ ,]+/))}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook