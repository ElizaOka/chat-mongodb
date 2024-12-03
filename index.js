
//back 
/*
    import dos pacotes:
    -express
    -ejs
    -http
    -path
    -socket
*/
const express = require('express');
const ejs=require('ejs');
const http = require('http');
const path= require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

/* 

    instancias 
*/
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
/*
define a localização da pasta estatica 
*/
app.use(express.static(path.join(__dirname, 'public')));//acha o caminho estaticos 

/* 
    define o ejs como a chave de inicialização 
*/
// app.set('view engine', 'html')
app.set('views',path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);


app.use('/', (req,res) =>{
    res.sendFile(path.join( 'index.html'));
});

//armazena msgs 

let messages=[];

// cria conection com o socket.io
io.on('conection', (socket) =>{
    console.log('novo usuario conectador ID:' + socket.id);

    /* Recuperar e manter as mensagem do frontend para o backend */
    socket.emit('previousMessage', messages);
    
    /* Dispara ações quando recebe as mensagens do frontend */
    socket.on('sendMessage', data => {
        /* Adiciona a nova mensagem no final do array "messages" */
        messages.push(data);

        /* Propaga a mensagem para todos os usuários conectados no chat */
        socket.broadcast.emit('receivedMessage', data);

    });
});
/* 
    criação server http 
*/
server.listen(3000, () =>{
    console.log('server funcionando no http://localhost:3000')
});