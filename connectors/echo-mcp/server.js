import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'echo-mcp', version: '3.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'echo',
    description: 'Echo back input v3 with timestamp',
    inputSchema: { type: 'object', properties: { message: { type: 'string' } } }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name === 'echo') {
    const ts = new Date().toISOString();
    return { content: [{ type: 'text', text: `ECHO v3 [${ts}]: ${req.params.arguments?.message}` }] };
  }
  throw new Error('Unknown tool');
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main();
