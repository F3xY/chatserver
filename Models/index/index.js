

function newUser(nickname){
    const serverCon = 'http://localhost:8080/api/Users'
    fetch(serverCon, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({"nickname" : nickname, "status" : "online"})
    }).then(function (response){
        if (response.status === 200) {
            return response.json();
        } else {
            console.log("nicht 200")
        }
    }).then(function (json){
        setUser({"id" : json["id"], "nickname" : nickname})
        chatWindow();
    }).catch(err => console.log("exc", err));
}

function setUser(user){
    localStorage.setItem("id", user["id"])
    localStorage.setItem("nickname", user["nickname"])
}

function setNickname(nickname) {
    if (nickname !== getNickname()){
        newUser(nickname)
    }
    else {
        chatWindow();
    }
}


function getNickname() {
    return (localStorage.getItem("nickname"));
}

function chatWindow(){
    window.location.href = "../chat/chat.html"
}
