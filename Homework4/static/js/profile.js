
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


// Get id from URL
const query = window.location.search;
let parameters = new URLSearchParams(query);
var id = parameters.get('id');

console.log('id from url: ' + id);

//Retrieve user
api.getUserById(id).then(userProfile => {
    //   <div class="border border-left border-right px-0" id="profileFollowsMain">
    const main = document.getElementById('userProfileBlock');
    main.append(createProfilePage(userProfile));
});

// displays profile page
function createProfilePage(userProfile) {
    //   <div class="d-flex p-3 border-bottom">
    const item = document.createElement('div');
    item.classList.add('d-flex');
    item.classList.add('p-3');
    item.classList.add('border-bottom');

    //   <img src="./images/user-pfp.png" class="rounded-circle" id="userProfilePFP"
    //   alt="Avatar" loading="lazy" />
    const userAvatar = document.createElement('img'); 
    userAvatar.src = userProfile.avatar;
    userAvatar.classList.add('rounded-circle'); 
    userAvatar.setAttribute('id', 'userProfilePFP'); 
    userAvatar.setAttribute('alt', 'Avatar pic');
    userAvatar.setAttribute('loading', 'lazy'); 

    const divBlock = document.createElement('div'); 
    divBlock.setAttribute('id', 'howlContentBlock'); 

    // <div class="d-flex w-100 ps-3">
    const flexDiv = document.createElement('div');
    flexDiv.classList.add('d-flex');
    flexDiv.classList.add('w-100');
    flexDiv.classList.add('ps-3');

    const profileContent = document.createElement('div');
    profileContent.setAttribute('id', 'profileContent');

    // <a href="">
    const aHowl = document.createElement('a'); 
    aHowl.href = "/profile?id=" + userProfile.id; 


    // <h3 class="text-body">
    const h3 = document.createElement('h3'); 
    h3.classList.add('text-body'); 
    //     Stu Dent
    h3.innerHTML = userProfile.first_name + ' ' + userProfile.last_name;

    const brTag = document.createElement('br'); 

    h3.appendChild(brTag);
    //     <span class="small text-muted font-weight-normal">@student</span>
    const span2 = document.createElement('span');
    span2.classList.add('small');
    span2.classList.add('text-muted');
    span2.classList.add('font-weight-normal'); 
    span2.innerHTML = "@" + userProfile.username; 

    //   <div class="d-flex align-items-center float-end">
    const followButtonDiv = document.createElement('div');
    followButtonDiv.classList.add('d-flex');
    followButtonDiv.classList.add('align-items-center');
    followButtonDiv.classList.add('float-end');
    // <input type="submit" id="FollowButton" value="Follow"/>
    const followButton = document.createElement('button'); 
    followButton.setAttribute('type', 'button');
    followButton.setAttribute('id', 'FollowButton'); 

    var followingUserBool = false; 
   
    // checks if the current user is following the user shown in the profile page
    if(userProfile.id == currUserId) {
        followButton.style.display = "none";
    } else {
        api.getAllUsersFollowedByUser(currUserId).then(userList => {
            userList.forEach(userId => {
                if(userProfile.id == userId.id) {
                    followingUserBool = true;
                }
            })
            // changes value of Button to indicate if current user is following them or not 
            if(followingUserBool) {
                followButton.innerHTML = "Unfollow";
            } else {
                followButton.innerHTML = "Follow";
            } 
        })
    }

    // updates button value and retrieves updated list of users after follow/unfollow
    followButton.addEventListener('click', e => {
        if(followingUserBool) {
            followButton.innerHTML = "Follow";
            followingUserBool = false; 

            console.log("userProfile id to unfollow: " + userProfile.id); 
            api.getUserById(userProfile.id).then(unfollowThisUser => {
                var userToUnFollow = unfollowThisUser; 
                api.unfollowUser(userProfile.id, currUserId); 

                api.getAllUsersFollowedByUser(currUserId).then(usersList => {
                })
            })
        } else {
            followButton.innerHTML = "Unfollow"; 
            followingUserBool = true; 

            api.getUserById(userProfile.id).then(followThisUser => {
                var userToFollow = followThisUser; 
                api.followNewUser(currUserId, userToFollow); 

                api.getAllUsersFollowedByUser(currUserId).then(usersList => {
                })
            })
        }
    });

    // followButton.
    // followButton.innerHTML = 'Follow'; 
    followButtonDiv.appendChild(followButton);

    h3.appendChild(span2); 
    aHowl.appendChild(h3); 

    profileContent.appendChild(aHowl); 
    flexDiv.appendChild(profileContent);

    item.appendChild(userAvatar);
    item.appendChild(flexDiv);
    item.appendChild(followButtonDiv);

    return item; 

}

// gets ALL users followed by user 
api.getAllUsersFollowedByUser(id).then(userList => {
    //   <div class="border border-left border-right px-0" id="profileFollowsMain">
    const main = document.getElementById('profileFollowsMain');
     // <div class="border border-left border-right px-0" >
     const item = document.createElement('div');
     item.classList.add('border'); 
     item.classList.add('border-left'); 
     item.classList.add('border-right'); 
     item.classList.add('px-0'); 
 
    //  <div class="p-3 border-bottom" id="followsBlock">
     const followsBlock = document.createElement('div');
     followsBlock.classList.add('p-3'); 
     followsBlock.classList.add('border-bottom'); 
     followsBlock.setAttribute('id', 'followsBlock'); 

 
     // <h4 class="d-flex align-items-center mb-0">
     const h4 = document.createElement('h4');
     h4.classList.add('d-flex');
     h4.classList.add('align-items-center');
     h4.classList.add('mb-0');
     h4.innerHTML = 'Follows';
 
     //  <i class="fas fa-angle-down ms-auto text-primary"></i>
     const arrowDrop = document.createElement('i'); 
     arrowDrop.classList.add('fas');
     arrowDrop.classList.add('fa-angle-down');
     arrowDrop.classList.add('ms-auto');
     arrowDrop.classList.add('text-primary');
 
     h4.appendChild(arrowDrop);
     followsBlock.appendChild(h4);

     main.append(followsBlock);
    userList.forEach(user => {
        main.append(displayListOfFollowers(user));
        console.log("user id: " + user.id);
    })
});


// DISPLAYS list of users 
function displayListOfFollowers(user) {
    const div1 = document.createElement('div');

    const div2 = document.createElement('div');

     //   <div class="d-flex p-3 border-bottom">
     const item2 = document.createElement('div');
     item2.classList.add('d-flex');
     item2.classList.add('p-3');
     item2.classList.add('border-bottom');
 
     //   <img src="./images/user-pfp.png" class="rounded-circle" id="userProfilePFP"
     //   alt="Avatar" loading="lazy" />
     const userAvatar = document.createElement('img'); 
     userAvatar.src = user.avatar;
     userAvatar.classList.add('rounded-circle'); 
     userAvatar.setAttribute('id', 'userProfilePFP'); 
     userAvatar.setAttribute('alt', 'Avatar pic');
     userAvatar.setAttribute('loading', 'lazy'); 
 
     const divBlock = document.createElement('div'); 
     divBlock.setAttribute('id', 'howlContentBlock'); 
 
     // <div class="d-flex w-100 ps-3">
     const flexDiv = document.createElement('div');
     flexDiv.classList.add('d-flex');
     flexDiv.classList.add('w-100');
     flexDiv.classList.add('ps-3');
 
     const profileContent = document.createElement('div');
     profileContent.setAttribute('id', 'profileContent');
 
     // <a href="">
     const aHowl = document.createElement('a'); 
     aHowl.href = "/profile?id=" + user.id; 
 
 
     // <h3 class="text-body">
     const h3 = document.createElement('h3'); 
     h3.classList.add('text-body'); 
     //     Stu Dent
     h3.innerHTML = user.first_name + ' ' + user.last_name;

    //     <span class="small text-muted font-weight-normal"> • </span>
    const span1 = document.createElement('span');
    span1.classList.add('small');
    span1.classList.add('text-muted');
    span1.classList.add('font-weight-normal'); 
    span1.innerHTML = "•";

     //     <span class="small text-muted font-weight-normal">@student</span>
     const span2 = document.createElement('span');
     span2.classList.add('small');
     span2.classList.add('text-muted');
     span2.classList.add('font-weight-normal'); 
     span2.innerHTML = "@" + user.username; 

     h3.appendChild(span1);
     h3.appendChild(span2);

     aHowl.appendChild(h3);

     profileContent.appendChild(aHowl);
     flexDiv.appendChild(profileContent);

    item2.appendChild(userAvatar);
    item2.appendChild(flexDiv);

     div2.appendChild(item2);
     div1.appendChild(div2);

    return div1; 

}

// gets ALL howls by specific user id
api.getHowlsByUserId(id).then(howlsList => {
    const results = document.getElementById('howlsList'); 
    howlsList.forEach(howl => {
        results.append(displayHowlsByUser(howl));
        console.log("howl: " + howl); 
    })
});

// displays all howls by user on their profile page
function displayHowlsByUser(userData) {
   
        // <div class="d-flex p-3 border-bottom">
        const item = document.createElement('div');
        item.classList.add('d-flex');
        item.classList.add('p-3');
        item.classList.add('border-bottom');
     
        // <img src="./images/user-pfp.png" class="rounded-circle" id="messageFeedPFP" alt="Avatar" loading="lazy" />
        const userAvatar = document.createElement('img'); 
        userAvatar.src = userData.user.avatar;
        userAvatar.classList.add('rounded-circle'); 
        userAvatar.setAttribute('id', 'messageFeedPFP'); 
        userAvatar.setAttribute('alt', 'Avatar pic');
        userAvatar.setAttribute('loading', 'lazy'); 
    
        const divBlock = document.createElement('div'); 
        divBlock.setAttribute('id', 'howlContentBlock'); 
    
        // <div class="d-flex w-100 ps-3">
        const flexDiv = document.createElement('div');
        flexDiv.classList.add('d-flex');
        flexDiv.classList.add('w-100');
        flexDiv.classList.add('ps-3');
    
        const howlContent = document.createElement('div');
        howlContent.setAttribute('id', 'howlContent');
    
        // <a href="">
        const aHowl = document.createElement('a'); 
        aHowl.href = "/profile?id=" + userData.userId; 
    
        
        // <h6 class="text-body">
        const h6Howl = document.createElement('h6'); 
        h6Howl.classList.add('text-body'); 
        //     Stu Dent
        h6Howl.innerHTML = userData.user.first_name + ' ' + userData.user.last_name;
    
        //     <span class="small text-muted font-weight-normal"> • </span>
        const span1 = document.createElement('span');
        span1.classList.add('small');
        span1.classList.add('text-muted');
        span1.classList.add('font-weight-normal'); 
        span1.innerHTML = "•";
    
        //     <span class="small text-muted font-weight-normal">@student</span>
        const span2 = document.createElement('span');
        span2.classList.add('small');
        span2.classList.add('text-muted');
        span2.classList.add('font-weight-normal'); 
        span2.innerHTML = "@" + userData.user.username; 
    
     //     <span class="small text-muted font-weight-normal float-end">October 1st, 10:30pm</span>
        const span3 = document.createElement('span');
        span3.classList.add('small');
        span3.classList.add('text-muted');
        span3.classList.add('font-weight-normal'); 
        span3.setAttribute('id', 'howlDatetime');
   
       //  span3.classList.add('float-end');
        span3.innerHTML = userData.datetime; 
    
        h6Howl.appendChild(span1);
        h6Howl.appendChild(span2);
        h6Howl.appendChild(span3);
    
        aHowl.appendChild(h6Howl);
    
        howlContent.appendChild(aHowl);
    
         // <p style="line-height: 1.2;"> </p>
         const pHowl = document.createElement('p'); 
         pHowl.innerHTML = userData.text; 
    
         howlContent.appendChild(pHowl);
    
         flexDiv.appendChild(howlContent); 
   
         divBlock.appendChild(flexDiv);
         item.appendChild(userAvatar); 
         item.appendChild(divBlock);
   
       return item; 
   

}