import { doctorInfo } from './i18n';

/**
 * Builds the WhatsApp deep link with a prefilled enquiry template, so the
 * patient only has to fill in their details rather than compose a message.
 *
 * Branch options are read from `doctorInfo.branches`, so the list stays in
 * sync automatically if a branch is added or removed.
 */
export const buildWhatsAppLink = (isAr: boolean) => {
  const branchesAr = doctorInfo.branches.map(b => b.city_ar).join(' / ');
  const branchesEn = doctorInfo.branches.map(b => b.city_en).join(' / ');

  const message = isAr
    ? [
        `السلام عليكم، كنت حابة أستفسر وأحجز موعد مع ${doctorInfo.name_ar}:`,
        '',
        'الاسم: ',
        'السن: ',
        `الفرع (${branchesAr}): `,
        'سبب الزيارة: '
      ].join('\n')
    : [
        `Hello, I would like to enquire and book an appointment with ${doctorInfo.name_en}:`,
        '',
        'Name: ',
        'Age: ',
        `Branch (${branchesEn}): `,
        'Reason for visit: '
      ].join('\n');

  return `https://wa.me/${doctorInfo.whatsapp_phone}?text=${encodeURIComponent(message)}`;
};
