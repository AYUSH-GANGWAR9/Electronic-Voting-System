const https = require('https');
const fs = require('fs');

// Function to retrieve the vote tally
function getTally() {
  const options = {
    key: fs.readFileSync('client.key'),           // Client private key
    cert: fs.readFileSync('client.crt'),          // Client certificate
    ca: fs.readFileSync('ca.crt'),                // CA certificate
    host: '10.0.4.194',                          // Server's IP or hostname
    port: 8080,                                   // Server's port
    path: '/tally',                               // Endpoint for tally
    method: 'GET',                                // HTTP method
    rejectUnauthorized: true                      // Verify server certificate
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Vote Tally:', data);           // Log the tally received
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
  });

  req.end();
}

// Example usage: Get the tally of votes
getTally();