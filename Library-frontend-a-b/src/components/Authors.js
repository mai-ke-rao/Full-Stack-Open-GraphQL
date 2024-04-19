import {gql, useMutation, useQuery} from "@apollo/client"
import{EDIT_AUTHOR, ALL_AUTHORS} from '../queries'
import Select from 'react-select';
import { useState } from 'react'


const Authors = (props) => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [born, setBorn] = useState(null)
  const [changed] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}]
   })

  if (!props.show) {
    return null
  }

 
  const authors = [...props.authors]
 var options = [];

authors.forEach(author => 
  options.push({value: author.name, label: author.name}))

  console.log(options);

 const submit = async(event) => {
  event.preventDefault()
  changed({variables: {name: selectedOption.value, setBornTo: Number(born)}})


  setSelectedOption(null)
  setBorn(null)
 }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set author birthyear</h2>
      <form onSubmit={submit}>
       <div>
        Author: 
        <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
       </div>
       <div>
        Born: <input value={born} onChange={({target}) => setBorn(target.value)}>
        </input>
       </div>
       <div>
        <button type="submit">update author</button>
       </div>
      </form>
    </div>
  )
}

export default Authors
