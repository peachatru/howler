
import api from './APIClient.js'; 

var currentUser = localStorage.getItem('user'); 

var currUserId; 

// displays the Student's username and Avatar in the navbar 
api.getCurrentAuthUser(currentUser).then(currUser => {

    const aTag = document.getElementById('userNameNavbar'); 
    aTag.href = "/profile?id=" + currUser.id; 
    const currAuthUsername = document.getElementById("currentAuthUsername");
    currAuthUsername.innerHTML = "@" + currUser.username; 

    const currAuthAvatar = document.getElementById("userPFP"); 
    currAuthAvatar.src = currUser.avatar; 

    const navbar = document.getElementById('navBarProfile');
    navbar.href = "/profile?id=" + currUser.id; 

    currUserId = currUser.id; 

    console.log("currUsername: " + currAuthUsername);
    console.log("curravatar: " + currAuthAvatar);

});

const logOutButton = document.getElementById('logOutButton');
logOutButton.addEventListener('click', e => {
    api.logout().then(e => {

        document.location = "/"; 
    }).catch((err) => {
        alert("Unable to logout"); 
        return; 
    })
});



// Get id from URL
const query = window.location.search;
let parameters = new URLSearchParams(query);
var id = parameters.get('id');

console.log('id from url: ' + id);