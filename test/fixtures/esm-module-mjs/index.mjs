const handle = async (context) => {
  // YOUR CODE HERE
  context.log.info(JSON.stringify(context, null, 2));

  // If the request is an HTTP POST, the context will contain the request body
  if (context.method === 'POST') {
    return {
      body: context.body,
    }
  // If the request is an HTTP GET, the context will include a query string, if it exists
  } else if (context.method === 'GET') {
    return {
      query: context.query,
    }
  } else {
    return { statusCode: 405, statusMessage: 'Method not allowed' };
  }
}

// Export the function
export { handle };
