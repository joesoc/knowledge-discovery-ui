export interface IManageResourcesResponse {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: Responsedata
  }
  
  export interface Responsedata {
    result: Result
  }
  
  export interface Result {
    managed_resources: ManagedResources
    operation: string
    type: string
  }
  
  export interface ManagedResources {
    type: string
    operation: string
    id: string
  }
  

  