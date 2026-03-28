export const CONTACT_PHONE = "919363161304";
export const CONTACT_PHONE_DISPLAY = "9363161304";
export const CONTACT_TEL_LINK = `tel:+${CONTACT_PHONE}`;
export const CONTACT_WHATSAPP_BASE_URL = `https://wa.me/${CONTACT_PHONE}`;

export function buildProductInquiryMessage(
  productName: string,
  categoryLabel?: string,
) {
  const normalizedName = productName.trim();
  const normalizedCategory = categoryLabel?.trim();

  if (!normalizedCategory) {
    return `Hi, I am interested in ${normalizedName}`;
  }

  return `Hi, I am interested in ${normalizedName} from your ${normalizedCategory} collection`;
}

export function buildProductWhatsAppLink(
  productName: string,
  categoryLabel?: string,
) {
  const message = buildProductInquiryMessage(productName, categoryLabel);
  return `${CONTACT_WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}
