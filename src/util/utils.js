const users = [{
  "username": "admin",
  "password": "admin",
  "loggedIn": false
}];

function addUser(username, password) {
  const filteredUsers = this.users.filter((user) => {
    if(user.username === username) {
      return true;
    }
  });
  if(filteredUsers.length === 0) {
    this.users.push({
      "username": username,
      "password": password,
      "loggedIn": false
    });
  }
}

function deleteUser(username) {
  const filteredUsers = this.users.filter((user) => {
    if(user.username !== username) {
      return true;
    }
  });
  this.users = filteredUsers;
}

function getUsers() {
  return this.users;
}

function login(username, password) {
  for(let user of this.users) {
    if(user.username === username && user.password === password) {
      user.loggedIn = true;
    }
  }
}

function logout(username) {
  for(let user of this.users) {
    if(user.username === username) {
      user.loggedIn = false;
    }
  }
}

module.exports = {
  addUser, deleteUser, login, logout, getUsers, users
}