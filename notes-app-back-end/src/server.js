require('dotenv').config();
const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const users = require('./api/users');
// const NotesService = require('./services/inMemory/NotesService');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
