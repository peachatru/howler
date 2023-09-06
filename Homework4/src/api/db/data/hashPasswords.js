const fs = require('fs');
const crypto = require('crypto');

// Read the users.json file
const usersData = fs.readFileSync('./users.json', 'utf8');
const users = JSON.parse(usersData);

// Function to hash a password using PBKDF2
function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey.toString('hex'));
      }
    });
  });
}

// Update passwords for all users
Promise.all(users.map(async (user) => {
  try {
    const hashedPassword = await hashPassword(user.password, user.salt);
    user.password = hashedPassword;
    delete user.hashed_password; // Remove the plain password
  } catch (err) {
    console.error(`Error hashing password for user ${user.id}: ${err.message}`);
  }
})).then(() => {
  // Save the updated users data
  const updatedUsersData = JSON.stringify(users, null, 2);
  fs.writeFileSync('updated_users.json', updatedUsersData, 'utf8');
  console.log('Passwords updated and saved to updated_users.json');
});
