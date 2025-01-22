## Conexión al Servidor

Al ingresar el nombre de usuario, se realiza la conexión al servidor y se puede crear un juego o unirse a uno. Lo ideal es probarlo abriendo dos pestañas desde el navegador.

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