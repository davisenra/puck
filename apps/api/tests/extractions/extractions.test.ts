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
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(new Request('http://localhost/extractions'));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeArray();
    expect(data).toBeArrayOfSize(1);
    expect(data[0].dose).toBe(20);
    expect(data[0].rating).toBe(4);
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
          rating: 4,
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
    expect(data.rating).toBe(4);
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
      rating: 4,
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
      rating: 4,
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
      rating: 4,
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
          rating: 5,
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
    expect(data.rating).toBe(5);
    expect(data.tastingNotes).toBe('Better brew');
  });

  test('returns 400 when coffee_id does not exist', async () => {
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: 9999,
          brewerId: brewer.id,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Coffee not found');
  });

  test('returns 400 when brewer_id does not exist', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: 9999,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Brewer not found');
  });

  test('returns 400 when brewer has wrong type', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const grinder = await EquipmentService.save({ name: 'Test Grinder', type: 'GRINDER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: grinder.id,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Brewer must be of type BREWER');
  });

  test('returns 400 when grinder_id does not exist', async () => {
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
          grinderId: 9999,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Grinder not found');
  });

  test('returns 400 when grinder has wrong type', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });
    const brewer2 = await EquipmentService.save({ name: 'Test Brewer 2', type: 'BREWER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: brewer.id,
          grinderId: brewer2.id,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Grinder must be of type GRINDER');
  });

  test('creates extraction with archived coffee', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
      archived: true,
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
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.coffeeId).toBe(coffee.id);
  });

  test('PUT returns 400 when coffee no longer exists', async () => {
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
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    await CoffeeService.destroy(coffee.id);

    const response = await app.handle(
      new Request(`http://localhost/extractions/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dose: 22,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Coffee not found');
  });
});
