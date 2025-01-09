## Conexión al Servidor

Al ingresar el nombre de usuario, se realiza la conexión al servidor y se puede crear un juego o unirse a uno. Si está realizando pruebas desde Postman, sugerimos crear el juego desde la página, ya que si lo inicia desde Postman, los jugadores conectados no se actualizarán (ya que no hemos podido actualizar el código a tiempo).

Una vez creada la partida, la página mostrará el ID con el cual se creó el juego (con este podrá usar `join-game` desde Postman). Una vez unidos los jugadores, puede presionar "Iniciar partida" para llenar el tablero y empezar a "jugar" (está entre comillas ya que por los momentos solo se pueden enviar movimientos y mostrarlos en todos los tableros).

## Estructura de los Comandos

Aquí dejamos la estructura de los comandos para facilitar su uso:

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