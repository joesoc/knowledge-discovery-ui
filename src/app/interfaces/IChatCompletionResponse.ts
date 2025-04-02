export interface ChatCompletion {
    id: string;
    object: "chat.completion";
    created: number;
    model: string;
    choices: Choice[];
    usage: Usage;
  }
  
  interface Choice {
    index: number;
    message: Message;
    finish_reason: "stop" | string; // "stop" is specific to this example, but could be other values
  }
  
  interface Message {
    role: "assistant" | string; // "assistant" is specific to this example, but could be other roles
    tool_calls: null | any; // null in this case, but could be an array or object in other cases
    content: string;
  }
  
  interface Usage {
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens: number;
  }