"use client";

import { usePathname } from "next/navigation";

export default function ClientPath() {
  const pathname = usePathname();

  return (
    <div className="p-2 text-sm text-gray-600">
      📌 当前路径：<span className="font-bold">{pathname}</span>
    </div>
  );
}
