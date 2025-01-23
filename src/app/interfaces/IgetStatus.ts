export interface AutnResponse {
  action: string;
  response: string;
  responsedata: ResponseData;
}

export interface ResponseData {
  product: string;
  version: string;
  build: string;
  aciport: string;
  serviceport: string;
  directory: string;
  querythreads: string;
  termsperdoc: string;
  documents: string;
  document_sections: string;
  committed_documents: string;
  terms: string;
  total_terms: string;
  mindate: string;
  maxdate: string;
  mindatestring: string;
  maxdatestring: string;
  active_children: string;
  databases: Databases;
  security_settings: SecuritySettings;
  language_type_settings: LanguageTypeSettings;
  data_encryption: DataEncryption;
  engines: Engines;
}

export interface Databases {
  num_databases: string;
  active_databases: string;
  database: Database[];
}

export interface Database {
  name: string;
  documents: string;
  sections: string;
  internal: string;
  readonly: string;
}

export interface SecuritySettings {
  no_of_security_types: string;
}

export interface LanguageTypeSettings {
  no_of_language_types: string;
  language_type: LanguageType[];
}

export interface LanguageType {
  name: string;
  language: string;
  encoding: string;
  documents: string;
  sections: string;
}

export interface DataEncryption {
  activated: string;
  nodetable_encrypted: string;
  indexqueue_encrypted: string;
  diskindex_encrypted: string;
  unstemmed_encrypted: string;
  geoindex_encrypted: string;
  phraseindex_encrypted: string;
}

export interface Engines {
  engine: Engine[];
}

export interface Engine {
  number: string;
  status: string;
}

export interface IGetStatus {
  autnresponse: AutnResponse;
}
