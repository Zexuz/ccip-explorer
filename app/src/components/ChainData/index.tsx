import Image from "next/image";

export default function ChainData({address, chain}: { address: string, chain: { imgUrl: string, name: string } }) {
  return (
    <div className="flex items-center">
      <Image className="h-6" src={chain.imgUrl} width={16} height={16} alt={chain.name}/>
      <p className="text-xs font-mono ml-2">{address} ({chain.name})</p>
    </div>
  )
}
