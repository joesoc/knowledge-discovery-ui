export interface IAnswerServerAskResponse {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: Action
    response: Response
    responsedata: Responsedata
  }
  
  export interface Action {
    $: string
  }
  
  export interface Response {
    $: string
  }
  
  export interface Responsedata {
    answers: Answers
  }
  
  export interface Answers {
    answer: Answer[]
  }
  
  export interface Answer {
    "@answer_type": string
    "@system_name": string
    text: string
    score: string
    interpretation: string
    source: string
    metadata: Metadata
  }
  

  export interface Metadata {
    paragraph: Paragraph
    windows: Windows
    classifications: Classifications
    context: Context
    verified_response: VerifiedResponse
  }
  
  export interface VerifiedResponse {
    $: string 
  }
  export interface Paragraph {
    $: string
  }
  
  export interface Windows {
    window: any
  }
  
  export interface Classifications {
    classification: Classification
  }
  
  export interface Classification {
    $: string
  }
  
  export interface Context {
    subject: Subject[]
  }
  
  export interface Subject {
    $: string
  }
  