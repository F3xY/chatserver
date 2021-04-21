const storagePath = "/chat/user/local/"

function setAll(firstName, lastName, email, zipCode, city, country) {
    localStorage.setItem(storagePath + getNickname() + "/firstName", firstName)
    localStorage.setItem(storagePath + getNickname() + "/lastName", lastName)
    localStorage.setItem(storagePath + getNickname() + "/email", email)
    localStorage.setItem(storagePath + getNickname() + "/zipCode", zipCode)
    localStorage.setItem(storagePath + getNickname() + "/city", city)
    localStorage.setItem(storagePath + getNickname() + "/country", country)
}

function getFirstName() {
    return localStorage.getItem(storagePath + getNickname() + "/firstname")
}
function getLastName() {
    return localStorage.getItem(storagePath + getNickname() + "/lastName")
}
function getEmail() {
    return localStorage.getItem(storagePath + getNickname() + "/email")
}
function getZipCode() {
    return localStorage.getItem(storagePath + getNickname() + "/zipCode")
}
function getCity() {
    return localStorage.getItem(storagePath + getNickname() + "/city")
}
function getCountry() {
    return localStorage.getItem(storagePath + getNickname() + "/country")
}
