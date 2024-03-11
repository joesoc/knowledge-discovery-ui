export interface ICommunityUserReadResponse {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: Responsedata
  }
  
  export interface Responsedata {
    authenticate: string
    uid: string
    username: string
    locked: string
    lockedlasttime: string
    maxagents: string
    numagents: string
    lastloggedin: string
    numfields: string
    securityinfo: string
  }
  
  