
import { useQuery } from '@apollo/client'
import { BOOK_GENRES, ALL_BOOKS } from '../queries'

const BooksByGenre = ({show, genre, setGenre}) => {

const result = useQuery(BOOK_GENRES)
const result_books = useQuery(ALL_BOOKS, {
    variables: genre == 'all' ? null : {genre},
    skip: genre == ''
  } )

  var books = []
if(!show){
    return null;
}

if(result.loading)
{
    return(
        <div>
            Loading
        </div>
    )
}
if(result_books.loading)
{
    return(
        <div>
            Loading Books
        </div>
    )
}
if(result_books.data){
books = [...result_books.data.allBooks]
}
var bookies = []
bookies = [...result.data.allBooks]
var allGenres = []
var GenresDS = []


const uniqueGenres = (bookies) => { 
let seen = new Set()
const retura = []
bookies.forEach((book) => {  retura.push(book.genres.filter((element) => { let k = element 
       return seen.has(k) ? false : seen.add(k)  }))})
       return retura
}

allGenres = uniqueGenres(bookies)
  allGenres = allGenres.filter(el => el.length !== 0)
  allGenres.forEach(genre => genre.map(el => GenresDS.push(el)))

console.log("GenresDS: ", GenresDS);


  if(genre == '')  
return(
        <div>
             <h2>books</h2>
            <table>
                <tbody>
                
                <tr>
                {GenresDS.map((element) => (
  
  <button onClick={ () =>{ 
                         result_books.refetch({genre:element})
                         setGenre(element)}}>{element}</button>

))}
<button onClick={ () => {
                    result_books.refetch({genre:null})
                    setGenre('all')}}>all genres</button>
        </tr>
                </tbody>
            </table>
        </div>
    )
    else{
        return(
        <div>
             <h2>books</h2>
        <table>
            <tbody>
                <tr>
                {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
                </tr>
            <tr>
      {GenresDS.map((element) => (
  
          <button onClick={() =>{result_books.refetch({genre:element})
          setGenre(element)}}>{element}</button>
        
      ))}
      <button onClick={() => {result_books.refetch({genre:null})
    setGenre('all')}}>all genres</button>
    </tr>
   
            </tbody>
        </table>
    </div>
    )}
}

export default BooksByGenre