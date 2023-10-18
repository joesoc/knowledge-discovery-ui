export interface AutnResponse {
    action: string;
    response: string;
    responsedata: ResponseData;
  }
  
  export interface ResponseData {
    embeddings: Embeddings;
  }
  
  export interface Embeddings {
    num_vectors: string;
    vector: string[];
  }
  
  export interface IQMSModelEncodeResponse {
    autnresponse: AutnResponse;
  }
  