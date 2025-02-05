# spaceship-front
Front basico para pruobar el challenge de [mindata](https://www.mindata.es/)/[w2m](https://www.w2m.travel/es-es)

Front-End desarrollado con HTML, CSS, Javascript, PHP para facilitar las pruebas de la Api spaceship

* Repositorio de GitHub: [https://github.com/adrianlemma/spaceship](https://github.com/adrianlemma/spaceship)

* URL: [a_definir] Desplegado sobre GCP por cuestiones de comodidad

--------------------------------------------------------------------------------------------------------------------
	
## Funciones:
Por medio de la API, se puede consultar, actualizar, agregar y eliminar registros de la base de datos

--------------------------------------------------------------------------------------------------------------------

## Validacones:
   * Pot fines de practicidad en el diseño del front, el "tamaño de página" no permite ingresar valores negativos
    > aunque en caso de hacerlo consultando la aplicacion por Postman, no genere errores
   * La duplicidad de registros, validez de datos, permisos de usuario, etc. se realiza a travez de la Api

--------------------------------------------------------------------------------------------------------------------

## Modo de uso:
* Al cargar la página, se realizará una petición [GET] a la Api la cual traerá todos los registros
    > Por defecto se consulta la página 1 con un tamaño de 20 registros
* En la sección de la derecha podemos ver 2 cuadros para ingresar valores con sus respectivos botones de búsqueda
    - Uno busca por ID, para esto, debe ingresar un ID en el input numérico
    - Otro para buscar por nombe, debe ingresar un string que se buscará como parte de un numbre en la base de datos
        > En caso de no ingresar nombre, se llamará al endpoint [GET] inicial que consulta todos los registros
* A la derecha veremos un botón de **Login**, el mismo muestra un pequeño formulario donde puede ingresar usuario y contraseña
    > Una vez guardados se utilizará ese usuario y contraseña para los llamados a los métodos [POST], [PUT] y [DELETE]
* Al ingresar esos datos el botón mostrará la leyenda **LOGOUT** que es para limpiar usuario y contraseña
* En la tabla de datos se mostrarán los registros consultados y cada uno tendrá 2 botones **EDIT** y **DELETE** en la columna Accion
    - Si presiona eliminar se intentará eliminar el registro con el usuario cargado en ese momento
        > Tenga en cuenta que solo el usuario **"admin"** tiene permiso para eliminar registros
    - Si presiona editar, los datos de esa Nave se cargarán en el formulario de la izquierda donde podrá editar los datos
        > En el formulario se verá el título de **Editar Nave** con el ID del registro que esté editando
    - Si presiona el botón **Guardar**, se llamará el endpoint del [PUT] para actualizar los datos de la Nave
    - Si presiona el botón **Cancelar** se limpiará el formulario
* El formulario tiene el título **Nueva Nave** ya que puede cargar datos y enviarlos al endpoint [POST] para guardar
    > Tenga en cuenta que solo los usuarios **"admin"** y **"user"** tienen permisos para guardar o actualizar datos
* En la parte inferior de la sección de la derecha podemos ver el numero de página y los botónes para siguiente y anterior
    > Si cambia de página, se realizará la consulta con la paginación que corresponda
    - Al cambiar la página siempre se hace sobre la última consulta realizada con los botones **Buscar por ID** o **Buscar por Nombre**
    - Si está en la primera página y retrocede, lo llevará a la última pagina y viceversa
* Por último, en la parte inferior de la sección derecha está el **Tamaño de pagina**, el mismo es numérico mayor a cero
* Puede cambiar el tamaño de página antes de realizar una consulta por nombre para llamar al servicio con la paginación deseada
