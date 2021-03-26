export class ChatRequest {
  constructor(
    private senderId: string,
    private receiverId: string,
    private chatKey: string,
    private requestMessage: string,
    private smartCode: number,
    private date: Date
  ) {}
}
