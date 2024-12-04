const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

// Function to cast a vote
function castVote(candidate) {
  const options = {
    key: fs.readFileSync('client.key'),           // Client private key
    cert: fs.readFileSync('client.crt'),          // Client certificate
    ca: fs.readFileSync('ca.crt'),                // CA certificate
    host: '10.0.4.194',                          // Server's IP or hostname
    port: 8080,                                   // Server's port
    path: '/vote',                                // Endpoint for voting
    method: 'POST',                               // HTTP method
    rejectUnauthorized: true,                     // Verify server certificate
    headers: {
      'Content-Type': 'text/plain',               // Vote data format
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Server response:', data);      // Log response after voting
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
  });

  // Encrypt the vote with the server's public key
  const serverPublicKey = fs.readFileSync('server.pub', 'utf8');
  const encryptedVote = crypto.publicEncrypt(
    { key: serverPublicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(candidate)
  );

  // Send the encrypted vote
  req.write(encryptedVote.toString('base64'));
  req.end();
}

// Example usage: cast vote for "Alice"
castVote('Alice');