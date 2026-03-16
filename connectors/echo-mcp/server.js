import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({ name: 'echo-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'echo',
    description: 'Echo back input v1',
    inputSchema: { type: 'object', properties: { message: { type: 'string' } } }
  }]
}));

server.setRequestHandler('tools/call', async (req) => {
  if (req.params.name === 'echo') {
    return { content: [{ type: 'text', text: `ECHO v1: ${req.params.arguments?.message}` }] };
  }
  throw new Error('Unknown tool');
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main();
