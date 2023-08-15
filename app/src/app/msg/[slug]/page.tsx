import React from 'react';
import {formatDate} from "@/utils/date";


async function getData(msgId: string) {
  const res = await fetch(`http://localhost:3001/api/msg/${msgId}`)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
            .then((data) => data.msg);
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
