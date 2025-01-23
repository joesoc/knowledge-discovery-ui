export interface IAnswerServerGetStatusResponse {
  autnresponse: Autnresponse;
}

export interface Autnresponse {
  action: string;
  response: string;
  responsedata: Responsedata;
}

export interface Responsedata {
  product: string;
  version: string;
  build: string;
  aciport: string;
  serviceport: string;
  directory: string;
  acithreads: string;
  systems: Systems;
}

export interface Systems {
  system: System[];
}

export interface System {
  name: string;
  type: string;
}
