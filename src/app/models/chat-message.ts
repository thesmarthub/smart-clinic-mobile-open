export class ChatMessage {
  constructor(
    private from: string,
    private to: string,
    private receiverId: string,
    private text: string,
    private chatKey: string,
    private smartCode: number,
    private date: Date
  ) {}
}
