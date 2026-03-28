import { MessageCircle, Phone } from "lucide-react";

import {
  buildProductWhatsAppLink,
  CONTACT_TEL_LINK,
} from "../lib/contact";

interface ProductContactCtaProps {
  productName: string;
  categoryLabel?: string;
  labelClassName?: string;
}

export function ProductContactCta({
  productName,
  categoryLabel,
  labelClassName = "text-sm text-slate-500",
}: ProductContactCtaProps) {
  return (
    <div>
      <p className={labelClassName}>Price on Request</p>

      <div className="mt-3 flex flex-col gap-2">
        <a
          href={CONTACT_TEL_LINK}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#c89b3c] px-4 py-2 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#b88a2f]"
        >
          <Phone className="h-4 w-4" />
          Call Now
        </a>
        <a
          href={buildProductWhatsAppLink(productName, categoryLabel)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-green-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-green-50"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
