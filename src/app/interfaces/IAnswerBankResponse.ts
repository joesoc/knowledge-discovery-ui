export interface IAnswerBankResponse {
  Title: string;
  State: string;
  Answer: string;
  PopularityCount: string; // Consider changing to number if it's always numeric
  AnswerSource: string;
}
