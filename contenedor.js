const fs = require('fs')



class Contenedor {
    
    constructor (ruta){
        this.ruta = ruta;
    }

  

    async getData (){

        try{
            const data = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(data)

        }catch(err){
            console.log(err)
            return []
        }
    }

    async save (object){    
        const data = await this.getData();  
        let maxId = 0;
        data.forEach(element => {
            if (element.id > maxId ){ maxId = element.id}
        });    
        object.id = (maxId + 1);
        data.push(object);
        let objectJSON = JSON.stringify(data);
        try{
           await fs.promises.writeFile(this.ruta,objectJSON)
        }
        catch (err){
            console.log (err)
        }
        return object.id
    }

    async getById (number){
        const data = await this.getData();        
        const founded = data.find( element => element.id == number) || null;

        return founded ;
    }


    async getMax(){
        const data = await this.getData();  
        let maxId = 0;
        data.forEach(element => {
            if (element.id > maxId ){ maxId = element.id}
        });  
        return maxId  
    }

    async getMin(){
        const data = await this.getData();  
        let minId = data[0].id;
        data.forEach(element => {
            if (element.id < minId ){ minId = element.id}
        });  
        return minId  
    }

   async deleteById(number){
        
        const data = await this.getData();  

        const index = data.findIndex(object => {return object.id === number;});
       if (index = -1) {
            console.log ('No se encontró el elemento')
        }
        else{
            data.splice(index, 1)
            let objectJSON = JSON.stringify(data);

            try{
                await fs.promises.writeFile(this.ruta,objectJSON)
                console.log('Se elimino el elemento')
            }
            catch (err){
                console.log (err)
            }
        }  
   }

    async deleteAll(){
        try{
            await fs.promises.truncate(this.ruta)
            console.log('Todos los elementos fueron borrados')
         }
         catch (err){
             console.log (err)
         }
    }


async updateById(id , updateProducto){

    try {
        const lista = await this.getAll();
        const producto =  await this.getById(id)
        const indiceObjeto = lista.findIndex( e => e.id == id);
        producto.title = updateProducto.title;
        producto.price = updateProducto.price;
        producto.thumbnail = updateProducto.thumbnail;
        lista.splice(indiceObjeto , 1 , producto)
        await this.deleteAll();
        await fs.writeFile(`./${this.ruta}`, JSON.stringify(lista));
       
       return producto

    } catch (error) {
        throw new Error (`No se puede actualizar: ${error}`);  
    }
}

}

module.exports = { Contenedor }


