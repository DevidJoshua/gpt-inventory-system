const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../src/app');

test('GET /health returns ok', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/health`);
  const json = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(json, { status: 'ok' });

  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});
