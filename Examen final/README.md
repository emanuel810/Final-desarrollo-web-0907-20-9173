TOMAR EN CUENTA:

Para que se pueda correr la aplicacion, se debe tomar en cuenta lo siguiente:

En el archivo llamado .env se debe agregar las siguientes configuraciones

DB_NAME= base de datos que utilizaá
DB_USER= usuario de la base de datos
DB_PASSWORD= contraseña de la base de datos
SERVER= servidor de la base de datos

TABLA DE LA BASE DE DATOS
CREATE TABLE [Producto]
(
 [Codigo] Int IDENTITY(1,1) NOT NULL,
 [Nombre] Varchar(64) NOT NULL,
 [Precio] Integer NOT NULL,
 [Existencia] Varchar(64) NOT NULL,
)
go

ALTER TABLE [Producto] ADD CONSTRAINT [PK_Codigo] PRIMARY KEY ([Codigo])
go
