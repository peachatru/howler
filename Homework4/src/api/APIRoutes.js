const express = require('express');
const apiRouter = express.Router();

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto'); // Import the crypto library for password hashing

const { TokenMiddleware, generateToken } = require('../middleware/AuthMiddleware'); 
const API_SECRET = "60d0954e20eaa0c02b382171c33c53bc18522cc6d4805eaa02e182b0";


/************\
* API ROUTES *
\************/
let follows = require('../data/follows.json');
let howls = require('../data/howls.json');
let users = require('../data/users.json');

apiRouter.use(express.json());


// Add a helper function to verify passwords
function verifyPassword(user, password) {
    const hashedPassword = hashPassword(password, user.user.salt);
    return user.hashed_password === hashedPassword;
}

// Add a helper function to hash passwords
function hashPassword(password, salt) {
    // You should use a secure password hashing library, e.g., bcrypt
    // For demonstration purposes, we'll use a simple hash here
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}


//  FROM STACKOVERFLOW GUIDE: https://stackoverflow.com/questions/48315990/update-a-restful-resource-adding-an-element-or-deleting-an-element-from-its-set
// GET    /api/Aggregation/{key}        - to get the entire set.
// DELETE /api/Aggregation/{key}        - to delete the entire set.
// PUT    /api/Aggregation/{key}        - to replace the set
// POST   /api/Aggregation/{key}        - to add something to the set
// GET    /api/Aggregation/{key}/{item} - to retrieve a single item
// PUT    /api/Aggregation/{key}/{item} - to update an item (or create an item by name)
// DELETE /api/Aggregation/{key}/{item} - to delete an item
// getting a specific user's object

// // Example protected route
// router.get('/protected', authenticateToken, (req, res) => {
//     // Access user data through req.user
//     res.json({ message: 'This is a protected route.', user: req.user });
//   });

apiRouter.post('/register', (req, res) => {
  // Implement user registration logic here
  // After registration, generate a JWT token and send it back to the client
}); 

// LOGIN: authenticate a user 
// LOGIN: authenticate a user
apiRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.user.username === username);
  
    console.log(`user.user.username: ${user.user.username}`);
    console.log(`user.username: ${user.username}`);
    console.log(`user: ${user}`);

    if (!user || !verifyPassword(user, password)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
  
    // Generate a JWT token for the authenticated user
    const token = generateToken(user);
  
    // Set the token in a cookie
    res.cookie(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 1 hour expiration (adjust as needed)
    });
  
    res.json({ token, user });
  });
  
  
  
// apiRouter.get('/login/users/:username', TokenMiddleware, (req, res) => {
//     const username = req.params.username; 
//     let user = users.find(user => user.username == username); 
//     if(user) {
//         res.json(user);
//     } else {
//         res.status(404).json({error: 'User not found'});
//     }
//     // Implement user login logic here
//   // After successful login, generate a JWT token and send it back to the client
  
// });

// LOGOUT: current authenticated user
// Logout route
apiRouter.get('/logout', (req, res) => {
    // Destroy the user's session or perform any necessary logout logic
    // ...

    res.json({ url: '/' }); // Redirect to the login page
});


// GET CURRENT USER:  getting a currently "authenticated" user's object
// apiRouter.get('/current/users/:currentUser', (req, res) => {
//     // Access the authenticated user through req.user
//     const currentUser = req.user;
  
//     // Your route logic here...
//   });
  
apiRouter.get('/current/users/:currentUser', (req, res) => {
    const username = req.params.currentUser; 

    let currUser = users.find(currUser => currUser.username == username); 
    if(currUser) {
        res.json(currUser);
    } else {
        res.status(404).json({error: 'User not found'});

    }
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