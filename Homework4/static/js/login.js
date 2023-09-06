import api from './APIClient.js'; 

const loginButton = document.querySelector('#submitLogin'); 

const usernameLogin = document.getElementById('usernameLogin');
const passwordLogin = document.getElementById('passwordLogin');
// checks if username exists in the json data, and if so, then return the object
loginButton.addEventListener('click', e => {
    api.login(usernameLogin.value, passwordLogin.value).then(userData => {
        localStorage.setItem('user', userData.username); 

        localStorage.setItem('authUserId', userData.id); 

        document.location = "/homepage"; 
    }).catch((err) => {
        alert("Invalid login!"); 
        return; 
    })
});