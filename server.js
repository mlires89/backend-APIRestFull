const express = require ('express')
const {Router} = express
const app = express()
const productos = Router()
const index = require ('./index')
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))



/***********************Creo la lista de productos**************************/

const listProducts = [
  {  
    title:"Escuadra",
    price:123.45,
    thumbnail:"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    id:1
  },
  {
    title:"Calculadora",
    price:234.56,
    thumbnail:"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
    id:2
  },
  {
    title:"Globo Terráqueo",
    price:345.67,
    thumbnail:"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
    id:3
  },
  {
    title:"papa",
    price:"1200",
    thumbnail:"https://url",
    id:4
  },
  {
    title:"pera",
    price:"40",
    thumbnail:"https://url.img",
    id:5
  }
]

/******************* Defino las funciones **********************************/

const getById =number=>{
  const founded = listProducts.find( element => element.id == number) || null;
  return founded ;
}

const deleteById = number=>{
        
const index = listProducts.findIndex(element => element.id == number);
 if (index == -1) {
      console.log ('No se encontró el elemento')
  }
  
      const deletedProduct = listProducts[index]
      listProducts.splice(index, 1)
  
  return deletedProduct
}

const updateById = (number , updatedProduct)=>{        
      const productToUpdate ={
        id: number,
        title : updatedProduct.title,
        price : updatedProduct.price,
        thumbnail : updatedProduct.thumbnail  
      }

      const index = listProducts.findIndex(element => element.id == number);
      listProducts[index] = productToUpdate        
  

     return productToUpdate
}

const save = (object)=>{       
  let maxId = 0;
  listProducts.forEach(element => {
      if (element.id > maxId ){ maxId = element.id}
  });    
  object.id = (maxId + 1);
  listProducts.push(object);   
}



/**************GET PRODUCTS********************/
const getProducts = (req, res) =>{
    try{
      res.json({ 
                productos:listProducts
               });
    } catch (error) {
        res.send(error)
    }
  }






/***************GET BY ID****************/
  const getProductsById = async (req, res) =>{
    try{
         let id = req.params.id
         const productoEncontrado = getById(id)
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
          const productoEliminado =deleteById(id)
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
      const productoActualizado = updateById(id , producto) 
      res.json({producto: productoActualizado})
         
        }catch (error) {
              return res.send(error)
    }
  }


/***************POST*****************/
    const postProduct = (req, res) =>{
      try{
        const { title, price, thumbnail } = req.body      
        const productoNuevo = {
          title,
          price,
          thumbnail
        }  
        save(productoNuevo)  
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
