export interface IAnswerBankResponse {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: Responsedata
  }
  
  export interface Responsedata {
    numhits: string
    hit: Hit[]
  }
  
  export interface Hit {
    reference: string
    id: string
    section: string
    weight: string
    database: string
    content: Content
  }
  
  export interface Content {
    DOCUMENT: Document[]
  }
  
  export interface Document {
    DREREFERENCE: string[]
    CREATED_TIME: string[]
    DELETED: string[]
    DREDBNAME: string[]
    EXPIRE_DATE: string[]
    LAST_MODIFIED_TIME: string[]
    QUESTION_EQUIVALENCE_CLASS_ID: string[]
    STATE: string[]
    DRECONTENT: string[]
  }
  