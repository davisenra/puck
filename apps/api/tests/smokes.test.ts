import { describe, expect, test } from 'bun:test';

import { createElysiaApplication } from '../src/application';

describe('smoke test suite', async () => {
  const app = await createElysiaApplication();

  test('root level endpoints', async () => {
    const response = await app.handle(new Request('http://localhost/'));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('☕');
  });

  test('openapi docs', async () => {
    const response = await app.handle(new Request('http://localhost/openapi'));
    expect(response.status).toBe(200);
  });

  test('openapi json schema', async () => {
    const response = await app.handle(new Request('http://localhost/openapi/json'));
    expect(response.status).toBe(200);
  });
});
