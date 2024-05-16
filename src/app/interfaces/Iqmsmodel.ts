export interface AutnResponse {
  action: string;
  response: string;
  responsedata: ResponseData;
}

export interface ResponseData {
  embeddings?: Embeddings; // Made optional to allow for the presence of errors
  error?: ErrorElement[]; // Added error field
}

export interface Embeddings {
  num_vectors: string;
  vector: VectorElement[];
}

export interface VectorElement {
  "@start": string;
  "@end": string;
  "@length": string;
  "$": string;
}

export interface ErrorElement { // Added new interface for error elements
  errorid: string;
  rawerrorid: string;
  errorstring: string;
  errorcode: string;
  errortime: string;
}

export interface IQMSModelEncodeResponse {
  autnresponse: AutnResponse;
}
