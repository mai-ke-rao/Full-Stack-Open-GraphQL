import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import BooksByGenre from './components/BooksByGenre'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { gql, useQuery, useApolloClient, useSubscription } from '@apollo/client'
import {ALL_AUTHORS, ME, BOOK_CREATED, ALL_BOOKS} from './queries'
import './App.css'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {  
  // helper that is used to eliminate saving same person twice 
  console.log("Book addded is: ",addedBook); 

cache.updateQuery(query, ({ allBooks }) => {   
  console.log("allBooks are: ",allBooks);
  const newFinal = [...allBooks, addedBook]
   return {      
    allBooks: newFinal,  
    }  
  })}

const App = () => {

  const [page, setPage] = useState('books')
  const [errorMessage, setErrorMessage] = useState(null)
  const [Token, setToken] = useState(null)
  const client = useApolloClient()
  const[genre, setGenre] = useState('')

 
  const result =  useQuery(ALL_BOOKS,)

  /*useEffect(() => {
    if(page == 'recommendations'){
      return(
        
        <Recommendations show={page === 'recommendations'} />
    
      )
    }
   
   }, [page]);*/
  
  useSubscription(BOOK_CREATED, {
    onData: ({data, client}) => {
      console.log(data)
      const bookCreated = data.data.bookAdded
      notify(`${bookCreated.title} added`)

      updateCache(client.cache, { query: ALL_BOOKS}, bookCreated)
      
    },
  })

if(result.loading){
  return (
    <div>loading</div>
  )
}


const logout = () => {
  setToken(null)
  localStorage.clear()
  client.resetStore()
}

  const notify = (message) => {   
    setErrorMessage(message)    
    setTimeout(() => {      
     setErrorMessage(null) 
      }, 10000)  }



      

  
  return (
    <div>
      <div style={{position: 'relative'}}> 
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')} className={Token?'seeMe':'dontSeeMe'}>add book</button>
        <button onClick={() => setPage('login')} className={Token?'dontSeeMe':'seeMe'}>login</button>
        <buttton onClick={()=> setPage('recommendations')} className={Token?'seeMe':'dontSeeMe'} id={'logout'}>recommendations</buttton>
        <buttton onClick={()=> logout()} className={Token?'seeMe':'dontSeeMe'} id={'logout'}>logout</buttton>
      </div>

      
      <Notify errorMessage={errorMessage} /> 
      <Authors show={page === 'authors'} authors={result.data.allAuthors}/>
      
      <BooksByGenre show={page === 'books'} genre={genre} setGenre={setGenre}  />
      {page == 'recommendations'? <Recommendations show={page === 'recommendations'} /> : <div></div>}

      <NewBook show={page === 'add'} setError={notify}/>

      <LoginForm  show={page === 'login'} setError={notify} setToken={setToken}/>
    </div>
  )


}


const Notify = ({errorMessage}) => {  
  if ( !errorMessage ) 
  {    return null  }  
  return (    
  <div style={{color: 'red'}}>    {errorMessage}    </div> 
   )}

export default App
