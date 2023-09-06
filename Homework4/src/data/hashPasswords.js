const fs = require('fs');
const bcrypt = require('bcrypt');

// Load your JSON data
const users = require('./users.json');

// Define a function to hash the password
function hashPassword(password, salt) {
  return bcrypt.hashSync(password, salt);
}

// Iterate through each user and hash their password
users.forEach((user) => {
  const password = user.password;
  const saltRounds = 10; // You can adjust the number of rounds as needed

  // Generate a new salt for each user
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      return;
    }

    // Hash the password with the generated salt
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return;
      }

      // `hash` contains the hashed password, you can store it in your user data
      console.log('Hashed Password:', hash);

      // Store the hashed password in the user's data
      user.hashed_password = hash;

      // Save the updated data back to the JSON file
      fs.writeFileSync('./users.json', JSON.stringify(users, null, 2), 'utf8');
    });
  });
});

console.log('Passwords hashed and saved to users.json');
