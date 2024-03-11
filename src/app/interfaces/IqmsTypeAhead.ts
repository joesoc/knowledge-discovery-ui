export interface IQMSTypeAhead {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: Responsedata
  }
  
  export interface Responsedata {
    expansion: Expansion[]
  }
  
  export interface Expansion {
    "@score": string
    $: string
  }
  