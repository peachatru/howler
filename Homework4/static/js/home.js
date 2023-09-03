import api from './APIClient.js'; 

// Get id from URL
const query = window.location.search;
let parameters = new URLSearchParams(query);
var id = parameters.get('id');


var currentUser = localStorage.getItem('user'); 
var currentUserId = localStorage.getItem('authUserId'); 

var currUserObject; 

// displays the Student's username and Avatar in the navbar 
api.getCurrentAuthUser(currentUser).then(currUser => {
    const aTag = document.getElementById('userNameNavbar'); 
    aTag.href = "/profile?id=" + currUser.id; 


    const currAuthUsername = document.getElementById("currentAuthUsername");
    currAuthUsername.innerHTML = "@" + currUser.username; 

    const currAuthAvatar = document.getElementById("userPFP"); 
    currAuthAvatar.src = currUser.avatar; 

    const navbar = document.getElementById('navBarProfile');
    navbar.href = "/profile?id=" + currentUserId; 

    currUserObject = currUser;
});


// displays list of howls from followers of user AND posts from user 
updateHowlsList(); 

function resetHowlsList() {
    const results = document.getElementById('howlsList'); 
    results.innerHTML = ""; 
}

function updateHowlsList() {
    resetHowlsList(); 

    api.getAllHowlsFollowedByUser(currentUserId).then(howlsList => {
        const results = document.getElementById('howlsList'); 
    
        howlsList.forEach(howl => {
            results.append(createHowlHTML(howl));
            // console.log("howl: " + howl); 
        })
    });
    
}

// creates new howl when user makes post
const howlButton = document.getElementById('howlButton'); 
const howlText = document.getElementById('howlTextContent'); 
howlButton.addEventListener('click', e => {

     // For todays date:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
    var newDate = new Date();
    newDate = newDate.toJSON(); 
    console.log("newDate: " + newDate); 

    
    let newHowl = {
        "userId": currentUserId, 
        "datetime": newDate,
        "text": howlText.value 
    }

    api.createNewHowl(currentUserId, newHowl).then(newHowl => {
        howlText.value =""; 
        updateHowlsList(); 
    });

    // Format of Howl Data should be: 
    // {
    //     "id": 97,
    //     "userId": 5,
    //     "datetime": "2020-09-07T12:16:43Z",
    //     "text": "Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet."
    //   },
});


//--------------------------------------------------------------



// creates Howl HTML
function createHowlHTML(howl) {

     // <div class="d-flex p-3 border-bottom">
     const item = document.createElement('div');
     item.classList.add('d-flex');
     item.classList.add('p-3');
     item.classList.add('border-bottom');
  
     // <img src="./images/user-pfp.png" class="rounded-circle" id="messageFeedPFP" alt="Avatar" loading="lazy" />
     const userAvatar = document.createElement('img'); 
     userAvatar.src = howl.user.avatar;
     userAvatar.classList.add('rounded-circle'); 
     userAvatar.setAttribute('id', 'messageFeedPFP'); 
     userAvatar.setAttribute('alt', 'avatar');
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
     aHowl.href = "/profile?id=" + howl.userId; 
 
     
     // <h6 class="text-body">
     const h6Howl = document.createElement('h6'); 
     h6Howl.classList.add('text-body'); 
     //     Stu Dent
     h6Howl.innerHTML = howl.user.first_name + ' ' + howl.user.last_name;
 
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
     span2.innerHTML = "@" + howl.user.username; 
 
  //     <span class="small text-muted font-weight-normal float-end">October 1st, 10:30pm</span>
     const span3 = document.createElement('span');
     span3.classList.add('small');
     span3.classList.add('text-muted');
     span3.classList.add('font-weight-normal'); 
     span3.setAttribute('id', 'howlDatetime');

    //  span3.classList.add('float-end');
     span3.innerHTML = howl.datetime; 
 
     h6Howl.appendChild(span1);
     h6Howl.appendChild(span2);
     h6Howl.appendChild(span3);
 
     aHowl.appendChild(h6Howl);
 
     howlContent.appendChild(aHowl);

    
 
 
      // <p style="line-height: 1.2;"> </p>
      const pHowl = document.createElement('p'); 
      pHowl.innerHTML = howl.text; 
 
      howlContent.appendChild(pHowl);
 
      flexDiv.appendChild(howlContent); 

      divBlock.appendChild(flexDiv);
      item.appendChild(userAvatar); 
      item.appendChild(divBlock);

    //   item.appendChild(flexDiv); 
    //   console.log('this is item results: ' + item.innerHTML)
 
    return item; 


}


//--------------------------------------------------------------
