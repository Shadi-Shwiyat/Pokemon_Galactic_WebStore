const { createPokemon } = require('../pokemonFunctions');
const { mockRequest, mockResponse } = require('firebase-functions-test')();

describe('createPokemon', () => {
  it('should create a Pokemon successfully', async () => {
    const req = mockRequest({
      method: 'POST',
      body: {
        id: 25,
        name: 'Pikachu',
        // Add other necessary properties here
      }
    });
    const res = mockResponse();

    await createPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: 'Pokemon created successfully' });
  });

  it('should handle errors when missing parameters', async () => {
    const req = mockRequest({
      method: 'POST',
      body: {}
    });
    const res = mockResponse();

    await createPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Missing or invalid fields' });
  });
});
