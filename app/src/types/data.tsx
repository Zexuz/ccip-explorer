import {Message} from "@/types/message";

export interface Data {
  destinationChain: string;
  eventName: string;
  message: Message;
  senderChain: string;
  timestamp: number;
}
