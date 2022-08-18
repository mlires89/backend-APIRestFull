const express = require ('express')
const {Router} = express
const app = express()
const productos = Router()
const index = require ('./index')
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))


// importo la clase Contenedor del ejercicio anterior
const Contenedor = require('./contenedor.js')
//Creo una instancia de la clase para poder invocar sus metodos posteriormente
const cont = new Contenedor.Contenedor('./productos.txt')


/**************GET PRODUCTS********************/
const getProducts = async (req, res) =>{
    try{
      const productos = await cont.getData()
      res.json({ 
                productos:productos
               });
    } catch (error) {
        res.send(error)
    }
  }


/***************GET BY ID****************/
  const getProductsById = async (req, res) =>{
    try{
         let id = req.params.id
         const productoEncontrado = await cont.getById(id)
          if( !productoEncontrado ){
              res.status(400).json({error : 'producto no encontrado'})
          }
          res.json({producto:productoEncontrado })
        } catch (error) {
           return res.send(error)
    }
  }


/****************DELETE BY ID****************/
  const delProduct = async (req, res) =>{
    try{
          let id = req.params.id
          const productoEliminado = cont.deleteById(id)
          res.json({producto: productoEliminado})
        }catch (error) {
              return res.send(error)
    }
  }


/***************UPDATE****************/
  const putProduct = async (req, res) =>{
    try{
      let id = req.params.id 
      const { producto } = req.body;
      const productoActualizado = await cont.updateById(id , producto)
        
      res.json({producto: productoActualizado})
         
        }catch (error) {
              return res.send(error)
    }
  }


/***************POST*****************/
    const postProduct = async (req, res) =>{
      try{
        const { title, price, thumbnail } = req.body      
        const productoNuevo = {
          title,
          price,
          thumbnail
        }  
        await cont.save(productoNuevo)  
        res.json({"producto agregado" : productoNuevo})
          }catch (error) {
                return res.send(error)
      }
    }

/**************************************************************** */

productos.get('/', getProducts)
productos.get('/:id',getProductsById)
productos.post('/', postProduct)
productos.put('/:id' , putProduct)
productos.delete('/:id', delProduct)


app.use('/api/productos' , productos)
app.use('/', index)
const PORT = 3000
app.listen(PORT, ()=>{
    console.log('server on')
})
