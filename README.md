## Conexión al Servidor

Antes de todo, se necesita iniciar el servidor para que el modo multijugador funcione. Para iniciar el servidor, en la consola de Visual Studio Code, se debe ingresar el comando `cd server`. Una vez hecho esto (es decir, moviéndonos al directorio `server`), se debe introducir el siguiente comando `node server.js` y ya estaría inicializado el servidor. (Para finalizarlo se debe presionar `Ctrl + C`). Es importante tener en cuenta que no se debe cerrar la terminal si se quieren ver los comandos que se están ejecutando en el servidor. Además, una vez que se cierra, para matar el servidor hay que finalizar su proceso desde el administrador de tareas.

Al ingresar el nombre de usuario, se realiza la conexión al servidor y se puede crear un juego o unirse a uno. Lo ideal es probarlo abriendo dos pestañas desde el navegador. 

## Estructura de los Comandos

Algunos de los comandos son los siguientes:

**Dirección:** `ws://localhost:8080`

### Comandos

1. **Conexión:**
    ```
    {
        "type": "connection",
        "playerId": "jim"
    }
    ```

2. **Unirse a un Juego:**
    ```
    {
        "type": "join-game",
        "playerId": "dwight",
        "gameId": "idquedélapagina"
    }
    ```

3. **Movimiento:**
    ```
    {
        "type": "move",
        "gameId": "idquedélapagina",
        "coordinates": "00"
    }
    ```

4. **Respuesta:**
    ```
    {
        "type": "response",
        "gameId": "idquedélapagina",
        "playerId": "idquienrecibe",
        "coordinates": "00",
        "response": "miss"
    }
    ```