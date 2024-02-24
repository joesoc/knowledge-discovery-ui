export interface IAnswerServerConversationPrompts {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: Responsedata
  }
  
  export interface Responsedata {
    prompts: Prompt[]
  }
  
  export interface Prompt {
    prompt: string
    valid_choices?: ValidChoices
  }
  
  export interface ValidChoices {
    valid_choice: string[]
  }
  