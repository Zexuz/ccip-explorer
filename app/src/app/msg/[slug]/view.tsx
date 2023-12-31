import React from 'react';
import {formatDate} from "@/utils/date";

export default async function View({data}: any) {

  const createTbody = (title: string, value: string | undefined) => {
    return (
      <tr className="border-b">
        <td className="px-4 py-2 font-semibold">{title}</td>
        <td className="px-4 py-2">{value || <div className="skeleton h-6 w-64 bg-primary-bg rounded-md"></div>}</td>
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
          {createTbody('Message ID', data?.message?.messageId)}
          {createTbody('Source Chain', data?.senderChain)}
          {createTbody('Destination Chain', data?.destinationChain)}
          {createTbody('Timestamp', data?.timestamp ? formatDate(data.timestamp) : undefined)}
          {createTbody('From', data?.message?.sender)}
          {createTbody('To', data?.message?.receiver)}
          </tbody>
        </table>
      </section>
    </div>
  );
}
