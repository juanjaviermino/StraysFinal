# README - Proyecto de Diseño de Ingeniería (Actualizado hasta el Core)

# Tabla de Contenidos

- [0. Notas de actualización importantes](#0-notas-de-actualización-importantes)
- [1. Introducción al Framework MVC](#1-introducción-al-framework-mvc)
  - [Diseño de Ingeniería](#diseño-de-ingeniería)
- [2. Implementación de Login con urls protegidas](#2-implementación-de-login-con-urls-protegidas)
  - [Diagrama del workflow del login](#diagrama-del-workflow-del-login)
- [3. Implementación de un ejercicio entre varias tablas (Mini core)](#3-implementación-de-un-ejercicio-entre-varias-tablas-mini-core)
  - [Diagrama de despliegue de STRAYS (Mini Core)](#diagrama-de-despliegue-de-strays)
- [4. Implementación del Core](#4-implementación-del-core)
  - [Diagrama de actividades del Core](#diagrama-de-actividades-del-core)

## 0. Notas de actualización importantes (Cambios del proyecto en el tiempo)

- Para la [Introducción al Framework MVC](#1-introducción-al-framework-mvc) se utilizó Webpack como builder y una base de datos en MongoDB.
- Para la [Implementación de Login con urls protegidas](#2-implementación-de-login-con-urls-protegidas) se cambió la base de datos a SQL Server.
- Para la [Implementación de un ejercicio entre varias tablas (Mini core)](#3-implementación-de-un-ejercicio-entre-varias-tablas-mini-core) se cambió el builder a Vite y la base de datos a PostgreSQL.
- Para la [Implementación del core](#4-implementación-del-core) se desplegaron todos los servicios. El backend en render y el front end en github pages. La base de datos de PostgreSQL se aloja en Google Cloud Platform.

## 1. Introducción al Framework MVC (Actualizado hasta el Core)

Este proyecto utiliza el patrón de diseño MVC (Modelo-Vista-Controlador) para organizar la estructura de la aplicación. El patrón MVC separa la aplicación en tres componentes principales:

- **Modelo**: Representa los datos y la lógica de la aplicación. En nuestro caso, utilicé PostgreSQL con SQLAlchemy para gestionar la base de datos, lo que se traduce en el componente "Modelo".

- **Vista**: La vista es la interfaz de usuario (UI) de la aplicación. Utilicé React para construir la interfaz de usuario del frontend, lo que equivale al componente "Vista".

- **Controlador**: El controlador maneja las solicitudes del usuario y actúa como intermediario entre el modelo y la vista. Flask en el backend se encarga de gestionar las rutas y controlar las solicitudes, desempeñando el papel del "Controlador".

## Diseño de Ingeniería

### Diagrama de Arquitectura del Framework (desactualizado)

<img src="https://github.com/juanjaviermino/DiagramasStrays/blob/110c4c476a7a6a13b91fc60408639a65af6df7af/Diagrama%20de%20arquitectura.jpg">

### Explicación del Diagrama

El diagrama de arquitectura representa la estructura general de nuestra aplicación basada en el Framework MVC. Aquí hay una breve explicación de los componentes clave:

- **Frontend (React)**: Esta parte de la aplicación maneja la interfaz de usuario y las interacciones del usuario. Utilizamos React para construir las vistas y componentes frontend.

- **Backend (Flask)**: Flask actúa como el controlador en nuestro patrón MVC. Gestiona las solicitudes HTTP, enruta las peticiones a las funciones adecuadas y se comunica con la base de datos.

- **Base de Datos (MongoDB)**: ~~Utilicé MongoDB como base de datos para almacenar y recuperar datos. PyMongo se utiliza para interactuar con la base de datos desde la aplicación Flask~~. Utilicé PostgreSQL como base de datos alojada en GCP. El mapeador relacional de objetos ya no es PyMongo si no SQLAlchemy. Este mapeador es el que se encarga de relacionar clases de Python a tablas de PostgreSQL.  

- **Estilos (Bootswatch)**: ~~Bootswatch proporciona un conjunto de estilos predefinidos que aplicamos a nuestra interfaz de usuario React para darle una apariencia atractiva y coherente.~~ Si bien al inicio utilicé Bootswatch como guía para mis estilos, posteriormente para el proyecto final utilicé una librería de React (Prime React) como librería de componentes, que ya venían con ciertos estilos de Bootstrap, y el resto los apliqué con SASS y CSS.

Este diseño nos permite separar claramente las preocupaciones, lo que facilita el desarrollo y el mantenimiento de la aplicación. El frontend se encarga de la presentación, el backend gestiona la lógica de la aplicación y la base de datos almacena los datos de manera eficiente.


## 2. Implementación de Login con urls protegidas

### Explicación del login

Esta aplicación implementa una variable de estado para poder verificar si un usuario está loggeado o no. Esto significa que React utiliza un renderizado condicional para poder cambiar de enrutador dependiendo del valor de la variable de estado. Esta variable de estado se actualiza gracias al componente de login, el cual realiza la comunicación con el backend en Flask para poder verificar las credenciales de un usuario registrado. Si un usuario no realiza el proceso de ingreso correcto, la variable de estado nunca permitirá que el componente con el enrutador de las urls protegidas se renderice lo cual devolverá al usario no loggeado a las páginas públicas. 

### Diagrama del workflow del login (desactualizado)

<img src="https://github.com/juanjaviermino/DiagramasStrays/blob/110c4c476a7a6a13b91fc60408639a65af6df7af/Diagrama%20workflow%20login.jpg">

En este diagrama se presenta el workflow del login realizado. El proceso es el siguiente: 

- El usuario ingresa a la aplicación principal y React le presenta la página de prelogin, pública.
- Si el usuario no tiene cuenta, debe registrarse.
- Una vez que el usuario intente registrarse, React realiza ciertas verificaciones como que las contraseñas coincidan, o que el email no exista ya en la base de datos, a través de Flask. 
- En el caso de éxito, el usuario se registra en la base de datos y la página envía al usuario a la página de login.
- En el login, el usuario ingresa sus credenciales. React consulta con Flask si las credenciales son válidas y Flask a su vez realiza esta verificación con la base de datos.
- Flask envía el mensaje de éxito o de fallo a React.
- Cuando React recibe el mensaje, si es el caso de éxito, cambia su variable de estado a loggeado y renderiza el componente para usuarios loggeados el cual contiene el enrutador para todos los endpoints para usuarios loggeados.
- Si el mensaje es el caso de fallo, entonces React no renderiza el componente para usuarios loggeados y los endpoints protegidos nunca existirán para ser accedidos.

- (Actualización): el flujo es el mismo pero la base de datos es otra.

## 3. Implementación de un ejercicio entre varias tablas (Mini core)

### Explicación del ejercicio

Para este ejercicio se buscaba crear tres tablas: usuarios (vendedores), productos y ventas. En la tabla de ventas de sebía guardar la fecha, el usuario que realizó la venta, el producto que vendió y cuánto vendio. Con estas tablas se debía obtener un resumen de ventas por vendedor, sumando sus ventas totales dentro de un rango de fechas. Para esto se debía crear una interfaz donde el usuario elija dos fechas y se genere la tabla de resumen. Una explicación más detallada, el ejercicio en funcionamiento y los ejemplos se encuentran en este video: [Mini Core | Juan Javier Miño Arboleda](https://www.youtube.com/watch?v=g0eV-DL43sc)


### Diagrama de despliegue de STRAYS (Mini Core)

<img src="https://github.com/juanjaviermino/DiagramasStrays/blob/b073277d895b10aa0105df40a2cdeb4b61de5842/Diagrama%20de%20despliegue%20Minicore.png">

En este diagrama de despliegue se muestra cómo fue desplegada mi aplicación. Para el frontend se utilizó Github Pages. Desde aquí se tuvo que hacer ciertas configuraciones para que el proyecto se arme con Vite desde github pages. Este front se comunica con el backend en Render.com, el cual utilizando la librería psycopg2 se conecta con una base de datos en PostgreSQL también alojada en Render.com. El ejercicio se completó utilizando métodos de SQalchemy que permiten hacer filtros y querys sin utilizar sentencias SQL directas, lo cual encapsula la comunicación. 

## 4. Implementación del Core

### Explicación del ejercicio

En esta fase final se realizó la implementación del Core del proyecto. Este core consiste en poder comparar imágenes con un modelo de visión por computadora para así poder darle al usuario el top tres de posts que se asemejan más al que está buscando. Para esta fase la arquitectura del proyecto cambió un poco ya que se le sumó un microservicio que es el encargado de realizar la comparación de imagenes como tal. Además de desplegar todos los servicios en la nube (base de datos en GCP, backend y microservicio en Render y el frontend en Github Pages). El core y cómo funciona se explican de mejor manera en este video de la defensa del proyecto: [Defensa del proyecto final | Juan Javier Miño Arboleda](https://www.youtube.com/watch?v=g6TvRfjTtzs)


### Diagrama de actividades del Core

<img src="https://github.com/juanjaviermino/StraysFinal/blob/4a73cae9fbe5d7f01c6b989d5dc30eed3c1a38bb/Diagrama%20de%20actividades%20core.jpg">

En este diagrama de actividades se explica el flujo de trabajo del core final del proyecto.
