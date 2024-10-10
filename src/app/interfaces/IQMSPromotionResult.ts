export interface IQMSPromotionResult {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: Responsedata
  }
  
  export interface Responsedata {
    numhits: string
    predicted: string
    totalhits: string
    totaldbdocs: string
    totaldbsecs: string
    expandedQuery: string
    expansionOrder: ExpansionOrder
    hit: Hit[]
  }
  
  export interface ExpansionOrder {
    rule: Rule
  }
  
  export interface Rule {
    "@reference": string
    "@modified_query": string
    "@rule_type": string
  }
  
  export interface Hit {
    promotionref: string
    promotionname: string
    reference: string
    id: string
    section: string
    weight: string
    database: string
    title: string
    summary: string
    content: Content
    baseid: string
    date: string
    datestring: string
    expiredate: string
    language: string
    languagetype: string
    languageencoding: string
  }
  
  export interface Content {
    DOCUMENT: Document
  }
  
  export interface Document {
    AUTN_IDENTIFIER: string
    DRETITLE: string,
    DRECONTENT: string
  }
  