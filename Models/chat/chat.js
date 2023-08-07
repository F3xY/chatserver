let users = new Array();
let messages = new Array();

let messageList = null;
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

function getUserById(id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            return users[i].nickname;
        }
    }
}

function getIdByUsername(nickname) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].nickname === nickname) {
            return users[i].id;
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

    document.getElementById("userList").appendChild(li);

}

function removeUser(id) {
    let ul = document.getElementById("userList");
    let li = ul.childNodes;
    for (let i = 1; i !== li.length; i++) {
        if (li[i].id === id) {
            ul.removeChild(ul.childNodes[i])
            return;
        }
    }
}

function removeMessage(id) {
    let messageList = document.getElementById("messageList");
    let messages = messageList.childNodes;
    for (const i in messages) {
        if (messages[i].id === String(id)) {
            let messageToRemove = document.getElementById(String(id));
            messageToRemove.classList.add("deleted-item");
            setTimeout(() => {
                messageToRemove.remove()
            }, 300);
        }
    }
}


function initMessages() {
    for (let i = 0; i < messages.length; i++) {
        addMessage(messages[i])
    }
}

function addMessage(message) {
    let userMessage = document.createElement("section");
    userMessage.className = "message";
    userMessage.setAttribute("id", message.id);


    let messageHeader = document.createElement("div");
    messageHeader.className = "messageHeader";

    let userName = document.createElement("p");
    userName.appendChild(document.createTextNode(getUserById(message.userId)));
    userName.className = "username";
    messageHeader.appendChild(userName);

    if (parseInt(message.userId) === parseInt(localStorage.getItem("id"))) {
        userMessage.className = "own-message";

        let deleteIcon = document.createElement("i");
        deleteIcon.setAttribute("class", "fa-solid fa-trash");
        deleteIcon.addEventListener("click", function () {
            deleteMessage(message.id);
        })

        messageHeader.appendChild(deleteIcon)
    }
    userMessage.appendChild(messageHeader);

    let messageText = document.createElement("p");
    messageText.className = "messageText";
    messageText.appendChild(document.createTextNode(message.message));
    userMessage.appendChild(messageText);

    let timestamp = document.createElement("p");
    timestamp.className = "timestamp";

    let time = moment(Date.parse(message.timestamp)).format("DD-MM-YYYY HH:mm");
    timestamp.appendChild(document.createTextNode(time));
    userMessage.appendChild(timestamp);

    let willScroll = scrollToBottom();
    document.getElementById("messageList").appendChild(userMessage);

    if (willScroll) {
        messageList.scrollTop = messageList.scrollHeight;
    }
}

function scrollToBottom() {
    return !(Object.is(messageList, null)) && messageList.scrollHeight - messageList.scrollTop === 766;
}

function logout(){
    localStorage.clear();
    validateUser();
}

function deleteUser() {
    let id = localStorage.getItem("id");
    const serverCon = 'http://localhost:8080/api/Users/' + id;

    const confirmed = confirm("Are you sure you want to delete your account?");

    if (confirmed){
        fetch(serverCon, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        }).then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log("nicht 200")
            }
        }).then(function (json) {
            console.log(username + " was deleted")
        }).catch(err => console.log("exc", err));

        localStorage.clear();
        validateUser();
    }
}

function startWebSocket() {
    const ws = new WebSocket('ws://localhost:8080/ws')

    ws.onerror = function (event) {
        console.error('Websocket Error', event);
    }
    ws.onmessage = function (event) {
        handleMessage(event.data);
    }
    ws.onopen = function (event) {

    }
    ws.onclose = function (event) {
        document.getElementById("pfooter").innerHTML = "Not connected!";
    }
    document.getElementById("pfooter").innerHTML = "Websocket connected!";
}

function handleMessage(input) {
    const jsonObject = JSON.parse(input);
    console.log(jsonObject);
    const action = jsonObject.action;
    console.log(action);
    if (action === "user_added") {
        addUser({"id": jsonObject.data.id, "nickname": jsonObject.data.nickname})
    } else if (action === "user_deleted") {
        removeUser(jsonObject.data.id);
    } else if (action === "message_added") {
        addMessage(jsonObject.data);
    } else if (action === "message_deleted") {
        removeMessage(jsonObject.data);
    }
}

function sendMessage(message) {
    const serverCon = 'http://localhost:8080/api/Messages'
    fetch(serverCon, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({"message": message, "userId": localStorage.getItem("id")})
    }).then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            console.log("nicht 200")
        }
    }).then(function (json) {
    }).catch(err => console.log("exc", err));
}

function validateUser() {
    if (localStorage.getItem("id") === null) {
        window.location.href = "../index/index.html"
    } else {
        if (!fetch(requestArray[0] + '/' + localStorage.getItem("id"), {method: 'GET'})
            .then(
                function (response) {
                    return response.status === 500;
                })) {
            window.location.href = "../index/index.html"
        }
    }
}

function deleteMessage(messageId) {
    fetch('http://localhost:8080/api/Messages/' + messageId, {method: 'DELETE'}).then(r => console.log(r));
}

function loadJava() {
    startWebSocket();
    validateUser()

    const messageInput = document.getElementById("messageInput");
    messageList = document.getElementById("messageList");
    messageInput.addEventListener('keydown', function (e) {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage(messageInput.value);
        }
    });
}
