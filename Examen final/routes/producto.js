const express = require('express');
const router = express.Router();
const sql = require('mssql')
const {config} = require("../config/sql_server")



router.get('/', async (req, res, next)=> {
    let data = []
  
    try
    {
      await sql.connect(config)
      const resultado = await sql.query("SELECT Codigo, Nombre, Precio, Existencia FROM Producto")
      data = resultado.recordset
    }
    catch(err)
    {
      console.error(err)
      data = err
      res.statusCode = 500
    }
    res.send(data)
  });

//post 
router.post("/", async (req, res, next)=>{
    const user = req.body;
    let resultado = {}
    try
    {
      let connection = await sql.connect(config)
      const result = await connection
                                .request()
                                .input("Nombre", sql.VarChar, user.Nombre)
                                .input("Precio", sql.Int, user.Precio)
                                .input("Existencia", sql.VarChar, user.Existencia)

                                .query("INSERT INTO Producto(Nombre,Precio,Existencia) VALUES (@Nombre, @Precio, @Existencia)")
      resultado = result.rowsAffected      
    }
    catch(err)
    {
      console.error(err)
      res.statusCode = 500
      resultado = err
    }
    res.send(resultado)
});

//put --Codigo
router.put('/:Codigo', async (req, res, next)=> {
    let data = {}
    let {Nombre,Precio,Existencia} = req.body
    try
    {
      const connection = await sql.connect(config)
      const resultado = await connection.request()
                          .input("Codigo", sql.Int, req.params.Codigo)
                          .query("SELECT Codigo, Nombre, Precio, Existencia from Producto WHERE Codigo = @Codigo")
      if (resultado.recordset.length > 0)
      {
        const result = await connection
        .request()

        .input("Nombre", sql.VarChar,Nombre)
        .input("Precio", sql.Int,Precio)
        .input("Existencia", sql.VarChar,Existencia)
              
        .input("Codigo", sql.Int, req.params.Codigo)
        .query("UPDATE Producto SET Nombre=@Nombre, Precio=@Precio, Existencia=@Existencia WHERE Codigo = @Codigo")
        data = result.rowsAffected
      }
      
    }
    catch(err){
      console.error(err)
      data = err
      res.statusCode = 500
    }
    res.send(data)
});


router.delete('/:Codigo', async (req, res, next)=> {
    let data = {}
    try{
      //Abrimos la conexion
      const connection = await sql.connect(config)
      //ejecutamos la consulta
      const resultado = await connection.request()
                          .input("Codigo", sql.Int, req.params.Codigo)
                          .query("SELECT Codigo, Nombre, Precio, Existencia from Producto WHERE Codigo = @Codigo")
      if (resultado.recordset.length > 0){
        const result = await connection
        .request()
        .input("Codigo", sql.Int, req.params.Codigo)
        .query("DELETE from Producto where Codigo=@Codigo")
         data = result.rowsAffected
      }
      //await sql.close()
  
    }
    catch(err){
      console.error(err)
      data = err
      res.statusCode = 500 //Internal server error
    }
    res.send(data)
});
    
module.exports = router;