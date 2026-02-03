import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

import { createElysiaApplication } from '../../src/application';
import EquipmentService from '../../src/equipment/service';
import { setupTestDatabase, teardownTestDatabase } from '../helper';

describe('/equipment', async () => {
  const app = await createElysiaApplication();

  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(() => {
    teardownTestDatabase();
  });

  test('returns list of equipment', async () => {
    await EquipmentService.save({ name: 'Test 1', type: 'BREWER' });
    await EquipmentService.save({ name: 'Test 2', type: 'GRINDER' });

    const response = await app.handle(new Request('http://localhost/equipment'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArray();
    expect(data).toBeArrayOfSize(2);
    expect(data[0].name).toBe('Test 2');
    expect(data[1].name).toBe('Test 1');
  });

  test('creates new equipment and returns 201', async () => {
    const response = await app.handle(
      new Request('http://localhost/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Grinder', type: 'GRINDER' }),
      }),
    );

    expect(response.status).toBe(201);
    const data = await response.json();

    expect(data.name).toBe('Test Grinder');
    expect(data.type).toBe('GRINDER');
    expect(data.id).toBeDefined();
  });

  test('deletes equipment and returns 204', async () => {
    const created = await EquipmentService.save({ name: 'Test Grinder', type: 'GRINDER' });

    const response = await app.handle(
      new Request(`http://localhost/equipment/${created.id}`, {
        method: 'DELETE',
      }),
    );

    expect(response.status).toBe(204);
  });

  test('returns empty list when no equipment exists', async () => {
    const response = await app.handle(new Request('http://localhost/equipment'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArray();
    expect(data).toBeArrayOfSize(0);
  });

  test('returns equipment by id when exists', async () => {
    const created = await EquipmentService.save({ name: 'Test Grinder', type: 'GRINDER' });

    const response = await app.handle(new Request(`http://localhost/equipment/${created.id}`));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(created.id);
    expect(data.name).toBe('Test Grinder');
    expect(data.type).toBe('GRINDER');
  });

  test('returns 404 when equipment by id does not exist', async () => {
    const response = await app.handle(new Request('http://localhost/equipment/9999'));
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error).toBe('Equipment not found');
  });

  test('returns only grinders when type query param is GRINDER', async () => {
    await EquipmentService.save({ name: 'Brewer 1', type: 'BREWER' });
    await EquipmentService.save({ name: 'Grinder 1', type: 'GRINDER' });
    await EquipmentService.save({ name: 'Grinder 2', type: 'GRINDER' });

    const response = await app.handle(new Request('http://localhost/equipment?type=GRINDER'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArrayOfSize(2);
    expect(data[0].type).toBe('GRINDER');
    expect(data[1].type).toBe('GRINDER');
  });

  test('returns only brewers when type query param is BREWER', async () => {
    await EquipmentService.save({ name: 'Brewer 1', type: 'BREWER' });
    await EquipmentService.save({ name: 'Brewer 2', type: 'BREWER' });
    await EquipmentService.save({ name: 'Grinder 1', type: 'GRINDER' });

    const response = await app.handle(new Request('http://localhost/equipment?type=BREWER'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArrayOfSize(2);
    expect(data[0].type).toBe('BREWER');
    expect(data[1].type).toBe('BREWER');
  });

  test('returns all equipment when no type query param provided', async () => {
    await EquipmentService.save({ name: 'Brewer 1', type: 'BREWER' });
    await EquipmentService.save({ name: 'Grinder 1', type: 'GRINDER' });

    const response = await app.handle(new Request('http://localhost/equipment'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArrayOfSize(2);
  });

  test('updates equipment name and returns updated equipment', async () => {
    const created = await EquipmentService.save({ name: 'Original Name', type: 'GRINDER' });

    const response = await app.handle(
      new Request(`http://localhost/equipment/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Name' }),
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.id).toBe(created.id);
    expect(data.name).toBe('Updated Name');
    expect(data.type).toBe('GRINDER');
  });

  test('returns 404 when updating equipment that does not exist', async () => {
    const response = await app.handle(
      new Request('http://localhost/equipment/9999', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Name' }),
      }),
    );

    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error).toBe('Equipment not found');
  });
});
