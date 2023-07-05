let users = new Array();
let messages = new Array();

const requestArray = ["http://localhost:8080/api/Users", "http://localhost:8080/api/Messages"];

function getAll() {
    Promise.all(requestArray.map((request) => {
        return fetch(request).then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        });
    })).then((values) => {
        initData(values[0], values[1]);
    }).catch(console.error.bind(console));

    function initData(u, m) {
        users = u;
        messages = m;
        initUsers();
        initMessages();
    }
}
function getUserById(id){
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id){
            return users[i].nickname;
        }
    }
}
function getIdByUsername(nickname){
    for (let i = 0; i < users.length; i++){
        if (users[i].nickname === nickname){
            return  users[i].id;
        }
    }
}

function initUsers() {
    for (let i = 0; i < users.length; i++) {
        addUser(users[i])
    }
}

function addUser(user) {
    let li = document.createElement("li");
    li.setAttribute("id", user.id);

    //let status = document.createElement();
    //li.appendChild(status);

    /*let avatar = document.createElement("img")
    avatar.setAttribute("src", "img/avatar_icon_" + user.avatar + ".svg");
    avatar.setAttribute("height", "20px");
    avatar.setAttribute("width", "20px");

    li.appendChild(avatar);
    */
    li.innerText = user.nickname;

    // document.getElementById("userList").appendChild(li);

}
function removeUser(id){
    let ul = document.getElementById("userList");
    let li = ul.childNodes;
    for (let i = 1; i !== li.length; i++){
        if(li[i].id === id){
            ul.removeChild(ul.childNodes[i])
            return;
        }
    }
}

function initMessages() {
    for (let i = 0; i < messages.length; i++) {
        addMessages(messages[i])
    }
}

function addMessages(message) {
    let section = document.createElement("section");
    section.className = "message";
    section.setAttribute("id", message.id);

    let userName = document.createElement("span");
    userName.appendChild(document.createTextNode(getUserById(message.userId)));
    section.appendChild(userName);
    console.log(message.userId)
    console.log(localStorage.getItem("id"))
    if (parseInt(message.userId) === parseInt(localStorage.getItem("id"))){
        section.className = "own-message";
        console.log("TT")
    }



    let messageText = document.createElement("p");
    messageText.appendChild(document.createTextNode(message.message));
    section.appendChild(messageText);

    let timestamp = document.createElement("p");
    timestamp.appendChild(document.createTextNode(message.timestamp));
    section.appendChild(timestamp);

    document.getElementById("messageList").appendChild(section);
}

function deleteUser(){
    let username = document.getElementById('delUsername').value;
    let id = getIdByUsername(username);
    const serverCon = 'http://localhost:8080/api/Users/' + id;

    if (username === localStorage.getItem("nickname")){
        alert("You can't delete yourself")
        return;
    }
    else if (username === ""){
        return;
    }

    fetch(serverCon, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
    }).then(function (response){
        if (response.status === 200) {
            return response.json();
        } else {
            console.log("nicht 200")
        }
    }).then(function (json){
        console.log(username + " was deleted")
    }).catch(err => console.log("exc", err));
}

function startWebSocket(){
    const ws = new WebSocket('ws://localhost:8080/ws')

    ws.onerror = function (event) {
        console.error('Websocket Error', event);
    }
    ws.onmessage = function (event){
        handleMessage(event.data);
    }
    ws.onopen = function (event){

    }
    ws.onclose = function (event){
        document.getElementById("pfooter").innerHTML = "Not connected!";
    }
    document.getElementById("pfooter").innerHTML = "Websocket connected!";
}

function handleMessage(input){
    const jsonObject = JSON.parse(input);
    console.log(jsonObject);
    const action = jsonObject.action;
     console.log(action);
    if (action === "user_added"){
        addUser({"id" : jsonObject.data.id, "nickname" : jsonObject.data.nickname})
    }
    else if (action === "user_deleted"){
        removeUser(jsonObject.data.id);
    }
}

function loadJava(){
    startWebSocket();
    // var input = document.getElementById("delUsername");
    // var messageInput = document.getElementById("message");
    // messageInput.addEventListener("keyup", function(event) {
    //     if (event.keyCode === 13) {
    //         event.preventDefault();
    //         handleMessage(messageInput.textContent);
    //     }
    // });
    // input.addEventListener("keyup", function(event) {
    //     if (event.keyCode === 13) {
    //         event.preventDefault();
    //         deleteUser();
    //     }
    // });
}
