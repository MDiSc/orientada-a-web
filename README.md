Para iniciar el server, debe ubicarse en la carpeta server (cd server), e iniciarlo a traves del comando (node server.js).
Aconsejamos realizar este paso antes de iniciar para poder seguir con el uso de la pagina sin ningun inconveniente.
Luego, al ingresar nombre de usuario se realiza la conexion al servidor y se puede crear un juego o unirse a uno.
Si esta realizando pruebas desde postman, sugerimos crear el juego desde la pagina ya que si lo inicia desde postman los jugadores
conectados no se actualizaran (ya que no hemos podido actualizar el codigo a tiempo).
Una vez creada la partida, la pagina mostarara el id con el cual se creo el juego (con este podra usar join-game desde postman).
Una vez unidos los jugadores, puede presionar iniciar partida para llenar el tablero y empezar a "jugar" (esta entre comillas
ya que por los momentos solo se pueden enviar movimientos y mostrarlos en todos los tableros).
Aqui dejamos la estructura de los comandos para facilitar su uso:

dirección: ws://localhost:8080

{
    "type": "connection",
    "playerId": "jim"
}
{
    "type": "join-game",
    "playerId": "dwight",
    "gameId": "idquedélapagina"
}
{
    "type": "move",
    "gameId": "idquedélapagina",
    "coordinates": "00"
}