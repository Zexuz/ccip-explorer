import {Transaction} from "@/types/transaction";
import TransactionCard from "@/components/TransactionCard";


export default function Home() {

  const transactions: Transaction[] = [
    {
      id: '0x83ae97e6974546357745817de6e70641ec9a0cdfced66f406bb86840c4aaa09d',
      fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
      toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
      fromChain: {
        chainId: '0x1',
        name: 'Ethereum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      toChain: {
        chainId: '0x4',
        name: 'Arbitrum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      timestamp: 1632931200
    },
    {
      id: '0x83ae97e6974546357745817de6e70641ec9a0cdfced66f406bb86840c4aaa09d',
      fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
      toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
      fromChain: {
        chainId: '0x1',
        name: 'Ethereum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      toChain: {
        chainId: '0x4',
        name: 'Arbitrum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      timestamp: 1632931200
    },
    {
      id: '0x83ae97e6974546357745817de6e70641ec9a0cdfced66f406bb86840c4aaa09d',
      fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
      toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
      fromChain: {
        chainId: '0x1',
        name: 'Ethereum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      toChain: {
        chainId: '0x4',
        name: 'Arbitrum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      timestamp: 1632931200
    },
    {
      id: '0x83ae97e6974546357745817de6e70641ec9a0cdfced66f406bb86840c4aaa09d',
      fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
      toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
      fromChain: {
        chainId: '0x1',
        name: 'Ethereum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      toChain: {
        chainId: '0x4',
        name: 'Arbitrum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      timestamp: 1632931200
    },
    {
      id: '0x83ae97e6974546357745817de6e70641ec9a0cdfced66f406bb86840c4aaa09d',
      fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
      toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
      fromChain: {
        chainId: '0x1',
        name: 'Ethereum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      toChain: {
        chainId: '0x4',
        name: 'Arbitrum',
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      timestamp: 1632931200
    }
  ]

  return (
    <main className="min-h-screen flex-col items-center p-16 justify-between max-w-7xl mx-auto">
      <section className="mb-4">
        <div className="font-mono">
          <p className="text-4xl font-semibold">Chainlink CCIP Explorer</p>
        </div>
      </section>

      <section className="w-full">
        <div className="flex justify-center relative text-gray-600">
          <input
            className="border-2 border-custom-border bg-white h-14 px-5 pr-16 rounded-md text-sm focus:outline-none focus:border-4 focus:border-primary-accent w-1/2"
            type="search"
            name="search"
            placeholder="Search"
          />
        </div>
      </section>

      <section className="w-full">
        <p className="text-2xl font-semibold mb-4">Latest transaction</p>
        {transactions.map(tx => <TransactionCard key={tx.id} tx={tx}/>)}
      </section>

      <footer className="flex justify-center">
        <p className="text-gray-400 text-sm">Made with ❤️ by <a
          href="https://twitter.com/ChainLink_Guy">ChainLinkGuy</a>
        </p>
      </footer>
    </main>
  )
}
