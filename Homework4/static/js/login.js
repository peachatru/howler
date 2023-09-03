import api from './APIClient.js'; 

const form = document.querySelector('form'); 
const usernameLogin = document.getElementById('usernameLogin');

// checks if username exists in the json data, and if so, then return the object
form.addEventListener('submit', e => {
    api.login(usernameLogin.value).then(usernameData => {
        localStorage.setItem('user', usernameData.username); 

        localStorage.setItem('authUserId', usernameData.id); 

        document.location = "/homepage"; 
    }).catch((err) => {
        alert("User doesn't exist"); 
        return; 
    })
});