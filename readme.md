# Chatbot para pedir Sushi
API para chatbot de pedidos de sushi. Puedes registrarte, loguearte. Siendo administrador tienes la opcion de crear nuevos sushis editarlos y eliminarlos.     

## Mensajes que acepta el bot

`Saludo` -> **"hola","buenos dias","buenas tardes","buenas noches"**

`menu` -> **"menú", "quiero ver el menú", "mostrar el menú","cual es el menú","menu","quiero ver el menu","mostrar el menu","cual es el menu"**

`Pedido` -> **"quiero hacer un pedido", "hacer un pedido", "pedido"**

`Crear Pedido` -> **"agregar","añadir","quiero agregar"**

`Horarios` -> **"¿están abiertos?", "horarios", "¿a qué hora abren?","a que hora abren","estan abiertos","estan abiertos?","a que hora abren?"**

`Localizacion` -> **"donde estan","donde se encuentran","donde esta el local","donde esta el restaurante"**

`Eliminar Orden` -> **"me gustaria eliminar mi orden","eliminar mi pedido","eliminar mi orden","eliminar","eliminar orden"**

`Eliminacion` -> **"borrar [id del producto]"**

<small>Si quieres saber como responde el bot a estos mensajes puedes echarle un vistazo al archivo intents.json</small>

## Variables de entorno
Para correr este proyecto se necesita que agregues
las siguientes variables de entorno en tu archivo .env


`PORT` -> Puerto donde se ejecuta el servidor
`PORT_DB` -> Puerto donde se ejecuta la base de datos
`DB_NAME` -> Nombre de la base de datos
`URL_BACK` -> La url del backend ej: http:\localhost:
`SECRET` -> Clave generada con  openssl rand -hex 32
`salt_Rounds` -> Un numero entero 
`JWT_EXPIRATION` -> Un tiempo por ej: 1hr,2hr


## Como correr este proyecto

### Backend


```bash
  git clone https://link-to-project
```

```bash
  cd <nombre del proyecto>
```

```bash
    cd <backend>
```

Instala las dependencias

```bash
  npm install
```

Corre el servidor

```bash
  npm run dev
```

## Inicializar base de datos
Si ya has instalado y ejecutado el servidor vera que no existe ningun dato. Pero no hay ningún problema
ahora te muestro como cargarle informacion a la base de datos.

```bash
    npm run init-db
```

Una vez hecho esto ya puedes ver que se han cargado sushis y 2 usuarios para que los pruebes. Uno es admin y otro es un usuario comun. Puedes hecharle un vistazo a la informacion de los usuarios para que los utilices:

```json
        {
            "name":"admin",
            "email":"admin@localhost.com",
            "password":"Administrador200.",
            "role":"admin"
        },
        {
            "name":"user",
            "email":"user@localhost.com",
            "password":"Usuario200.",
            "role":"user"
        }
    
```

## API endpoints / Sushi

### GET

```http
GET v1/products
```

| query| Tipo de dato | es requerido |
| :-------- | :------- | :------------------------- |
| `page` | `integer` | **Optional** |


```http
GET /v1/products/:id
```
*Path variable*
| clave |  valor   |ejemplo|
| :-------- | :------- | :------------------------- |
| `:id` | `string` | **676e58fa7f61249403ff107e** |

```http
GET /v1/products/name/:name
```
*Path variable*
| clave |  valor   |ejemplo|
| :-------- | :------- | :------------------------- |
| `:name` | `string` | **Maki Queso y Pepino** |

#### Se necesita ser administrador para utilizar los siguientes endpoint: 

<small>Necesitaras este header en cada peticion</small>

| clave |  valor   |
| :-------- | :------- | 
| `Authorization` | `Bearer token` |

### Post

```http
POST /v1/products/admin
```

*Headers*
| clave |  valor   |descripción|
| :-------- | :------- | :------------------------- |
| `Content-Type` | `multipart/form-data` | **Necesario para enviar archivos e informacion** |



*Body (form-data)*
| campo | Tipo de dato | es requerido |descripción |
| :-------- | :------- | :------------| ------------- |
| `picture` | `file` | **requerido** | Archivo que se desea subir extenciones permitidas jpg,png,webp,jpeg|
| `name` | `string` | **requerido** | Nombre del sushi|
| `price` | `double` | **requerido** |Precio del sushi|
| `pieces` | `integer` | **requerido** |Cantidad de piezas que vienen|

<small>te dejo un ejemplo del cuerpo de la peticion</small>

**Ejemplo:**

```form-data
    picture:File
    name:Nombre de un sushi
    price:2.3
    pieces:5
```

### PUT

```http
PUT /v1/products/admin/:id
```

*Headers*
| clave |  valor   |
| :-------- | :------- | 
| `Content-Type` | `application/json` |

*Path variable*
| clave |  valor   |ejemplo|
| :-------- | :------- | :------------------------- |
| `:id` | `string` | **676e58fa7f61249403ff107e** |

*Body*
| campo | Tipo de dato | es requerido |descripción |
| :-------- | :------- | :------------| ------------- |
| `name` | `string` | **optional** | Nombre del sushi|
| `price` | `double` | **optional** |Precio del sushi|
| `pieces` | `integer` | **optional** |Cantidad de piezas que vienen|
| `category` | `string` | **optional** |Cantidad de piezas que vienen|

*Errores comunes*
| codigo | mensaje | descripción |
| :-------- | :------- | :------------|
| 400 | `El id no es valido ` | el id proporcionado no es valido o no se ha proporcionado|
| 403 | `Acceso denegado` | el usuario no es valido o no es administrador |
| 404 | `Sushi de {id} no encontrado` | El id proporcionado no esta relacionado con un producto existente |


### Delete
```http
delete /v1/products/admin/:id
```

*Path variable*
| clave |  valor   |ejemplo|
| :-------- | :------- | :------------------------- |
| `:id` | `string` | **676e58fa7f61249403ff107e** |


*Errores comunes*
| codigo | mensaje | descripción |
| :-------- | :------- | :------------|
| 400 | `El id no es valido ` | el id proporcionado no es valido o no se ha proporcionado|
| 403 | `Acceso denegado` | el usuario no es valido o no es administrador |
| 404 | `Sushi de {id} no encontrado` | El id proporcionado no esta relacionado con un producto existente |

### patch
```http
patch /v1/products/admin/:id
```

*Headers*
| clave |  valor   |descripción|
| :-------- | :------- | :------------------------- |
| `Content-Type` | `multipart/form-data` | **Necesario para enviar el archivo** |

*Body (form-data)*
| campo | Tipo de dato | es requerido |descripción |
| :-------- | :------- | :------------| ------------- |
| `picture` | `file` | **requerido** | Archivo que se desea subir extenciones permitidas jpg,png,webp,jpeg|


*Errores comunes*
| codigo | mensaje | descripción |
| :-------- | :------- | :------------|
| 400 | `El id no es valido ` | el id proporcionado no es valido o no se ha proporcionado|
| 403 | `Acceso denegado` | el usuario no es valido o no es administrador |
| 400 | `La imagen no ha sido encontrada` |No se propociono la imagen  |
| 404 | `Sushi de {id} no encontrado` | El id proporcionado no esta relacionado con un producto existente |


## API endpoints / User

**Las peticiones get y delete necesitan el siguiente header**

| clave |  valor   |
| :-------- | :------- | 
| `Authorization` | `Bearer token` |

### GET

```http
GET /v1/users/me
```


```http
GET /v1/users/getOrders
```
| query | Tipo de dato | es requerido |ejemplo |
| :-------- | :------- | :------------| :------------- |
| `state` | `enum` | **opcional** | pendiente,entregado,cancelado|
| `limit` | `integer` | **opcional** | limite de pedidos a mostrar|
| `total` | `integer` | **opcional** | Precio total de un pedido|

*Posible errores*
| codigo | mensaje | descripción |
| :-------- | :------- | :------------|
| 403 | `El usuario no esta autenticado` | cuando usuario no esta autenticado y esta intentando usar este endpoint|

### Post
```http
POST /v1/users/register
```

*Body*

| campo | Tipo de dato | es requerido |descripción |
| :-------- | :------- | :------------| ------------- |
| `name` | `string` | **required** | Nombre de usuario|
| `email` | `string` | **required** |El email del usuario|
| `password` | `string` | **required** |Contraseña del usuario|

<small>te dejo un ejemplo del cuerpo de la peticion</small>

**Ejemplo:**

```json
    {
    "name":"UnUsuariomuyLoco20",
    "email":"UnEmail@domino.com",
    "password":"UnaContraseñaSegura200.!22"
    }
```
*Errores comunes*
| codigo | mensaje | descripción |
| :-------- | :------- | :------------|
| 400 | `El nombre de usuario ya existe` | El nombre ya ha sido tomado|
| 400 | `El nombre de usuario debe ser de almenos 3 caracteres` |EL nombre de usuario proporcionado no es valido |
| 400 | `El formato de email no es valido` |El email proporcionado no es valido |
| 400 | `La contraseña ingresada debe de contener 8 caracteres,letra mayuscula y un numero. Puede contener caracteres especiales` |La contraseña ingresada no es valida |


```http
POST /v1/users/login
```

| campo | Tipo de dato | es requerido |descripción |
| :-------- | :------- | :------------| ------------- |
| `name` | `string` | **required** | Nombre de usuario|
| `password` | `string` | **required** |Contraseña del usuario|


<small>te dejo un ejemplo del cuerpo de la peticion</small>

**Ejemplo:**

```json
    {
    "name":"UnUsuariomuyLoco20",
    "password":"UnaContraseñaSegura200.!22"
    }
```


*Errores comunes*
| codigo | mensaje | descripción |
| :-------- | :------- | :------------|
| 404 | `El usuario no existe ` | el nombre ingresado no pertenece a ningun usuario|
| 400 | `Las contraseñas no coinciden ` | La contraseña ingresada no coincide con la que existe en la base de datos|
| 400 | `El usuario es requerido`,`El usuario es requerido` | la contrasela o usuario no fueron proporcionados|


### Delete 

```http
DELETE /users/me/removeOrder/:productId
```
| clave |  valor   |ejemplo|
| :-------- | :------- | :------------------------- |
| `:productId` | `string` | **676e58fa7f61249403ff107a** |

*Errores comunes*
| codigo | mensaje | descripción |
| :-------- | :------- | :------------|
| 404 | `El sushi de id {id} no existe` | No se proporciono el id o el id ingresado no coincide con un producto |
| 400 | `Las contraseñas no coinciden ` | La contraseña ingresada no coincide con la que existe en la base de datos|
| 403 | `Acceso denegado, token invalido` | El token dado por el usuario no es valido o ha expirado|

## API endpoint / Pedido

```http
POST v1/orders
```

*Body*
| campo | Tipo de dato | es requerido |descripción |
| :-------- | :------- | :------------| ------------- |
| `userId` | `string` | **required** | id del usuario|
| `products` | `array[{productID,quantity,subtotal}]` | **required** |El array que contiene los sushis|
| `productId` | `string` | **required** |id del sushi|
| `quantity` | `string` | **required** |La cantidad de elementos del mismo producto |
| `subTotal` | `number` | **optional** |El subtotal se calcula automaticamente |
| `total` | `number` | **optional** |el total no es necesario que se incluya es calculado automaticamente |
| `date` | `date` | **optional** |La fecha es generada automaticamente cuando se crea el producto|
| `state` | `enum` | **optional** |state siempre es creado por defecto como pendiente.|

<small>te dejo un ejemplo del cuerpo de la peticion</small>

**Ejemplo:** 
```json
    {
        "userId": "677480576af954fb564f1bad",
        "products": [
            {
                "productId": "676e58fa7f61249403ff1088",
                "quantity": 1
            }
        ]
    }
```

*Errores comunes*
| codigo | mensaje | descripción |
| :-------- | :------- | :------------|
| 400 | `Campos requeridos` | Mensaje personalizado por cada campo faltante que es requerido |
| 404 | `El producto de id {id} no existe` | EL id ingresado no coincide con un producto existente |
| 403 | `El usuario de id {id} no se encontro` | si el id no coincide con un usuario existente |
| 500 | `Error creando la orden` | Cuando ocurre un problema al crear la orden |

## API endpoint / bot

*SI quieres saber cuales son los mensajes que reconoce el bot porfavor hacer <a href="#mensajes-que-acepta-el-bot">click aqui</a>*

```http
POST v1/bot

```
<small>Estos querys se encargan de mostrar la siguiente pagina del menu, cuando el usuario lo pide.</small>

*Header*

| clave |  valor   |
| :-------- | :------- | 
| `Authorization` | `Bearer token` |

*Query parameters*

| query | Tipo de dato | es requerido |descripcion |
| :-------- | :------- | :------------| :------------- |
| `page` | `enum` | **opcional** | pagina a mostrar|
| `limit` | `integer` | **opcional** | limite de pedidos a mostrar|

<small>te dejo un ejemplo del cuerpo de la peticion</small>

**Ejemplo:** 
```json
    {
        "message":"Hola"
    }
```
**Respuesta del bot**
```json
    {
        "botResponse": "Hola buenas \n1 Estas son las opciones disponibles: \n2 Menu \n3 Hacer un pedido \n5 Horarios \nDonde se encuentran? \n6 Eliminar mi pedido \n7 "
    }
```

