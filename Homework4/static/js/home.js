import api from './APIClient.js';
// LOGOUT FUNCTIONALITY

var currentUser = ''; 
api.getCurrentAuthUser().then((user) => {
    currentUser = user; 
    // Get id from URL
    var currentUserId = currentUser.id; 

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
                
                const br = document.createElement('br');
                results.appendChild(br);
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

        let newHowl = {
            "userId": currentUserId, 
            "datetime": newDate,
            "text": howlText.value 
        }

        api.createNewHowl(currentUserId, newHowl).then(newHowl => {
            howlText.value =""; 
            updateHowlsList(); 
        });
    });


    //--------------------------------------------------------------



    // creates Howl HTML
    function createHowlHTML(howl) {

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
        userAvatar.src = howl.user.avatar;
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
        aHowl.href = "/profile?id=" + howl.userId; 

        // h6
        const h6Howl = document.createElement('h6');
        h6Howl.classList.add('fw-bold'); 
        h6Howl.classList.add('mb-1'); 

        //     Stu Dent
        h6Howl.innerHTML = howl.user.first_name + ' ' + howl.user.last_name;

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
        span2.innerHTML = "@" + howl.user.username; 

    
        //  <div class="d-flex align-items-center mb-3">
        const howlDate = document.createElement('div');
        howlDate.setAttribute('id', 'howlDate');
        howlDate.classList.add('d-flex');
        howlDate.classList.add('align-items-center');
        howlDate.classList.add('mb-3');

        const pDateTime = document.createElement('p'); 
        pDateTime.classList.add('mb-0');

        var temp = new Date(howl.datetime);

        pDateTime.innerHTML = temp.toLocaleString();

        // <p style="line-height: 1.2;"> </p>
        const pHowl = document.createElement('p'); 
        pHowl.classList.add('mb-0');
        pHowl.innerHTML = howl.text; 

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


