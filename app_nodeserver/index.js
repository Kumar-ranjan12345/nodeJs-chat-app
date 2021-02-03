//this is the server for my application 

const io = require("socket.io")(8000) ; // socket io server will run on port 8000 

const users = {} ; // it will add all users here

io.on('connection' , socket => { // io.on is an instance of socket.io which will listen to many socket connections

  //if any new user joins, let other users connected to server know
  socket.on("new-user-joined" , name => { //this defines what to do with a particular connection , here new-user-joined is a event .
    //console.log("new user" , name) ;
    users[socket.id] = name ; // if any user joined event occurs , then this will add the user name to "user" 
    socket.broadcast.emit("user-joined" , name) ; //this line will tell the users other than the new user joined , that "user-joined" , here user-joined event will be sent very user except that newly joined user .

  });


  // we have to handle when someone sends a message and to broadcast it to all
  socket.on("send" , message => { // this socket.on defines that if any user sends message , then it will be sent to every users in the chat .(here receive is event , if that occurs , then display the message)
    socket.broadcast.emit("receive" , {message: message, name: users[socket.id]});
  });
  

  //we have to show if any user leave the chat using disconnect event
  socket.on("disconnect" , message => { 
    socket.broadcast.emit("left" , users[socket.id]) ;
    delete users[socket.id] ; // will delete the user-id of the disconnected user from users
  });


});