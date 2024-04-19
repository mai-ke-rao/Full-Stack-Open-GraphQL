import { useState } from "react";
import {ALL_BOOKS, ME} from '../queries'
import { gql, useQuery } from '@apollo/client'


const Recommenations = ({show}) => {
  const userQ = useQuery(ME)
  const booksQ = useQuery(ALL_BOOKS,);
if(userQ.loading){
  return(
    <div>Loading</div>
  )
}
    const favGenre = userQ.data.me.favoriteGenre;
    


if(!show)
{
    return null
}







  if(booksQ.loading)
  {
      return (
          <div>
              LOADING
          </div>
      )
  }

console.log("Books: ", booksQ.data.allBooks);
console.log("Fav Genre: ", userQ.data.me.favoriteGenre);
//const books = booksQ.data.allBooks.filter((element) => element.genres.includes(userQ.data.me.favoriteGenre)? element:null)
//console.log("rec books: ",books);

return(
    <div>
    <h2>books</h2>

    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {booksQ.data.allBooks.map((a) => (
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        ))}
        </tbody>
      </table>
        </div>
)

}
export default Recommenations





