const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/Book')
const Author = require('./models/Authors')
const User = require('./models/User')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const { v1: uuid } = require('uuid')


const resolvers = {
    Query: {
      bookCount: async () => {
        let books = await Book.find({});
        return books.length
      },
      authorCount: async () => {
        const authors = await Author.find({})
        return authors.length},
      allBooks: async (root, args) => {
        //Author mora da se zatrazi iz baze
        let acum = await Book.find({}).populate('author');
        console.log('Acum is', acum);
        //this does not have to work
        if(args.author)
        { 
        
          acum = books.filter(book => book.author === args.author)
  
        }
        if(args.genre)
        {
          
              acum = acum.filter(book => {for(let i=0; i<book.genres.length; i++){
                      if(book.genres[i]===args.genre)
                      {
                        return true
                      }
              }})
             
        }
        
        return acum
      },
      allAuthors: async () =>  {
        console.log("Book.find");
        var books = await Book.find({})
        console.log("Author.find");
       var authors = await Author.find({})
       authors.forEach(author => author.bookCount = 0)
       books.forEach(book => {
       let x = authors.findIndex(author => author.id == book.author);
      authors[x].bookCount++;
       });
       
       return authors
      }
      ,
      me: (root, args, context) => {
        const currentUser = context.currentUser
        console.log("Current user is: ",currentUser);
        return currentUser
      }
    },
    /*Author: {
      //does not have to work yet
      bookCount: async (root) => {
      //author in Book.find context is ID
        let books = await Book.find({author: root._id
         });
        console.log("Book.find");
        console.log("Books by '",root.name,"': ",books);
      
        return root.authorOf.length;
    
      }
    },*/
    Mutation: {
      addBook: async (root, args, context) =>{
  
        const currentUser = context.currentUser
  
        if (!currentUser) {        
          throw new GraphQLError('not authenticated', {          
            extensions: {            code: 'BAD_USER_INPUT',          
          }     
        })   
      } 
        var exist = false
        var author
     
        const existingA = await Author.findOne({name: args.author})
        if(existingA)
        { console.log("adding book with exiting author", existingA);
          exist = true
      }
        if(!exist){
           var id = uuid()
             author = new Author({name: args.author,  id: id})
             try{
              await author.save()
             }catch(error){
              throw new GraphQLError('Invalid Author', {          
                extensions: {            
                  code: 'BAD_USER_INPUT',            
                  invalidArgs: args.author,            
                  error          }        
                })      
             }
     
            
        }
      
        const book = new Book({title: args.title, published: args.published, genres:args.genres, author: exist? existingA.id :author.id})
      try{
     await book.save()
      }catch(error){
        throw GraphQLError('Saving book failed', {          
          extensions: {            
            code: 'BAD_USER_INPUT',            
            invalidArgs: args.title,            
            error          }        
          })      
      }
      const final = await Book.findOne({title: args.title}).populate('author');
      pubsub.publish('BOOK_ADDED', { bookAdded: final })
     //Why make request from database when you have book object? This is hertical workaround
    return final
   // return book
    
       
       
      },
       editAuthor: async (root, args, context) => {
  
        const currentUser = context.currentUser
    console.log("Current User: ",currentUser);
        if (!currentUser) {        
          throw new GraphQLError('not authenticated', {          
            extensions: {            code: 'BAD_USER_INPUT',          
          }     
        })   
      } 
  
          const newAuthor = await Author.findOne({name: args.name})
          newAuthor.born = args.setBornTo
            await Author.replaceOne({name:args.name}, newAuthor)
             
               return newAuthor
            },
            createUser: async (root, args) => {
              const user = new User({ username: args.username,
              favoriteGenre: args.favoriteGenre })
          
              return user.save()
                .catch(error => {
                  throw new GraphQLError('Creating the user failed', {
                    extensions: {
                      code: 'BAD_USER_INPUT',
                      invalidArgs: args.username,
                      error
                    }
                  })
                })
            },
            login: async (root, args) => {
              const user = await User.findOne({ username: args.username })
          
              if ( !user || args.password !== 'secret' ) {
                throw new GraphQLError('wrong credentials', {
                  extensions: {
                    code: 'BAD_USER_INPUT'
                  }
                })        
              }
          
              const userForToken = {
                username: user.username,
                id: user._id,
              }
          
              return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
            },
             },
          Subscription: {
             bookAdded: {
              subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
            },
          },
        }

        module.exports = resolvers