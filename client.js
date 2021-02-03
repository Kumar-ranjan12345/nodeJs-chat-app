//this is different from index.js
// a stand alone build of the client is exposed by default by the server at

const socket = io("http://localhost:8000") ; //this denotes our server is running at this port and a socket is made between client and server 

//getting DOM elements in respective js variables
const form = document.getElementById("send-container") ;
const messageInput = document.getElementById("messageInp") ;
const messageContainer = document.querySelector(".container") ;// if any message comes it will show/put that in that container 

var audio  = new Audio("tone.mp3") ; // to create audio object

//below append for appending the texts in our container
const append = (message , position) => {
  const messageElement = document.createElement("div") ; // this will create an instance of element in div tag
  messageElement.innerText = message ;
  messageElement.classList.add("message") ; // this will add the text user sent to the messageElement and it will add those the div tag with message class 
  messageElement.classList.add(position) ; // position = left and right
  messageContainer.append(messageElement) ; // it will append the element to the messageContainer

  if(position == "left"){
    audio.play() ; // whenever someone will receive message , it will play
  }
}


const name = prompt("Enter your name to join the chat") ; // this will ask input your name before joining the chat .
socket.emit("new-user-joined" , name) ; // this event is accepted by the node server and let all know that new user joined

socket.on("user-joined" , name =>{ // this defines , if any user joined , it will show the data to everyone ;
  append(`${name} joined the chat` , "right" ) ; 
})

//whenever anyone sends message , then the "receive event occurs in index.js" . we have to to handle the event here to show the data to everyone
socket.on("receive" , data =>{ //refer to index.js
  append(`${data.name}: ${data.message}` , "left" ) ; 
})

 // we have to handle the left event from index.js here means what to do when someone leaves the chat
socket.on("left" , name => { 
  append(`${name} left the chat ` , 'right') ;
});


//we have to handle the form , means when one send from the text box , we have to specify what will happen after that . We have to add event listener to the form 
// if the form gets submitted send server the messages
form.addEventListener("submit" , (e) => {
  e.preventDefault() ; //will prevent from reloading the webpage
  const message = messageInput.value ;
  append(`You: ${message}` , "right") ; // it will add you and message in the text , add to the right position
  socket.emit("send" , message) ; // will show to everyone
  messageInput.value ="" ; // will clear the text box after sending the text

})
