"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
      <QRCodeSVG value={value} size={size} />
    </div>
  );
}
