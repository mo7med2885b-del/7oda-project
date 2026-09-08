/**
 * Videos from the doctor's YouTube channel.
 *
 * TO ADD A VIDEO: copy the id from its URL (the part after `v=`) and add an
 * entry below. Thumbnails are pulled from YouTube automatically — nothing
 * needs to be downloaded or committed.
 *
 *   https://www.youtube.com/watch?v=oMYcOCRGrcE
 *                                   ^^^^^^^^^^^ id
 */

export const CHANNEL_URL = 'https://www.youtube.com/@dr.mohammedhosni5659';

export interface VideoItem {
  id: string;
  duration: string;
  title_ar: string;
  title_en: string;
  blurb_ar: string;
  blurb_en: string;
}

/**
 * Order matters: the fan is centred on the middle of this list, so the
 * strongest videos sit at the centre of the arc where the eye lands first.
 */
export const VIDEOS: VideoItem[] = [
  {
    id: '765Id9EcCxA',
    duration: '1:00:43',
    title_ar: 'كل ما تريد معرفته عن الحقن المجهري',
    title_en: 'Everything you need to know about ICSI',
    blurb_ar:
      'حلقة كاملة تشرح رحلة الحقن المجهري خطوة بخطوة، من التنشيط حتى نقل الأجنة.',
    blurb_en:
      'A full session walking through the ICSI journey step by step, from stimulation to embryo transfer.'
  },
  {
    id: 'QL5A3gE_mfE',
    duration: '3:56',
    title_ar: 'نصائح عامة للمرأة الحامل وغير الحامل',
    title_en: 'General advice for women, pregnant or not',
    blurb_ar: 'إرشادات عملية للعناية بصحتك قبل الحمل وأثناءه.',
    blurb_en: 'Practical guidance for looking after your health before and during pregnancy.'
  },
  {
    id: 'lyRKDZlzACk',
    duration: '3:26',
    title_ar: 'دور معمل الأجنة في نجاح الحقن المجهري',
    title_en: 'The embryology lab’s role in ICSI success',
    blurb_ar: 'لماذا تعتمد نسبة النجاح على جودة المعمل بقدر اعتمادها على البروتوكول العلاجي.',
    blurb_en: 'Why success rates depend on lab quality as much as on the treatment protocol.'
  },
  {
    id: 'oMYcOCRGrcE',
    duration: '3:29',
    title_ar: 'دور الغدة الدرقية في حدوث الحمل وتأخره',
    title_en: 'The thyroid’s role in conception and delay',
    blurb_ar:
      'كيف يؤثر خلل الغدة الدرقية على فرص الحمل والإجهاض المتكرر، ومتى يجب عمل التحاليل.',
    blurb_en:
      'How thyroid dysfunction affects conception and recurrent miscarriage, and when to get tested.'
  },
  {
    id: 'bSmfv8oLAdI',
    duration: '5:29',
    title_ar: 'التغيرات الطبيعية للمرأة الحامل',
    title_en: 'Normal changes during pregnancy',
    blurb_ar: 'ما هو الطبيعي خلال شهور الحمل، ومتى يستدعي الأمر استشارة الطبيب.',
    blurb_en: 'What is normal through the months of pregnancy, and when to seek advice.'
  },
  {
    id: 's5FVt7ETXBY',
    duration: '2:14',
    title_ar: 'متى يتم عمل حقن مجهري في أسرع وقت',
    title_en: 'When ICSI should not be delayed',
    blurb_ar: 'الحالات التي لا ينبغي فيها تأجيل الحقن المجهري، وأسباب ذلك.',
    blurb_en: 'The cases where ICSI should not be postponed, and why.'
  },
  {
    id: 'EkEPH4R8T5c',
    duration: '3:58',
    title_ar: 'بطانة الرحم المهاجرة وأكياس الشوكولاتة',
    title_en: 'Endometriosis and chocolate cysts',
    blurb_ar: 'أعراض بطانة الرحم المهاجرة وتأثيرها على الخصوبة وطرق التعامل معها.',
    blurb_en: 'Symptoms of endometriosis, its effect on fertility, and how it is managed.'
  },
  {
    id: 'CTrEIiiylOw',
    duration: '3:43',
    title_ar: 'سر نجاح عمليات الحقن المجهري',
    title_en: 'What makes ICSI succeed',
    blurb_ar: 'العوامل الحقيقية وراء نجاح عملية الحقن المجهري من واقع الخبرة العملية.',
    blurb_en: 'The real factors behind a successful ICSI cycle, from clinical experience.'
  }
];

/** YouTube serves these sizes for every public video — no API key needed. */
export const thumbUrl = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/** `nocookie` avoids setting tracking cookies until the viewer hits play. */
export const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
