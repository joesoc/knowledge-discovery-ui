export interface LanguageIdentification {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: Responsedata
  }
  
  export interface Responsedata {
    language: string
    languageiso: string
    languageencoding: string
    languagedirection: string
    languagescripts: Languagescripts
  }
  
  export interface Languagescripts {
    unicodeblock: string
  }
  