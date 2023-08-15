import {Chain} from "@/types/chain";

export interface Transaction {
  id: string
  fromAddress: string
  toAddress: string
  fromChain: Chain
  toChain: Chain
  timestamp: number
}

