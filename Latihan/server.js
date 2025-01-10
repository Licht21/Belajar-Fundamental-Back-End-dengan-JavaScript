const notesPlugin = require('./notesPlugin');
const otherPlugin = require('./otherPlugin');
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server();

  //register plugin
  await server.register([
    {
      plugin:notesPlugin,
      options:{ notes:[] },
    },
    {
      plugin:otherPlugin,
      options:{ notes:'ini notes' },
    }
  ]);

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
};

init();