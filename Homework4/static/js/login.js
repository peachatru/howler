import api from './APIClient.js'; 

const loginButton = document.querySelector('#submitLogin'); 

const usernameLogin = document.querySelector('#usernameLogin');
const passwordLogin = document.querySelector('#passwordLogin');
// checks if username exists in the json data, and if so, then return the object
loginButton.addEventListener("click", (e) => {
    api.login(usernameLogin.value, passwordLogin.value)
        .then((userData) => {
            document.location = "/homepage";
            var currentUser = userData; 
        })
        .catch((err) => {
            alert("Unable to login!");
            console.log(err);
        });
});
