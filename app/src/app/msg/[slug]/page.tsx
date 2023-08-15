import React from 'react';
import {connectToDatabase} from "@/lib/mongo";
import View from "@/app/msg/[slug]/view";

async function getData(msgId: string) {
  const {db} = await connectToDatabase();
  const query = {"message.messageId": msgId};

  // const sleep = (ms: number) => {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }
  //
  // await sleep(3000)

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



  return <View data={data}/>
}
