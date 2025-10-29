const { test, expect, request } = require('@playwright/test');

test.describe('Flashcard API (E2E)', () => {
  let apiContext;
  test.beforeAll(async () => {
    apiContext = await request.newContext({ baseURL: process.env.BASE_URL || 'http://localhost:3000' });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('create -> add card -> update -> delete', async ({}) => {
    // Create set
    const createRes = await apiContext.post('/api/sets', { data: { title: 'E2E Set', description: 'playwright' } });
    expect(createRes.ok()).toBeTruthy();
    const set = await createRes.json();
    expect(set._id).toBeTruthy();

    // Add card
    const addRes = await apiContext.post(`/api/sets/${set._id}/cards`, { data: { front: 'q', back: 'a' } });
    expect(addRes.status()).toBe(201);
    const updated = await addRes.json();
    expect(updated.cards.length).toBeGreaterThan(0);
    const card = updated.cards[updated.cards.length - 1];

    // Update card
    const updRes = await apiContext.put(`/api/sets/${set._id}/cards/${card._id}`, { data: { back: 'a!' } });
    expect(updRes.ok()).toBeTruthy();
    const afterUpd = await updRes.json();
    const found = afterUpd.cards.find(c => c._id === card._id);
    expect(found.back).toBe('a!');

    // Delete card
    const delRes = await apiContext.delete(`/api/sets/${set._id}/cards/${card._id}`);
    expect(delRes.ok()).toBeTruthy();
    const afterDel = await delRes.json();
    const exists = afterDel.cards.find(c => c._id === card._id);
    expect(exists).toBeUndefined();
  });
});
