import http from 'http';

const PORT = process.env.PORT || 3000;

const options: http.RequestOptions = {
  host: 'localhost',
  port: PORT,
  path: '/health',
  timeout: 2000,
  method: 'GET',
};

const request = http.request(options, (res) => {
  console.log(`HealthCheck Status: ${res.statusCode}`);

  if (res.statusCode == 200) {
    process.exit(0);
  } else {
    console.error(`Unhealth: recieved status ${res.statusCode}`);
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('HealthCheck Failed: ', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('HealthCheck Timeout');
  request.destroy();
  process.exit(1);
});

request.end();
