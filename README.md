# Frontend de Ejemplo con iframe para RocketChat

En si esto es un sistema embebido el cual consta de los siguientes puntos a considerar:

## iframe
Componente de etiqueta que le ponen la url y joya. en este caso ocupan ponerle a la url de donde esta rocketchat el famoso
'?resumeToken=TU_TOKEN' eso se veria algo así:

> [!NOTE]
    Me dejan la URL como una variable de entorno en el .env
    ***Se los ruego***
```Ejemplo
http://localhost:3000/home?resumeToken=${token}
```

## Usuario y Contraseña
Lo normal que se lo manden. :)
> [!NOTE]
**OJO**
Sería de que actualicen el tryEnter para que intente usar el iframe, sino no funciona directamente
Podrían usar otra cosa

## Librerias
Legitimamente en el Chat solo use la libreria de:
- React (Como que no falta decir porque)
- react-spinners (Es para si no carga el iframe por el usuario)
    > [!NOTE]
    Buscar mejor manera