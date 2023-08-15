import {Transaction} from "@/types/transaction";
import ChainIcon from "@/components/ChainIcon";
import {formatDate} from "@/utils/date";
import ChainData from "@/components/ChainData";
import Link from 'next/link';

export default function TransactionCard({tx}: { tx: Transaction }) {
  return (
    <div className="border p-4 mb-4 flex items-center">

      <div className="mr-4">
        <ChainIcon/>
      </div>

      {/* Column 1: Transaction ID and Date */}
      <div className="flex-shrink-0 mr-4">
        <Link href={`/msg/${tx.id}`}>
          <p className="text-xs font-mono mb-2 cursor-pointer hover:underline text-secondary-accent">{tx.id}</p>
        </Link>
        <p className="text-xs text-gray-600">{formatDate(tx.timestamp)}</p>
      </div>

      <div className="flex flex-col justify-between flex-grow">

        <div className="flex flex-col justify-between flex-grow">
          <ChainData address={`From: ${tx.fromAddress}`} chain={tx.fromChain}/>
          <ChainData address={`To:\u00A0\u00A0 ${tx.toAddress}`} chain={tx.toChain}/>
        </div>

      </div>
    </div>
  )
}
