import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { createElysiaApplication } from '../../src/application';
import { setupTestDatabase, teardownTestDatabase } from '../helper';
import EquipmentService from '../../src/equipment/service';
import CoffeeService from '../../src/coffees/service';
import ExtractionService from '../../src/extractions/service';

describe('/extractions', async () => {
  const app = await createElysiaApplication();

  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(() => {
    teardownTestDatabase();
  });

  test('returns list of extractions', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 8,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(new Request('http://localhost/extractions'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArray();
    expect(data).toBeArrayOfSize(1);
    expect(data[0].dose).toBe(20);
    expect(data[0].rating).toBe(8);
  });

  test('creates new extraction and returns 201', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: brewer.id,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 8,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(201);
    const data = await response.json();

    expect(data.dose).toBe(20);
    expect(data.yield).toBe(40);
    expect(data.brewTime).toBe(30);
    expect(data.rating).toBe(8);
    expect(data.id).toBeDefined();
  });

  test('deletes extraction and returns 204', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 8,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(
      new Request(`http://localhost/extractions/${created.id}`, {
        method: 'DELETE',
      }),
    );

    expect(response.status).toBe(204);
  });

  test('returns empty list when no extractions exist', async () => {
    const response = await app.handle(new Request('http://localhost/extractions'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArray();
    expect(data).toBeArrayOfSize(0);
  });

  test('returns extraction by id when exists', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 8,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(new Request(`http://localhost/extractions/${created.id}`));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(created.id);
    expect(data.dose).toBe(20);
    expect(data.yield).toBe(40);
  });

  test('returns 404 when extraction by id does not exist', async () => {
    const response = await app.handle(new Request('http://localhost/extractions/9999'));
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error).toBe('Extraction not found');
  });

  test('updates extraction and returns 200', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 8,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(
      new Request(`http://localhost/extractions/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dose: 22,
          yield: 44,
          brewTime: 35,
          rating: 9,
          tastingNotes: 'Better brew',
        }),
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.id).toBe(created.id);
    expect(data.dose).toBe(22);
    expect(data.yield).toBe(44);
    expect(data.brewTime).toBe(35);
    expect(data.rating).toBe(9);
    expect(data.tastingNotes).toBe('Better brew');
  });
});
