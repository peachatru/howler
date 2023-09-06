
import api from './APIClient.js'; 

// Get id from URL
const query = window.location.search;
let parameters = new URLSearchParams(query);
var id = parameters.get('id');

// GETTING CURRENT USER
var currentUser = ''; 
var currUserId;
api.getCurrentAuthUser().then((user) => {
    currentUser = user; 
    currUserId = user.id;

    //Retrieve user
    api.getUserById(id).then(userProfile => {
        
        const userNamePFP = document.getElementById('userProfileName');
        const h3User = document.createElement('h3');
        h3User.innerHTML = '@' + userProfile.username;

        // <a href="">
        const aHowl = document.createElement('a'); 
        aHowl.href = "/profile?id=" + userProfile.id; 

        // h3User.append(main);

        aHowl.appendChild(h3User); 
        userNamePFP.append(aHowl);

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
        //     Stu Dent
        h3.innerHTML = userProfile.first_name + ' ' + userProfile.last_name;

        const brTag = document.createElement('br'); 

        h3.appendChild(brTag);
        //     <span class="small text-muted font-weight-normal">@student</span>
        const span2 = document.createElement('span');
        span2.classList.add('small');
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
        // checks if the current user is following the user shown in the profile page
    
        
        if(userProfile.id == currUserId) {
            followButton.style.display = "none";
        } 

        // Function to update the follow button based on the follow state
        async function updateFollowButton() {
            try {
                const follows = await api.getAllUsersFollowedByUser(currUserId);
                let isFollowing = follows.includes(userProfile.id);

                follows.forEach(userId => {
                    if(userId.id == userProfile.id) {
                        isFollowing = true;
                    }
                });
                
                if (isFollowing) {
                    followButton.innerHTML = "Unfollow";

                } else {
                    followButton.innerHTML = "Follow";

                }
            } catch (error) {
                console.error("Error fetching follow data:", error);
            }
        }

        // Initial update of the follow button
        updateFollowButton();

        // Add click event listener for follow/unfollow
        followButton.addEventListener('click', async () => {
            try {
                const follows = await api.getAllUsersFollowedByUser(currUserId);
                let isFollowing = follows.includes(userProfile.id);

                follows.forEach(userId => {
                    if(userId.id == userProfile.id) {
                        isFollowing = true;
                    }
                });

                if (isFollowing) {
                    // Unfollow
                    followButton.innerHTML = "Follow";
                    await api.unfollowUser(userProfile.id, currUserId);
                    isFollowing = false; 
                } else {
                    // Follow
                    followButton.innerHTML = "Unfollow";
                    await api.followNewUser(currUserId, userProfile);
                    isFollowing = true;
                }
            } catch (error) {
                console.error("Error updating follow status:", error);
            }
        });
        
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

        userList.forEach(user => {
            main.append(displayListOfFollowers(user));
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
        //     Stu Dent
        h3.innerHTML = user.first_name + ' ' + user.last_name;

        //     <span class="small text-muted font-weight-normal"> • </span>
        const span1 = document.createElement('span');
        span1.classList.add('small');
        span1.classList.add('font-weight-normal'); 
        span1.setAttribute('id', 'userDot');
        span1.innerHTML = "•";

        //     <span class="small text-muted font-weight-normal">@student</span>
        const span2 = document.createElement('span');
        span2.classList.add('small');
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
            const br = document.createElement('br');
            results.appendChild(br);
        })
    });

    // displays all howls by user on their profile page
    function displayHowlsByUser(userData) {
    
        // <div class="card-body p-4 border-bottom">
        const item = document.createElement('div');
        item.classList.add('card-body');
        item.classList.add('p-4');
        
        // <div class="d-flex flex-start">
        const divFlex = document.createElement('div'); 
        divFlex.classList.add('d-flex');
        divFlex.classList.add('flex-start');

        // <img src="https://robohash.org/veniamdoloresenim.png?size=64x64&amp;set=set1" class="rounded-circle shadow-1-strong me-3" id="messageFeedPFP" alt="avatar" style="height: 50px;">

        const userAvatar = document.createElement('img'); 
        userAvatar.src = userData.user.avatar;
        userAvatar.classList.add('rounded-circle'); 
        userAvatar.classList.add('shadow-1-strong'); 
        userAvatar.classList.add('me-3'); 
        userAvatar.style.height = "80%";


        userAvatar.setAttribute('id', 'messageFeedPFP'); 
        userAvatar.setAttribute('alt', 'avatar');

        // <div id="howlContentBlock">
        const divBlock = document.createElement('div'); 
        divBlock.setAttribute('id', 'howlContentBlock');  

        // <a href="">
        const aHowl = document.createElement('a'); 
        aHowl.href = "/profile?id=" + userData.userId; 

        // h6
        const h6Howl = document.createElement('h6');
        h6Howl.classList.add('fw-bold'); 
        h6Howl.classList.add('mb-1'); 
    
        //     Stu Dent
        h6Howl.innerHTML = userData.user.first_name + ' ' + userData.user.last_name;
    
        //     <span class="small text-muted font-weight-normal"> • </span>
        const span1 = document.createElement('span');
        span1.classList.add('small');
        span1.classList.add('font-weight-normal'); 
        span1.setAttribute('id', 'userDot');
        span1.innerHTML = "•";
    
        //     <span class="small text-muted font-weight-normal">@student</span>
        const span2 = document.createElement('span');
        span2.classList.add('small');
        span2.classList.add('font-weight-normal'); 
        span2.innerHTML = "@" + userData.user.username; 
    
        
        //  <div class="d-flex align-items-center mb-3">
        const howlDate = document.createElement('div');
        howlDate.setAttribute('id', 'howlDate');
        howlDate.classList.add('d-flex');
        howlDate.classList.add('align-items-center');
        howlDate.classList.add('mb-3');
    
        const pDateTime = document.createElement('p'); 
        pDateTime.classList.add('mb-0');
    
        var temp = new Date(userData.datetime);
        var newDate = new Date(temp.getTime() - temp.getTimezoneOffset()*60*1000);
    
    
        pDateTime.innerHTML = newDate.toLocaleString();
    
        // <p style="line-height: 1.2;"> </p>
        const pHowl = document.createElement('p'); 
        pHowl.classList.add('mb-0');
        pHowl.innerHTML = userData.text; 
    
        // append children to parent!
        h6Howl.appendChild(span1);
        h6Howl.appendChild(span2);
    
        aHowl.appendChild(h6Howl);
    
    
        howlDate.appendChild(pDateTime); 
    
        divBlock.appendChild(aHowl);
        divBlock.appendChild(howlDate); 
        divBlock.appendChild(pHowl); 
    
    
        divFlex.appendChild(userAvatar); 
        divFlex.appendChild(divBlock); 
    
        item.appendChild(divFlex);
    
        return item; 
    }
});


