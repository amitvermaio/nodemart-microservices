import 'dotenv/config';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ToolMessage, AIMessage, HumanMessage } from '@langchain/core/messages';
import tools from './tools.js';

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-2.5-flash',
  temperature: 0.7,
});

const graph = new StateGraph(MessagesAnnotation)
  .addNode("tools", async (state, config) => {
    const lastMessage = state.messages[state.messages.length - 1];

    const toolCall = lastMessage.tool_calls

    const toolCallResult = await Promise.all(toolCall.map(async (call) => {
      
      const tool = tools[ call.name ];

      if (!tool) {
        throw new Error(`Tool ${call.name} not found`);
      }

      const toolInput = call.args

      const toolResult = await tool.func({ ...toolInput, token: config.metadata.token });

      return new ToolMessage({
        content: toolResult,
        name: call.name,
      });
    }));

    state.messages.push(...toolCallResult);

    return state;
  })
  .addNode("chat", async (state, config) => {
    const response = await model.invoke(state.messages, { tools: [ tools.searchProduct, tools.addProductToCart ] });
    
    state.messages.push(new AIMessage({ content: response.text, tool_calls: response.tool_calls }));
    
    return state;
  })
  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", async (state) => {
    const lastMessage = state.messages[state.messages.length - 1];

    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    } else {
      return "__end__";
    }
  })
  .addEdge("tools", "chat");

const agent = graph.compile();

export default agent;