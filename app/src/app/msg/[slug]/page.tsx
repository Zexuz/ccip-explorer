import React from 'react';
import {formatDate} from "@/utils/date";
import {connectToDatabase} from "@/lib/mongo";


async function getData(msgId: string) {
  const {db} = await connectToDatabase();
  const query = {"message.messageId": msgId};

  try {
    return await db.collection('events')
                   .findOne(query);
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

export default async function Page({params}: { params: { slug: string } }) {
  const data = await getData(params.slug)

  if (!data) {
    return <div>Loading...</div>
  }
  console.log(`data: ${JSON.stringify(data)}`)

  const createTbody = (title: string, value: string) => {
    return (
      <tr className="border-b">
        <td className="px-4 py-2 font-semibold">{title}</td>
        <td className="px-4 py-2">{value}</td>
      </tr>
    )
  }


  return (
    <div className="container mx-auto p-6">
      <header className="border-b border-gray-300 py-4">
        <h1 className="text-2xl font-bold">Chainlink Blockchain Explorer</h1>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search by hash, block, etc..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
      </header>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>

        <table className="min-w-full">
          <tbody>
          {createTbody('Message ID', data.message.messageId)}
          {createTbody('Source Chain', data.senderChain)}
          {createTbody('Destination Chain', data.destinationChain)}
          {createTbody('Timestamp', formatDate(data.timestamp))}
          {createTbody('From', data.message.sender)}
          {createTbody('To', data.message.receiver)}
          </tbody>
        </table>
      </section>
    </div>
  );
}
