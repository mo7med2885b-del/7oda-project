import {
  Activity,
  Baby,
  HeartPulse,
  Microscope,
  Scan,
  Stethoscope
} from 'lucide-react';

/* ------------------------------------------------------------------
   Content model for the patient portal landing page.
   Kept separate from the view so copy can be edited without
   touching layout.
------------------------------------------------------------------ */

export const SERVICES = [
  {
    id: 'icsi',
    icon: Microscope,
    dot: '#4fc3f7',
    name_ar: 'الحقن المجهري',
    name_en: 'ICSI',
    tag_ar: 'بروتوكول علاجي متكامل للخصوبة',
    tag_en: 'A complete fertility protocol.',
    body_ar:
      'بروتوكول مصمم حسب حالتك، مع متابعة دقيقة لكل مرحلة من التنشيط حتى سحب البويضات ونقل الأجنة.',
    body_en:
      'A protocol built around your case, with close tracking at every stage from stimulation through retrieval and transfer.'
  },
  {
    id: 'ivf',
    icon: HeartPulse,
    dot: '#4dd0a7',
    name_ar: 'أطفال الأنابيب',
    name_en: 'IVF',
    tag_ar: 'رحلة مدروسة نحو الأمومة',
    tag_en: 'A studied path to parenthood.',
    body_ar:
      'تقييم كامل للخصوبة لكلا الزوجين، ثم خطة علاج واضحة بنسب نجاح واقعية نناقشها معك بصراحة.',
    body_en:
      'A full fertility assessment for both partners, then a clear plan with realistic success rates we discuss openly.'
  },
  {
    id: 'obstetrics',
    icon: Baby,
    dot: '#9d8cff',
    name_ar: 'متابعة الحمل والولادة',
    name_en: 'Obstetrics',
    tag_ar: 'رعاية من أول أسبوع حتى الولادة',
    tag_en: 'Care from week one to delivery.',
    body_ar:
      'متابعة منتظمة بالسونار والتحاليل طوال شهور الحمل، مع خطة ولادة آمنة تناسب حالتك.',
    body_en:
      'Regular ultrasound and lab follow-up through every month of pregnancy, with a safe delivery plan suited to your case.'
  },
  {
    id: 'laparoscopy',
    icon: Activity,
    dot: '#ffd75e',
    name_ar: 'جراحات المناظير',
    name_en: 'Laparoscopy',
    tag_ar: 'تدخل جراحي دقيق وتعافٍ أسرع',
    tag_en: 'Minimal access, faster recovery.',
    body_ar:
      'علاج تكيس المبايض والالتصاقات والأورام الليفية بفتحات صغيرة، مما يعني ألماً أقل وعودة أسرع لحياتك.',
    body_en:
      'Treating PCOS, adhesions and fibroids through small incisions — less pain and a faster return to your life.'
  },
  {
    id: 'ultrasound',
    icon: Scan,
    dot: '#7fd1e8',
    name_ar: 'السونار وطب الأجنة',
    name_en: 'Fetal Medicine',
    tag_ar: 'تشخيص مبكر ودقيق للجنين',
    tag_en: 'Early, precise fetal insight.',
    body_ar:
      'سونار رباعي الأبعاد ومسح تشريحي مفصل للاطمئنان على نمو الجنين واكتشاف أي مشكلة مبكراً.',
    body_en:
      '4D ultrasound and detailed anatomy scans to confirm healthy growth and catch any concern early.'
  },
  {
    id: 'gyn',
    icon: Stethoscope,
    dot: '#f78fa7',
    name_ar: 'أمراض النساء',
    name_en: 'Women’s Health',
    tag_ar: 'رعاية في كل مرحلة من العمر',
    tag_en: 'Care for every stage of life.',
    body_ar:
      'من اضطرابات الدورة والهرمونات حتى سن اليأس، رعاية مبنية على فحص دقيق وخطة علاج واضحة.',
    body_en:
      'From cycle and hormone disorders through menopause — care built on careful examination and a clear plan.'
  }
];

export const MARQUEE_TERMS = [
  { ar: 'الحقن المجهري', en: 'ICSI' },
  { ar: 'أطفال الأنابيب', en: 'IVF' },
  { ar: 'المناظير', en: 'Laparoscopy' },
  { ar: 'متابعة الحمل', en: 'Obstetrics' },
  { ar: 'طب الأجنة', en: 'Fetal Medicine' },
  { ar: 'أمراض النساء', en: 'Gynecology' }
];

export const PROCESS_STEPS = [
  {
    n: '01',
    title_ar: 'احجزي استشارتك',
    title_en: 'Book your consultation',
    body_ar:
      'تبدأ الرحلة بجلسة مع الدكتور يناقش فيها تاريخك الطبي، القلق الذي يشغلك، والهدف الذي تسعين إليه.',
    body_en:
      'Your journey starts with a session where the doctor reviews your medical history, your concerns, and the goal you are working toward.',
    items_ar: [
      'تقييم أولي شامل',
      'مراجعة التاريخ الطبي',
      'مناقشة التحاليل السابقة',
      'تحديد هدف العلاج'
    ],
    items_en: [
      'Full initial assessment',
      'Medical history review',
      'Previous lab work discussion',
      'Treatment goal setting'
    ]
  },
  {
    n: '02',
    title_ar: 'خطة علاج مخصصة',
    title_en: 'A personalised plan',
    body_ar:
      'بناءً على التقييم، يضع الدكتور بروتوكولاً مكتوباً بالخطوات والتكلفة والمدة المتوقعة قبل البدء.',
    body_en:
      'Based on the assessment the doctor writes a protocol with the steps, the cost, and the expected timeline — before anything begins.',
    items_ar: [
      'بروتوكول مكتوب بالتفصيل',
      'تكلفة واضحة مقدماً',
      'جدول زمني متوقع',
      'بدائل علاجية عند الحاجة'
    ],
    items_en: [
      'A written, detailed protocol',
      'Clear upfront pricing',
      'An expected timeline',
      'Alternative routes where relevant'
    ]
  },
  {
    n: '03',
    title_ar: 'متابعة حتى النتيجة',
    title_en: 'Follow-through to result',
    body_ar:
      'متابعة منتظمة بالسونار والتحاليل، مع تعديل الخطة كلما استدعت الحالة ذلك.',
    body_en:
      'Regular ultrasound and lab follow-up, with the plan adjusted whenever your case calls for it.',
    items_ar: [
      'متابعة تبويض بالسونار',
      'تعديل الجرعات عند اللزوم',
      'تواصل مباشر عبر واتساب',
      'دعم مستمر حتى الولادة'
    ],
    items_en: [
      'Ultrasound follicle tracking',
      'Dose adjustment as needed',
      'Direct WhatsApp access',
      'Support through to delivery'
    ]
  }
];

export const FAQS = [
  {
    who_ar: 'منى من القاهرة تسأل...',
    who_en: 'Mona from Cairo asks...',
    q_ar: 'كم تكلفة الحقن المجهري؟',
    q_en: 'How much does ICSI actually cost?',
    a_ar:
      'التكلفة تختلف حسب البروتوكول المناسب لحالتك وعدد جلسات المتابعة. نوضح التكلفة كاملة ومكتوبة بعد الاستشارة الأولى وقبل بدء أي خطوة علاجية.',
    a_en:
      'Cost depends on the protocol your case needs and the number of follow-up visits. We give you the full figure in writing after the first consultation and before any treatment step begins.'
  },
  {
    who_ar: 'سارة من المنصورة تسأل...',
    who_en: 'Sarah from Mansoura asks...',
    q_ar: 'هل يمكنني الحجز أونلاين؟',
    q_en: 'Can I book an appointment online?',
    a_ar:
      'نعم، يمكنك اختيار الفرع والخدمة والموعد المتاح وتأكيد الحجز من هذه الصفحة مباشرة.',
    a_en:
      'Yes — pick your branch, service and an open slot, and confirm right here on this page.'
  },
  {
    who_ar: 'هدى من بورسعيد تسأل...',
    who_en: 'Hoda from Port Said asks...',
    q_ar: 'ما هي نسبة نجاح الحقن المجهري؟',
    q_en: 'What are the ICSI success rates?',
    a_ar:
      'النسبة تعتمد على السن وسبب التأخر ومخزون المبيض. يناقش معك الدكتور النسبة المتوقعة لحالتك تحديداً بصراحة، دون وعود غير واقعية.',
    a_en:
      'Rates depend on age, the cause of delay, and ovarian reserve. The doctor discusses the realistic expectation for your specific case honestly — no inflated promises.'
  },
  {
    who_ar: 'أمل من دمياط تسأل...',
    who_en: 'Amal from Damietta asks...',
    q_ar: 'هل بياناتي الطبية محفوظة؟',
    q_en: 'Is my medical information kept private?',
    a_ar:
      'ملفك الطبي محفوظ في نظام العيادة ولا يُطلع عليه إلا الدكتور المسؤول عن حالتك.',
    a_en:
      'Your file lives in the clinic system and is visible only to the doctor handling your case.'
  }
];

export const MORE_FAQS = [
  {
    q_ar: 'ماذا أحضر معي في أول زيارة؟',
    q_en: 'What should I bring to the first visit?',
    a_ar: 'أحضري التحاليل والأشعة السابقة، وتقارير أي محاولات علاج سابقة إن وُجدت.',
    a_en: 'Bring previous labs and scans, plus reports from any earlier treatment attempts.'
  },
  {
    q_ar: 'كم تستغرق الاستشارة؟',
    q_en: 'How long does a consultation take?',
    a_ar: 'الاستشارة الأولى تستغرق عادة من 30 إلى 45 دقيقة لمراجعة الحالة بشكل كامل.',
    a_en: 'A first consultation usually runs 30–45 minutes to review the case in full.'
  },
  {
    q_ar: 'هل يمكن تعديل أو إلغاء الموعد؟',
    q_en: 'Can I reschedule or cancel?',
    a_ar: 'نعم، تواصلي معنا عبر واتساب أو الهاتف قبل الموعد وسنعيد الجدولة.',
    a_en: 'Yes — message us on WhatsApp or call ahead of time and we will reschedule.'
  },
  {
    q_ar: 'هل يوجد استشارات عن بُعد؟',
    q_en: 'Do you offer remote consultations?',
    a_ar: 'نعم، تتوفر استشارات المتابعة عن بُعد للحالات المناسبة بعد الزيارة الأولى.',
    a_en: 'Yes — remote follow-up consultations are available for suitable cases after the first visit.'
  }
];

export const TESTIMONIALS = [
  {
    body_ar:
      'بعد سنوات من المحاولة، كان الفارق أن الدكتور شرح لي كل خطوة قبل ما نبدأ. حملت من أول محاولة حقن مجهري.',
    body_en:
      'After years of trying, the difference was that every step was explained before we started. I conceived on the first ICSI attempt.',
    name_ar: 'م. عبد الرحمن',
    name_en: 'M. Abdelrahman'
  },
  {
    body_ar:
      'المتابعة كانت منتظمة والرد على أسئلتي في أي وقت. حسيت إني مش لوحدي في الرحلة دي.',
    body_en:
      'Follow-up was consistent and my questions were answered any time. I never felt alone in the process.',
    name_ar: 'ن. السيد',
    name_en: 'N. Elsayed'
  },
  {
    body_ar:
      'عملية المنظار كانت أبسط مما توقعت والتعافي كان سريع. الشرح قبل العملية طمنني جداً.',
    body_en:
      'The laparoscopy was simpler than I expected and recovery was quick. The pre-op explanation put me at ease.',
    name_ar: 'ه. مصطفى',
    name_en: 'H. Mostafa'
  },
  {
    body_ar: 'التكلفة كانت واضحة من البداية، مفيش مفاجآت. ده اللي خلاني أكمل معاه.',
    body_en: 'Costs were clear from the start — no surprises. That is why I stayed.',
    name_ar: 'ر. فتحي',
    name_en: 'R. Fathy'
  },
  {
    body_ar:
      'تابعت حملي كله معاه من أول أسبوع لحد الولادة. كل سونار كان بيشرحلي فيه إيه اللي بيحصل بالظبط.',
    body_en:
      'He followed my whole pregnancy from the first week to delivery. At every scan he explained exactly what was happening.',
    name_ar: 'س. الشناوي',
    name_en: 'S. El-Shennawy'
  },
  {
    body_ar:
      'كنت خايفة جداً من فكرة العملية، بس الشرح الهادي والصبر على أسئلتي غيّر رأيي تماماً.',
    body_en:
      'I was very anxious about surgery, but the calm explanation and patience with my questions changed my mind completely.',
    name_ar: 'د. القاضي',
    name_en: 'D. El-Kady'
  },
  {
    body_ar:
      'اتنقلت من دكتور لدكتور سنين. هنا لأول مرة حسيت إن في خطة واضحة مكتوبة قدامي مش مجرد كلام.',
    body_en:
      'I moved between doctors for years. Here, for the first time, I had a clear written plan in front of me — not just talk.',
    name_ar: 'أ. بدر',
    name_en: 'A. Badr'
  },
  {
    body_ar:
      'المتابعة بعد الولادة كانت زي المتابعة قبلها بالظبط. محستش في أي وقت إن دوري خلص.',
    body_en:
      'The follow-up after delivery was exactly as attentive as before it. I never felt forgotten once my case was done.',
    name_ar: 'ي. عامر',
    name_en: 'Y. Amer'
  }
];

export const COMPARISON = [
  {
    old_ar: 'انتظار طويل بدون موعد محدد',
    old_en: 'Long waits, no real appointment',
    new_ar: 'موعد محدد بالدقيقة',
    new_en: 'A slot booked to the minute'
  },
  {
    old_ar: 'تكلفة غير واضحة',
    old_en: 'Unclear, shifting costs',
    new_ar: 'تكلفة مكتوبة قبل البدء',
    new_en: 'Costs written down upfront'
  },
  {
    old_ar: 'شرح سريع وغير كافٍ',
    old_en: 'Rushed, thin explanations',
    new_ar: 'شرح كامل لكل خطوة',
    new_en: 'Every step explained in full'
  },
  {
    old_ar: 'صعوبة التواصل بعد الزيارة',
    old_en: 'Hard to reach after the visit',
    new_ar: 'تواصل مباشر عبر واتساب',
    new_en: 'Direct WhatsApp follow-up'
  }
];
