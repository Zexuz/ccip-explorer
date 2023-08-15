import {Transaction} from "@/types/transaction";
import TransactionCard from "@/components/TransactionCard";
import {connectToDatabase} from "@/lib/mongo";


async function getData() {
  const {db} = await connectToDatabase();

  try {
    return await db.collection('events')
                   .find()
                   .sort({timestamp: -1})
                   .limit(5)
                   .toArray();
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

export default async function Home() {
  const data = await getData()

  if (!data) {
    return <div>Loading...</div>
  }

  const transactions: Transaction[] = data.map((tx: any) => {
    return {
      id: tx.message.messageId,
      fromAddress: tx.message.sender,
      toAddress: tx.message.receiver,
      fromChain: {
        chainId: tx.senderChain,
        name: tx.senderChain,
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      toChain: {
        chainId: tx.destinationChain,
        name: tx.destinationChain,
        imgUrl: 'https://placehold.co/30x30',
        isTestnet: false
      },
      timestamp: tx.timestamp
    }
  });

  // const transactions: Transaction[] = [
  //   {
  //     id: '0xf473ea57143f266dcdba663aa0fd0bf848a9689c5c539fe1ce0b3181523b5d30',
  //     fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
  //     toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
  //     fromChain: {
  //       chainId: '0x1',
  //       name: 'Ethereum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     toChain: {
  //       chainId: '0x4',
  //       name: 'Arbitrum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     timestamp: 1632931200
  //   },
  //   {
  //     id: '0xc7b22b9d813993386874de616066e4336e37f0d33aea4fc77570ad8226fa7e68',
  //     fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
  //     toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
  //     fromChain: {
  //       chainId: '0x1',
  //       name: 'Ethereum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     toChain: {
  //       chainId: '0x4',
  //       name: 'Arbitrum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     timestamp: 1632931200
  //   },
  //   {
  //     id: '0x8f57f3ee7f3607378afe67868ffb368e5251faa43de4b54ae2fcca58c50d9f4e',
  //     fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
  //     toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
  //     fromChain: {
  //       chainId: '0x1',
  //       name: 'Ethereum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     toChain: {
  //       chainId: '0x4',
  //       name: 'Arbitrum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     timestamp: 1632931200
  //   },
  //   {
  //     id: '0x77cd770d6937e9b9bfe9c4546475481d8c3b145ec88f0d501c19ce3509dcd406',
  //     fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
  //     toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
  //     fromChain: {
  //       chainId: '0x1',
  //       name: 'Ethereum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     toChain: {
  //       chainId: '0x4',
  //       name: 'Arbitrum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     timestamp: 1632931200
  //   },
  //   {
  //     id: '0x83ae97e6974546357745817de6e70641ec9a0cdfced66f406bb86840c4aaa09d',
  //     fromAddress: '0x65b51ba5c9233465f118285e5fb2110c52ad6b27',
  //     toAddress: '0x9b451300c94c7328bdb56a514f83205ea789136f',
  //     fromChain: {
  //       chainId: '0x1',
  //       name: 'Ethereum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     toChain: {
  //       chainId: '0x4',
  //       name: 'Arbitrum',
  //       imgUrl: 'https://placehold.co/30x30',
  //       isTestnet: false
  //     },
  //     timestamp: 1632931200
  //   }
  // ]

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
