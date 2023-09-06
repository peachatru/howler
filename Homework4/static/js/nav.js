
import api from './APIClient.js'; 

// displays the Student's username and Avatar in the navbar 
var currentUser = ''; 
var currUserId;
api.getCurrentAuthUser().then((user) => {
    currentUser = user; 
    currUserId = user.id;

    const aTag = document.getElementById('userNameNavbar'); 
    aTag.href = "/profile?id=" + currentUser.id; 
    const currAuthUsername = document.getElementById("currentAuthUsername");
    currAuthUsername.innerHTML = "@" + currentUser.username; 

    const currAuthAvatar = document.getElementById("userPFP"); 
    currAuthAvatar.src = currentUser.avatar; 

    const navbar = document.getElementById('navBarProfile');
    navbar.href = "/profile?id=" + currentUser.id; 

    currUserId = currentUser.id; 
});



// START LOGOUT FUNCTIONALITY 
let logoutButton = document.getElementById("logOutButton"); 

logoutButton.addEventListener('click', () => {
    currentUser = ""; 
    api.getCurrentAuthUser().then((user) => {
        currentUser = user; 
    });

    api.logout(currentUser.username, currentUser.password).then(() => {
        document.location = "/"; 
    });
});

// END LOGOUT FUNCTIONALITY 


