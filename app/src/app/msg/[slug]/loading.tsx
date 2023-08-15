import './loading.css';
import React from "react";
import View from "@/app/msg/[slug]/view";

export default function Loading() {
  return <View data={undefined} />;
}

const SkeletonRow = () => {
  return (
    <tr className="border-b border-custom-border">
      <td className="px-4 py-2">
        <div className="skeleton h-6 w-32 bg-primary-bg rounded-md"></div>
      </td>
      <td className="px-4 py-2">
        <div className="skeleton h-6 w-64 bg-primary-bg rounded-md"></div>
      </td>
    </tr>
  );
};
