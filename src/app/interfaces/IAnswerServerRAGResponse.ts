export interface RAGResponse {
    autnresponse: Autnresponse
  }
  
  export interface Autnresponse {
    action: string
    response: string
    responsedata: RagResponsedata
  }
  
  export interface RagResponsedata {
    answers: RagAnswers
  }
  
  export interface RagAnswers {
    answer: RagAnswer[]
  }
  
  export interface RagAnswer {
    "@answer_type": string
    "@system_name": string
    text: string
    score: string
    interpretation: string
    source: string
    metadata: RagMetadata
  }
  
  export interface RagMetadata {
    sources: Sources
  }
  
  export interface Sources {
    source: Source[]
  }
  
  export interface Source {
    "@ref": string
    "@title": string
    "@database": string
    text: string
  }
  
export function isRagResponse(data: unknown): data is RAGResponse {
    // rag response is similar to the standard response but the metadata contains
    // a source array instead
    return (
        (data as RAGResponse).autnresponse !== undefined &&
        (data as RAGResponse).autnresponse.responsedata !== undefined &&
        (data as RAGResponse).autnresponse.responsedata.answers !== undefined &&
        (data as RAGResponse).autnresponse.responsedata.answers.answer !== undefined &&
        (data as RAGResponse).autnresponse.responsedata.answers.answer.length > 0 &&
        (data as RAGResponse).autnresponse.responsedata.answers.answer[0].metadata !== undefined &&
        (data as RAGResponse).autnresponse.responsedata.answers.answer[0].metadata.sources !== undefined &&
        (data as RAGResponse).autnresponse.responsedata.answers.answer[0].metadata.sources.source !== undefined &&
        (data as RAGResponse).autnresponse.responsedata.answers.answer[0].metadata.sources.source.length > 0
    )
}