import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { createElysiaApplication } from '../../src/application';
import { setupTestDatabase, teardownTestDatabase } from '../helper';
import CoffeeService from '../../src/coffees/service';

describe('/coffees', async () => {
  const app = await createElysiaApplication();

  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(() => {
    teardownTestDatabase();
  });

  test('returns list of coffees', async () => {
    await CoffeeService.save({
      roaster: 'Test Roaster 1',
      name: 'Test Coffee 1',
      roastDate: null,
      process: null,
      notes: null,
    });
    await CoffeeService.save({
      roaster: 'Test Roaster 2',
      name: 'Test Coffee 2',
      roastDate: null,
      process: null,
      notes: null,
    });

    const response = await app.handle(new Request('http://localhost/coffees'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArray();
    expect(data).toBeArrayOfSize(2);
    expect(data[0].name).toBe('Test Coffee 2');
    expect(data[1].name).toBe('Test Coffee 1');
  });

  test('creates new coffee and returns 201', async () => {
    const response = await app.handle(
      new Request('http://localhost/coffees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roaster: 'Test Roaster',
          name: 'Test Coffee',
          roastDate: '2026-01-15T00:00:00.000Z',
          process: 'Washed',
          notes: 'Test notes',
        }),
      }),
    );

    expect(response.status).toBe(201);
    const data = await response.json();

    expect(data.roaster).toBe('Test Roaster');
    expect(data.name).toBe('Test Coffee');
    expect(data.process).toBe('Washed');
    expect(data.notes).toBe('Test notes');
    expect(data.id).toBeDefined();
  });

  test('deletes coffee and returns 204', async () => {
    const created = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: null,
      process: null,
      notes: null,
    });

    const response = await app.handle(
      new Request(`http://localhost/coffees/${created.id}`, {
        method: 'DELETE',
      }),
    );

    expect(response.status).toBe(204);
  });

  test('returns empty list when no coffees exist', async () => {
    const response = await app.handle(new Request('http://localhost/coffees'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArray();
    expect(data).toBeArrayOfSize(0);
  });

  test('returns coffee by id when exists', async () => {
    const created = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: null,
      process: null,
      notes: null,
    });

    const response = await app.handle(new Request(`http://localhost/coffees/${created.id}`));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(created.id);
    expect(data.roaster).toBe('Test Roaster');
    expect(data.name).toBe('Test Coffee');
  });

  test('returns 404 when coffee by id does not exist', async () => {
    const response = await app.handle(new Request('http://localhost/coffees/9999'));
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error).toBe('Coffee not found');
  });

  test('updates coffee and returns 200', async () => {
    const created = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: null,
      process: null,
      notes: null,
    });

    const response = await app.handle(
      new Request(`http://localhost/coffees/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roaster: 'Updated Roaster',
          name: 'Updated Coffee',
          process: 'Natural',
          notes: 'Updated notes',
          archived: true,
        }),
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.id).toBe(created.id);
    expect(data.roaster).toBe('Updated Roaster');
    expect(data.name).toBe('Updated Coffee');
    expect(data.process).toBe('Natural');
    expect(data.notes).toBe('Updated notes');
    expect(data.archived).toBe(true);
  });
});
