export interface IHighlightingResult {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: Responsedata
  }
  
  export interface Responsedata {
    hit: Hit
  }
  
  export interface Hit {
    highlighted: string
    content: string
  }
  