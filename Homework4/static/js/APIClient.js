const API_BASE = '/api';

const catchError = (res) => {
    if (!res.ok) {
        if (res.status == 401) {
            localStorage.removeItem('user');
            document.location = '/';
            throw new Error("Authentication failed");
        } else {
            throw new Error(res.json().error);
        }
    }

    return res;
};

const HTTPClient = {
  get: (url) => {
    return fetch(`${API_BASE}${url}`)
    .then(res => {
        if(res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(obj => {
        return obj;
      })
      .catch(err => console.log(err));
  },
  post: (url, data) => {
    return fetch(`${API_BASE}${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(catchError).then(res => {
        return res.json();
    });
  },
  put: (url, data) => {
    return fetch(`${API_BASE}${url}`)
    .then(res => {
        if(res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(obj => {
        console.log(obj);
        return obj;
      })
      .catch(err => console.log(err));
  },
  delete: (url) => {
    return fetch(`${API_BASE}${url}`, {
        method: 'DELETE',
        headers: {
            
        }
    }).then(res => {
        if(res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(obj => {
        console.log(obj);
        return obj;
      })
      .catch(err => console.log(err));
  },
};




export default {

    // "Authenticating" a user. For this assignment, just receive a username and verify that it corresponds to one of the existing users to grant access.
    // login: (usernameLogin) => {
    //     return HTTPClient.get(`/login/users/${usernameLogin}`);
    // },
    login: (username, password) => {
      let data = {
          username: username,
          password: password,
      };
      return HTTPClient.post(`/login/users`, data);
    },  
    // Logging the authenticated user out : 
    logout: () => {
      return HTTPClient.get(`/logout/users`);
    },
    // Getting the currently "authenticated" user's object.
    getCurrentAuthUser: () => {
        return HTTPClient.get(`/current/users`); 
    },
     // Getting howls posted by all users followed by the "authenticated" user
    // in APIRoutes: follows/:currentUserId/howls
    getAllHowlsFollowedByUser: (currentUserId) => {
        return HTTPClient.get(`/follows/${currentUserId}/howls`);
    },

    // Creating a new howl.
    createNewHowl: (userId, howlText) => {
        return HTTPClient.post(`/postNewHowl/${userId}/howls`, howlText);
    },
    // Getting howls posted by a specific user
    getHowlsByUserId: (userId) => {
        return HTTPClient.get(`/users/${userId}/howls`);
    },
     // follows new user 
     followNewUser: (currentUserId, followThisUser) => {
        // /followUser/:currentUserId/follows
        return HTTPClient.post(`/followUser/${currentUserId}/follows`, followThisUser);
    },

    // unfollows user
    //unfollowUser/6/from/1/follows
    unfollowUser: (unfollowThisUser, currentUserId) => {
        return HTTPClient.delete(`/unfollowUser/${unfollowThisUser}/from/${currentUserId}/follows`);
    },
   // gets all users followed by the current user 
    getAllUsersFollowedByUser: (currentUserId) => {
        return HTTPClient.get(`/follows/${currentUserId}/users`);
    },
    // gets Howls by specific user: 
    // apiRouter.get('/users/:userId/howls', (req,  res) => {
    getHowlsByUser: (user) => {
        return HTTPClient.get(`/users/${user}/howls`);
    },
    // gets users by id: 
    // apiRouter.get('/users/:userId', (req, res) => {
    getUserById: (id) => {
        return HTTPClient.get(`/getUsersById/users/${id}`);
    },
};
