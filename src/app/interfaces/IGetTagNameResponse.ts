export interface GetTagNamesResponse {
    autnresponse: {
      action: string; // "GETTAGNAMES"
      response: string; // "SUCCESS"
      responsedata: {
        name: TagName[];
        number_of_fields: string; // e.g., "2"
        engines: {
          used: string; // e.g., "0,1"
        };
      };
    };
  }
  
export interface TagName {
    "@types": string; // e.g., "parametric"
    "$": string;      // e.g., "DOCUMENT/HR_FIRST_NAME"
  }
  