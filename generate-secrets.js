const crypto = require('crypto');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
const { env } = require('process');

const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// Check if the .env file exists
if (!fs.existsSync(envPath)) {
  // Create the .env file if it doesn't exist
  fs.writeFileSync(envPath, '', { encoding: 'utf8' });
  console.log(`Created .env file at ${envPath}`);
}

const generateSecret = async () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer.toString('hex'));
    });
  });
};

const addOrUpdateEnvVariable = async (key, value) => {
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = await fsPromises.readFile(envPath, { encoding: 'utf8' });
  }

  const regex = new RegExp(`^${key}=.*`, 'm');
  if (envContent.match(regex)) {
    console.log(`Updating existing environment variable: ${key}`);
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    console.log(`Adding new environment variable: ${key}`);
    envContent += `\n${key}=${value}`;
  }

  return fsPromises.writeFile(envPath, envContent, { encoding: 'utf8' });
}

(async () => {
  const accessTokenSecret = await generateSecret();
  await addOrUpdateEnvVariable('ACCESS_TOKEN_SECRET', accessTokenSecret);

  const refreshTokenSecret = await generateSecret();
  await addOrUpdateEnvVariable('REFRESH_TOKEN_SECRET', refreshTokenSecret);
})();