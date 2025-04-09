const model = {
  users: require('../model/users.json'),
  updateUser(username, refreshToken) {
    const currentUser = this.users.find(user => user.username === username);
    if (!currentUser) return false;
    currentUser.refreshToken = refreshToken;
    const otherUsers = this.users.filter(user => user.username !== username);    
    this.users =  [...otherUsers, currentUser];
    fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(this.users));
    return true;
  }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = model.users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const accessToken = jwt.sign(
      { "username": user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );

    const refreshToken = jwt.sign(
      { "username": user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Save the refresh token in the database
    model.updateUser(user.username, refreshToken);
    
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'None',
      secure: true
    });
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
}

module.exports = {
  handleLogin,
}


