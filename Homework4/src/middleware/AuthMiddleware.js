const crypto = require('crypto');
const base64url = require('base64url');

const TOKEN_COOKIE_NAME = "Homework4TokenCookie";
// In a real application, you will never hard-code this secret and you will
// definitely never commit it to version control, ever
const API_SECRET = "60d0954e20eaa0c02b382171c33c53bc18522cc6d4805eaa02e182b0";

    // RESOURCE USED: https://www.telerik.com/blogs/json-web-token-jwt-implementation-using-nodejs
const changeSpecialCharacters = b64string => {
    // create a regex to match any of the characters =,+ or / and replace them with their // substitutes
      return b64string.replace (/[=+/]/g, charToBeReplaced => {
        switch (charToBeReplaced) {
          case '=':
            return '';
          case '+':
            return '-';
          case '/':
            return '_';
        }
      });
    };

exports.TokenMiddleware = (req, res, next) => {
  // We will look for the token in two places:
  // 1. A cookie in case of a browser
  // 2. The Authorization header in case of a different client
  let token = null;
  if(!req.cookies[TOKEN_COOKIE_NAME]) {
    //No cookie, so let's check Authorization header
    const authHeader = req.get('Authorization');
    if(authHeader && authHeader.startsWith("Bearer ")) {
      //Format should be "Bearer token" but we only need the token
      token = authHeader.split(" ")[1];
    
    }

  }
  else { //We do have a cookie with a token
    token = req.cookies[TOKEN_COOKIE_NAME]; //Get session Id from cookie
  }

  if(!token) { // If we don't have a token
    res.status(401).json({error: 'Not authenticated'});
    return;
  }

  //If we've made it this far, we have a token. We need to validate it
  //     const decoded = jwt.verify(token, API_SECRET);

  const [header, data, tokenSignature] = token.split('.');

  let headerDecoded = base64url.decode(header); 

  let headerEncode = base64url(headerDecoded); 

  let dataDecoded = base64url.decode(data); 

  let dataEncode = base64url(dataDecoded);

        // creating our own token instead of using the jwt library
    // create a HMAC(hash based message authentication code) using sha256 hashing alg
    let checkTokenSignature = crypto.createHmac('sha256', API_SECRET);

    // use the update method to hash a string formed from our headerEncode a period and dataEncode
    checkTokenSignature.update(headerEncode + '.' + dataEncode);

    //signature needs to be converted to base64 to make it usable
    checkTokenSignature = checkTokenSignature.digest('base64url'); 

    // of course we need to clean the base64 string of URL special characters
    checkTokenSignature = changeSpecialCharacters(tokenSignature); 

    const userObject = JSON.parse(dataDecoded); 
    if(checkTokenSignature === tokenSignature ) {
        // req.user = decoded.user;
        req.user = userObject; 
        // next(); //Make sure we call the next middleware
        next(); //Make sure we call the next middleware
    } else {
        // res.status(401).json({error: 'Not authenticated'});
        //     return;
        res.status(401).json({error: 'Not authenticated'});
        return; 
    }
}


exports.generateToken = (req, res, user) => {

    // RESOURCE USED: https://www.telerik.com/blogs/json-web-token-jwt-implementation-using-nodejs
    let header = {
        alg: "HS256",
        typ: "JWT"
    }

    let headerEncode = base64url(JSON.stringify(header));

    let data = {
      user: user,
      // Use the exp registered claim to expire token in 1 hour
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }

    let dataEncode = base64url(JSON.stringify(data)); 
    console.log("data payload: " + dataEncode);
  
    // creating our own token instead of using the jwt library
    // create a HMAC(hash based message authentication code) using sha256 hashing alg
    let tokenSignature = crypto.createHmac('sha256', API_SECRET);
    // use the update method to hash a string formed from our headerEncode a period and dataEncode
    tokenSignature.update(headerEncode + '.' + dataEncode);
   
    //signature needs to be converted to base64 to make it usable
    tokenSignature = tokenSignature.digest('base64url'); 

    // of course we need to clean the base64 string of URL special characters
    tokenSignature = changeSpecialCharacters(tokenSignature); 
    console.log('signature: ' + tokenSignature);

    // const token = ${headerEncode}.${dataEncode}.${tokenSecret}; 
    const token = headerEncode + '.' + dataEncode + '.' + tokenSignature; 
    //send token in cookie to client
    res.cookie(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60 * 1000 //This session expires in 2 minutes.. but token expires in 1 hour!
                            // cookie is independent of the token 
    });
};


exports.removeToken = (req, res) => {
    //send session ID in cookie to client
    res.cookie(TOKEN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: true,
      maxAge: -360000 //A date in the past
    });
  
  }
  

  