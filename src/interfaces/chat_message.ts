export interface IChatMessage {
  id?: string;
  message_id?: string;
  message: string;
  sender_id: string;
  sender_name?: string;
  sender_smart_code?: string;
  receiver_id?: string;
  receiver_name?: string;
  receiver_smart_code?: string;
  status?: string;
  message_type?: string;
  created_at?: string;
}
