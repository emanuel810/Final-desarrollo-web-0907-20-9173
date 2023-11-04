const express = require('express');
const router = express.Router();
const sql = require('mssql')
const {config} = require("../config/sql_server")



router.get('/', async (req, res, next)=> {
    let data = []
  
    try
    {
      await sql.connect(config)
      const resultado = await sql.query("SELECT UsuarioNumero, Nombre, Apellido, Correo, Usuario, Contrasena, Habilitado FROM Usuario")
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

  //get -usuario 
router.get('/:Usuario', async (req, res, next)=> {
    let data = {}
    
    try
    {
      const connection = await sql.connect(config)
      const resultado = await connection.request()
                          .input("Usuario", sql.VarChar, req.params.Usuario)
                          .query("SELECT UsuarioNumero, Nombre, Apellido, Correo, Usuario, Contrasena, Habilitado FROM Usuario WHERE Usuario = @Usuario");
      data = resultado.recordset[0]
    }
    catch(err){
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
                                .input("Apellido", sql.VarChar, user.Apellido)
                                .input("Correo", sql.VarChar, user.Correo)
                                .input("Usuario", sql.VarChar, user.Usuario)
                                .input("Contrasena", sql.VarChar, user.Contrasena)
                                .input("Habilitado", sql.Char, user.Habilitado)
                              
                                .query("INSERT INTO Usuario (Nombre, Apellido, Correo, Usuario, Contrasena, Habilitado) VALUES (@Nombre, @Apellido, @Correo, @Usuario, @Contrasena, @Habilitado)")
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

//put --habilitado
router.put('/:UsuarioNumero', async (req, res, next)=> {
    let data = {}
    let {Habilitado} = req.body
    try
    {
      const connection = await sql.connect(config)
      const resultado = await connection.request()
                          .input("UsuarioNumero", sql.Int, req.params.UsuarioNumero)
                          .query("SELECT UsuarioNumero, Nombre, Apellido, Correo, Usuario, Contrasena, Habilitado FROM Usuario WHERE UsuarioNumero = @UsuarioNumero")
      if (resultado.recordset.length > 0)
      {
        const result = await connection
        .request()
        .input("Nombre", sql.VarChar,Nombre)
        .input("Apellido", sql.VarChar,Apellido)
        .input("Correo", sql.VarChar,Correo)
        .input("Usuario", sql.VarChar,Usuario)
        .input("Contrasena", sql.VarChar,Contrasena)
        .input("Habilitado", sql.Char,Habilitado)
        .query("UPDATE Usuario SET Nombre=@Nombre, Apellido=@Apellido, Correo=@Correo, Usuario=@Usuario, Contrasena=@Contrasena  Habilitado=@Habilitado  WHERE UsuarioNumero = @UsuarioNumero")
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


router.delete('/:UsuarioNumero', async (req, res, next)=> {
    let data = {}
    try{
      //Abrimos la conexion
      const connection = await sql.connect(config)
      //ejecutamos la consulta
      const resultado = await connection.request()
                          .input("UsuarioNumero", sql.Int, req.params.UsuarioNumero)
                          .query("SELECT UsuarioNumero, Nombre, Apellido, Correo, Usuario, Contrasena, Habilitado FROM Usuario WHERE UsuarioNumero = @UsuarioNumero")
      if (resultado.recordset.length > 0){
        const result = await connection
        .request()
        .input("UsuarioNumero", sql.Int, req.params.UsuarioNumero)
        .query("DELETE from Usuario where UsuarioNumero=@UsuarioNumero")
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