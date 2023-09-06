const express = require('express');
const apiRouter = express.Router();
const cookieParser = require('cookie-parser');

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const db = require("./db/db_mock");

const {
    TokenMiddleware,
    generateToken,
    removeToken,
} = require("../middleware/TokenMiddleware");


/************\
* API ROUTES *
\************/
let follows = require('./db/data/follows.json');
let howls = require('./db/data/howls.json');
let users = require('./db/data/users.json');

apiRouter.use(express.json());

//  FROM STACKOVERFLOW GUIDE: https://stackoverflow.com/questions/48315990/update-a-restful-resource-adding-an-element-or-deleting-an-element-from-its-set
// GET    /api/Aggregation/{key}        - to get the entire set.
// DELETE /api/Aggregation/{key}        - to delete the entire set.
// PUT    /api/Aggregation/{key}        - to replace the set
// POST   /api/Aggregation/{key}        - to add something to the set
// GET    /api/Aggregation/{key}/{item} - to retrieve a single item
// PUT    /api/Aggregation/{key}/{item} - to update an item (or create an item by name)
// DELETE /api/Aggregation/{key}/{item} - to delete an item
// getting a specific user's object



apiRouter.post('/register', (req, res) => {
  // Implement user registration logic here
  // After registration, generate a JWT token and send it back to the client
}); 

// LOGIN: authenticate a user 
// LOGIN: authenticate a user
//user tries to login
apiRouter.post("/login/users", (req, res) => {
    if (req.body.username && req.body.password) {
        console.log('are we in here?');
        //if user exists using values inputted by user
        console.log(`username: ${req.body.username} & pass: ${req.body.password}` );
        db.getUserByCredentials(req.body.username, req.body.password)
            .then((user) => {
                console.log("inside user cred? "); 
                let result = {
                    user: user,
                };

                generateToken(req, res, user);

                return res.json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(err.code).json({ error: err.message });
            });
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
});

// LOGOUT: current authenticated user
// Logout route
apiRouter.post("/logout/users", (req, res) => {
    removeToken(req, res);
    res.json({ success: true });
});
  
// GET CURRENT AUTHENTICATED USER
apiRouter.get('/current/users', TokenMiddleware, (req, res) => {
    console.log(`res.json(req.user): ${req.user.username}`)

    return res.json(req.user);
});

// GET USER: get user object by Id
apiRouter.get('/getUsersById/users/:userId', (req, res) => {
    const userId = req.params.userId; 
    let user = users.find(user => user.id == userId); 
    if(user) {
        res.json(user);
    } else {
        res.status(404).json({error: 'User not found'});
    }
});

//  POST howl: creating a new howl
apiRouter.post('/howls/:userId', (req, res) => {

    let newHowl = req.body; 
    howls.push(newHowl);
    res.json(newHowl);
});


// GET HOWLS by USER: getting howls posted by a specific user
apiRouter.get('/users/:userId/howls', (req,  res) => {
    const userId = req.params.userId; 
        const results = howls.filter(howl => userId == howl.userId); 
        results.sort((x, y) => new Date(x.datetime) < new Date(y.datetime) ? 1 : -1);
    
        const getUserByID = (id) => users.find(user => user.id == id);
        results.forEach(howl => howl['user'] = getUserByID(howl.userId));
        results.forEach(howl => howl['datetime'] = formatDate(new Date(howl.datetime)) );

        if(results) {
            res.json(results);
        } else {
            res.status(404).json({error: 'User can\'t be found'});
        }
  });
  
  
//https://stackoverflow.com/questions/25159330/how-to-convert-an-iso-date-to-the-date-format-yyyy-mm-dd
// https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
// FORMAT DATE FUNCTION 
  function formatDate(d) {
    // console.log("date: " + d); 
    let date = d.toLocaleDateString(); 
    let time = d.toTimeString().substring(0, d.toTimeString().indexOf("GMT")); 

    let hours = time.substring(0, 2); 
    let minutesAndSeconds = time.substring(2);

    if(hours > 12) {
        hours = hours - 12; 

        time = date + " " + hours + minutesAndSeconds + "PM"; 
    } else if(hours == '00') {
        hours = 12; 
        time = date + " " + hours + minutesAndSeconds + "AM"; 

    } else {
        time = date + " " + hours + minutesAndSeconds + "AM"; 
    }

    return time; 
}

// GET HOWLS by ALL USERS FOLLOWED by CURRENT USER: geting howls posted by all users followed by the "authenticated" user
apiRouter.get('/follows/:currentUserId/howls', (req, res) => {
    const currentUserId = req.params.currentUserId; 
    let listOfFollowers = follows[currentUserId].following; 
        const results = howls.filter(howl => listOfFollowers.includes(howl.userId) || howl.userId == currentUserId); 
        results.sort((x, y) => new Date(x.datetime) < new Date(y.datetime) ? 1 : -1);
        const getUserByID = (id) => users.find(user => user.id == id);
        results.forEach(howl => howl['user'] = getUserByID(howl.userId) || getUserByID(currentUserId));

        results.forEach(howl => howl['datetime'] = formatDate(new Date(howl.datetime)) );


        if(results) {
            res.json(results);
        } else {
            res.status(404).json({error: 'User can\'t be found'});
        }
});

// GET LIST of USERS by USER: getting a list of users followed by a specific user 
apiRouter.get('/follows/:userId/users', (req, res) => {
    const userId = req.params.userId; 
    let listOfFollowers = follows[userId].following; 
    const results = users.filter(user => listOfFollowers.includes(user.id)); 
    if(results) {
        res.json(results);
    } else {
        res.status(404).json({error: 'User can\'t be found'});
    }
});


// POST to FOLLOW USER: following a user
apiRouter.post('/followUser/:currentUserId/follows', (req, res) => {
    let currUserId = req.params.currentUserId; 
    let followThisUser = req.body; 
    console.log("followThisUser: " + followThisUser.id); 
    follows[currUserId].following.push(followThisUser.id);

    let updatedFollowingList = follows[currUserId].following; 
    if(updatedFollowingList) {
        res.json(updatedFollowingList);  
    } else {
        res.status(404).json({error: 'User not found'});
    }
});


// POST howl: posting a new Howl 
apiRouter.post('/postNewHowl/:currentUserId/howls', (req, res) => {
    let currUserId = req.params.currentUserId; 
    let howlText = req.body; 
   
    // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array
    let getLastId = howls.slice(-1); 
    let howlId =  getLastId[0].id;
    howlId = howlId + 1; 

    let newHowl = {
        "id": howlId,
        "userId": currUserId,
        "datetime": howlText.datetime,
        "text": howlText.text
    }

    howls.push(newHowl);
    res.json(newHowl);
});


// DELETE: unfollowing a user 
// unfollowUser/6/from/1/follows
// https://stackoverflow.com/questions/65015000/how-do-i-use-express-js-app-delete-to-remove-a-specific-object-from-an-array#:~:text=Assuming%20your%20array%20is%20just,req%2C%20res)%20%7B%20console.
// https://www.freecodecamp.org/news/how-to-remove-an-element-from-a-javascript-array-removing-a-specific-item-in-js/#remove-an-element-at-any-position-of-an-array-with-slice-and-concat
apiRouter.delete('/unfollowUser/:unfollowThisUser/from/:currentUserId/follows', (req, res) => {
    let currentUserId = req.params.currentUserId; 
    var unfollowThisUser = req.params.unfollowThisUser; 
    let length = follows[currentUserId].following.length; 

    let updatedUnfollowedList = [];  
    for (let i = 0; i < length; i++) {
        if (follows[currentUserId].following[i] != unfollowThisUser) {
            updatedUnfollowedList.push(follows[currentUserId].following[i]); 
        }
    }

    follows[currentUserId].following = updatedUnfollowedList; 



    if(follows[currentUserId].following){
        res.json(follows[currentUserId].following); 

    } else {
         res.status(404).json({error: 'User can\'t be unfollowed'});
    }
});

module.exports = apiRouter;