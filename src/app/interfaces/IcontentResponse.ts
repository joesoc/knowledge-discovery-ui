export interface IContentResponse {
  autnresponse: AutnResponse;
}

export interface AutnResponse {
  action: string;
  response: string;
  responsedata: ResponseData;
}

export interface ResponseData {
  hit: Hit[];
  numhits: string;
  predicted: string;
  totalhits: string;
  totaldbdocs: string;
  totaldbsecs: string;
}

export interface Hit {
  reference: string;
  id: string;
  section: string;
  weight: string;
  database: string;
  title: string;
  summary: string;
  content: Content;
  baseid: string;
  date: string;
  datestring: string;
  expiredate: string;
  language: string;
  languagetype: string;
  languageencoding: string;
}

export interface Content {
  DOCUMENT: Document;
}

export interface Document {
  DREREFERENCE: string[];
  DRETITLE: string[];
  WIKIPEDIA_CATEGORY?: string[];
  WIKIPEDIA_TOPIC?: string[];
  AUTN_IDENTIFIER: string;
}
