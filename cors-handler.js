const { Context } = require('@netlify/edge-functions');

module.exports = async (request, context) => {
  const response = await context.next();
  return new Response(response.body, {
    headers: {
      'access-control-allow-origin': '*'
    }
  });
};

module.exports.config = {
  path: '/*'
};
