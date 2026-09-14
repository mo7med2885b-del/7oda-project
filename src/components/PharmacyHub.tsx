import React, { useState, useMemo, useRef } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Drug, MovementType } from '../types';
import {
  Pill,
  AlertTriangle,
  Search,
  Plus,
  X,
  ClipboardList,
  Package,
  ShieldAlert,
  Minus,
  Trash2,
  Camera,
  ImageIcon,
  Check
} from 'lucide-react';

type Tab = 'stock' | 'give' | 'protocols';

/** Category → accent colour. Used for the image placeholder tiles. */
const CATEGORY_TONE: Record<string, { bg: string; text: string }> = {
  'IVF Stimulation': { bg: 'bg-violet-500/12', text: 'text-violet-600 dark:text-violet-300' },
  'IVF Antagonist': { bg: 'bg-violet-500/12', text: 'text-violet-600 dark:text-violet-300' },
  'IVF Agonist': { bg: 'bg-violet-500/12', text: 'text-violet-600 dark:text-violet-300' },
  'IVF Trigger': { bg: 'bg-violet-500/12', text: 'text-violet-600 dark:text-violet-300' },
  Antibiotic: { bg: 'bg-sky-500/12', text: 'text-sky-600 dark:text-sky-300' },
  Anticoagulant: { bg: 'bg-rose-500/12', text: 'text-rose-600 dark:text-rose-300' },
  Hormone: { bg: 'bg-pink-500/12', text: 'text-pink-600 dark:text-pink-300' },
  Supplement: { bg: 'bg-emerald-500/12', text: 'text-emerald-600 dark:text-emerald-300' },
  Iron: { bg: 'bg-amber-500/12', text: 'text-amber-600 dark:text-amber-300' },
  Calcium: { bg: 'bg-amber-500/12', text: 'text-amber-600 dark:text-amber-300' }
};
const toneFor = (cat?: string) =>
  CATEGORY_TONE[cat || ''] || { bg: 'bg-slate-400/12', text: 'text-slate-600 dark:text-slate-300' };

/**
 * Large, clear photo tile for the stock grid — a full-width square panel,
 * not a small thumbnail. Falls back to a big coloured monogram so cards
 * stay visually consistent while photos are still being added.
 */
const DrugImage: React.FC<{ drug: Drug; size?: 'panel' | 'row' | 'thumb' }> = ({ drug, size = 'panel' }) => {
  const { getDrugImageUrl } = useClinic();
  const url = getDrugImageUrl(drug.image_path);
  const tone = toneFor(drug.category);

  if (size === 'panel') {
    // Big square photo used at the top of each stock card.
    return (
      <div className={`w-full aspect-square rounded-2xl overflow-hidden ${url ? 'bg-white' : tone.bg} border border-[#C6D2E2] dark:border-white/10 flex items-center justify-center`}>
        {url ? (
          <img src={url} alt={drug.name} loading="lazy" className="w-full h-full object-contain p-2" />
        ) : (
          <span className={`text-4xl font-black ${tone.text}`} aria-hidden="true">
            {drug.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  const box = size === 'row' ? 'w-16 h-16' : 'w-11 h-11';
  const txt = size === 'row' ? 'text-lg' : 'text-sm';
  return url ? (
    <img
      src={url}
      alt={drug.name}
      loading="lazy"
      className={`${box} rounded-xl object-contain bg-white shrink-0 border border-[#C6D2E2] dark:border-white/10 p-1`}
    />
  ) : (
    <div
      className={`${box} rounded-xl ${tone.bg} ${tone.text} ${txt} font-black flex items-center justify-center shrink-0`}
      aria-hidden="true"
    >
      {drug.name.slice(0, 2).toUpperCase()}
    </div>
  );
};

export const PharmacyHub: React.FC = () => {
  const { lang, drugs, drugMovements, prescriptionTemplates, patients, deleteDrug } = useClinic();
  const isAr = lang === 'ar';

  const [tab, setTab] = useState<Tab>('stock');
  const [search, setSearch] = useState('');
  const [showAddDrug, setShowAddDrug] = useState(false);
  const [movementDrug, setMovementDrug] = useState<Drug | null>(null);

  const egp = (n: number) => `${Math.round(n).toLocaleString()}`;

  const lowStock = drugs.filter(d => d.stock_qty <= d.reorder_level);
  const outCount = drugs.filter(d => d.stock_qty <= 0).length;

  const missing = useMemo(
    () => drugMovements.filter(m => m.movement_type === 'loss' || (m.movement_type === 'adjustment' && m.quantity < 0)),
    [drugMovements]
  );
  const missingValue = missing.reduce((s, m) => s + Math.abs(m.total_value), 0);

  const givenValue = drugMovements
    .filter(m => m.movement_type === 'dispense')
    .reduce((s, m) => s + m.total_value, 0);

  const filtered = drugs
    .filter(d => {
      const q = search.trim().toLowerCase();
      return !q || d.name.toLowerCase().includes(q) || (d.name_ar || '').includes(search.trim());
    })
    // Drugs with a real photo first; the ones still needing one sink to the bottom.
    .sort((a, b) => Number(!a.image_path) - Number(!b.image_path));

  const drugName = (id: string) => drugs.find(d => d.id === id)?.name || '—';

  const card = 'rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-sm';

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'stock', label: isAr ? 'المخزون' : 'Stock', icon: Package, count: drugs.length },
    { id: 'give', label: isAr ? 'صرف للمريضة' : 'Give to Patient', icon: Pill },
    { id: 'protocols', label: isAr ? 'الروشتات' : 'Protocols', icon: ClipboardList, count: prescriptionTemplates.length }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-black text-[#2C3137] dark:text-white flex items-center gap-2">
          <Pill className="w-6 h-6 text-[#6AB8FF]" aria-hidden="true" />
          {isAr ? 'الصيدلية' : 'Pharmacy'}
        </h2>
        <button
          onClick={() => setShowAddDrug(true)}
          className="min-h-[44px] px-5 rounded-full bg-[#6AB8FF] hover:bg-[#4FA5F5] text-white font-bold text-sm shadow-sm transition flex items-center gap-2 self-start focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          {isAr ? 'إضافة دواء' : 'Add Drug'}
        </button>
      </div>

      {/* Three honest numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className={`${card} p-5`}>
          <div className="text-xs font-semibold text-[#7C7C7C] dark:text-slate-400">
            {isAr ? 'أصناف بالمخزن' : 'Items in stock'}
          </div>
          <div className="text-3xl font-black text-[#2C3137] dark:text-white mt-2" dir="ltr">
            {drugs.length}
          </div>
          <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1">
            {lowStock.length > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {lowStock.length} {isAr ? 'قارب على النفاد' : 'running low'}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {isAr ? 'كل الأصناف متوفرة' : 'all in stock'}
              </span>
            )}
          </div>
        </div>

        <div className={`${card} p-5`}>
          <div className="text-xs font-semibold text-[#7C7C7C] dark:text-slate-400">
            {isAr ? 'مبيعات الأدوية' : 'Drug sales'}
          </div>
          <div className="text-3xl font-black text-[#6AB8FF] mt-2" dir="ltr">
            {egp(givenValue)}
            <span className="text-sm font-bold text-[#7C7C7C] ms-1.5">{isAr ? 'ج.م' : 'EGP'}</span>
          </div>
          <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1">
            {drugMovements.filter(m => m.movement_type === 'dispense').length}{' '}
            {isAr ? 'عملية صرف للمرضى' : 'dispensed to patients'}
          </div>
        </div>

        <div className={`${card} p-5 ${missingValue > 0 ? 'ring-2 ring-rose-400/50' : ''}`}>
          <div className="text-xs font-semibold text-[#7C7C7C] dark:text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
            {isAr ? 'ناقص بدون صرف' : 'Missing stock'}
          </div>
          <div
            className={`text-3xl font-black mt-2 ${missingValue > 0 ? 'text-rose-500' : 'text-emerald-500'}`}
            dir="ltr"
          >
            {egp(missingValue)}
            <span className="text-sm font-bold text-[#7C7C7C] ms-1.5">{isAr ? 'ج.م' : 'EGP'}</span>
          </div>
          <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1">
            {missingValue > 0 ? (
              <span className="text-rose-500 font-semibold">
                {missing.length} {isAr ? 'حركة تحتاج مراجعة' : 'events to review'}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {isAr ? 'لا يوجد ناقص' : 'nothing missing'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Missing detail */}
      {missing.length > 0 && (
        <div className="rounded-2xl border border-rose-400/40 bg-rose-500/5 p-4">
          <h3 className="font-bold text-sm text-rose-700 dark:text-rose-300 flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            {isAr ? 'أدوية خرجت ولم تصل لمريضة' : 'Stock that left without reaching a patient'}
          </h3>
          <ul className="space-y-2">
            {missing.slice(0, 8).map(m => (
              <li key={m.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <span className="font-bold text-[#2C3137] dark:text-white">{drugName(m.drug_id)}</span>
                  <span className="text-[#7C7C7C] dark:text-slate-400">
                    {' '}
                    — {m.reason || (isAr ? 'بدون سبب' : 'no reason')} · {m.performed_by || '—'} ·{' '}
                    {m.created_at.split('T')[0]}
                  </span>
                </div>
                <span className="font-mono font-bold text-rose-500 shrink-0" dir="ltr">
                  {m.quantity} · {egp(Math.abs(m.total_value))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Low stock */}
      {lowStock.length > 0 && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/5 p-4">
          <h3 className="font-bold text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2 mb-2.5">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            {isAr ? 'يحتاج طلب جديد' : 'Needs reordering'}
            {outCount > 0 && (
              <span className="font-normal">
                ({outCount} {isAr ? 'منتهي تماماً' : 'fully out'})
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(d => (
              <span
                key={d.id}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
                  d.stock_qty <= 0
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                }`}
              >
                {d.name} · {d.stock_qty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs — 44px min touch target */}
      <div role="tablist" className="flex items-center gap-2 flex-wrap">
        {tabs.map(tb => {
          const Icon = tb.icon;
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(tb.id)}
              className={`min-h-[44px] px-4 rounded-full text-sm font-bold flex items-center gap-2 border transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30 ${
                active
                  ? 'bg-[#2C3137] text-white border-[#2C3137]'
                  : 'bg-white dark:bg-[#22262B] text-[#2C3137] dark:text-slate-200 border-[#C6D2E2] dark:border-[#6AB8FF]/25 hover:border-[#6AB8FF]'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {tb.label}
              {tb.count !== undefined && (
                <span className={`text-xs font-mono ${active ? 'text-white/60' : 'text-[#7C7C7C]'}`}>{tb.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------- STOCK ---------- */}
      {tab === 'stock' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-[#7C7C7C]" aria-hidden="true" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'ابحث عن دواء...' : 'Search drugs...'}
              aria-label={isAr ? 'ابحث عن دواء' : 'Search drugs'}
              className="w-full min-h-[44px] ps-11 pe-4 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-sm text-[#2C3137] dark:text-white placeholder:text-[#7C7C7C] focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(d => {
              const low = d.stock_qty <= d.reorder_level;
              const out = d.stock_qty <= 0;
              return (
                <div
                  key={d.id}
                  className={`${card} overflow-hidden flex flex-col ${
                    out ? 'ring-2 ring-rose-400/60' : low ? 'ring-2 ring-amber-400/60' : ''
                  }`}
                >
                  {/* Big clear photo */}
                  <div className="relative p-3 pb-0">
                    <DrugImage drug={d} size="panel" />

                    {/* Status badge overlaid on the photo — instantly scannable */}
                    {(out || low) && (
                      <span
                        className={`absolute top-4 start-4 px-2 py-1 rounded-lg text-[11px] font-black text-white shadow ${
                          out ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                      >
                        {out ? (isAr ? 'نفد' : 'OUT') : isAr ? 'قارب على النفاد' : 'LOW'}
                      </span>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(isAr ? `حذف ${d.name}؟` : `Delete ${d.name}?`)) deleteDrug(d.id);
                      }}
                      aria-label={isAr ? `حذف ${d.name}` : `Delete ${d.name}`}
                      className="absolute top-4 end-4 w-9 h-9 rounded-lg bg-white/90 dark:bg-[#2C3137]/90 backdrop-blur text-[#7C7C7C] hover:text-rose-500 shadow flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Name + category */}
                  <div className="px-4 pt-3">
                    <div className="font-bold text-[15px] text-[#2C3137] dark:text-white leading-tight">{d.name}</div>
                    {d.name_ar && <div className="text-sm text-[#7C7C7C] dark:text-slate-400 mt-0.5">{d.name_ar}</div>}
                  </div>

                  {/* Quantity + price — the two numbers that matter, large */}
                  <div className="px-4 pt-3 pb-4 mt-auto grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] p-2.5">
                      <div className="text-[11px] font-semibold text-[#7C7C7C] dark:text-slate-400">
                        {isAr ? 'الكمية' : 'Qty'}
                      </div>
                      <div
                        className={`text-2xl font-black leading-none mt-1 ${
                          out ? 'text-rose-500' : low ? 'text-amber-500' : 'text-[#2C3137] dark:text-white'
                        }`}
                        dir="ltr"
                      >
                        {d.stock_qty}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#6AB8FF]/10 p-2.5">
                      <div className="text-[11px] font-semibold text-[#7C7C7C] dark:text-slate-400">
                        {isAr ? 'السعر' : 'Price'}
                      </div>
                      <div className="text-2xl font-black text-[#6AB8FF] leading-none mt-1" dir="ltr">
                        {egp(d.unit_price)}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      onClick={() => setMovementDrug(d)}
                      className="flex-1 min-h-[44px] rounded-xl bg-[#2C3137] dark:bg-[#6AB8FF] text-white text-sm font-bold hover:opacity-90 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
                    >
                      {isAr ? 'تعديل الكمية' : 'Adjust'}
                    </button>
                    <DrugPhotoButton drug={d} />
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className={`${card} p-10 text-center`}>
              <Package className="w-8 h-8 text-[#7C7C7C] mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-[#7C7C7C]">{isAr ? 'لا توجد نتائج.' : 'No results.'}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'give' && <GivePanel />}

      {/* ---------- PROTOCOLS ---------- */}
      {tab === 'protocols' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {prescriptionTemplates.map(t => (
            <article key={t.id} className={`${card} p-5`}>
              <header>
                <h3 className="font-black text-base text-[#2C3137] dark:text-white">
                  {isAr && t.name_ar ? t.name_ar : t.name}
                </h3>
                {isAr && t.name_ar && <p className="text-xs text-[#7C7C7C] mt-0.5">{t.name}</p>}
                <p className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1">
                  {t.items.length} {isAr ? 'دواء' : 'drugs'}
                </p>
              </header>

              {t.notes && (
                <p className="mt-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm font-semibold text-amber-800 dark:text-amber-200">
                  {t.notes}
                </p>
              )}

              <ol className="mt-4 space-y-2.5">
                {t.items.map((it, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#6AB8FF]/12 text-[#6AB8FF] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#2C3137] dark:text-white">{it.drug_name}</div>
                      <div className="text-sm text-[#7C7C7C] dark:text-slate-400 leading-relaxed">
                        {isAr ? it.dosage_ar : it.dosage}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      )}

      {showAddDrug && <AddDrugModal onClose={() => setShowAddDrug(false)} />}
      {movementDrug && <MovementModal drug={movementDrug} onClose={() => setMovementDrug(null)} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Photo upload button — where the drug images will land               */
const DrugPhotoButton: React.FC<{ drug: Drug }> = ({ drug }) => {
  const { lang, uploadDrugImage } = useClinic();
  const isAr = lang === 'ar';
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    await uploadDrugImage(drug.id, file);
    setBusy(false);
    e.target.value = '';
  };

  return (
    <>
      <button
        onClick={() => ref.current?.click()}
        disabled={busy}
        aria-label={isAr ? `صورة ${drug.name}` : `Photo for ${drug.name}`}
        title={isAr ? 'إضافة صورة الدواء' : 'Add drug photo'}
        className="min-h-[44px] w-[44px] rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[#7C7C7C] hover:text-[#6AB8FF] hover:border-[#6AB8FF] transition flex items-center justify-center shrink-0 disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
      >
        {busy ? (
          <span className="w-4 h-4 rounded-full border-2 border-[#6AB8FF]/30 border-t-[#6AB8FF] animate-spin" />
        ) : drug.image_path ? (
          <ImageIcon className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Camera className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
      <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={pick} />
    </>
  );
};

/* ------------------------------------------------------------------ */
const GivePanel: React.FC = () => {
  const { lang, drugs, patients, prescriptionTemplates, recordMovement } = useClinic();
  const isAr = lang === 'ar';
  const [patientId, setPatientId] = useState('');
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [appliedTpl, setAppliedTpl] = useState<string | null>(null);

  const egp = (n: number) => `${Math.round(n).toLocaleString()}`;

  const applyTemplate = (id: string) => {
    const t = prescriptionTemplates.find(x => x.id === id);
    if (!t) return;
    const next = { ...picked };
    t.items.forEach(it => {
      const d = drugs.find(x => x.name.toLowerCase() === it.drug_name.toLowerCase());
      if (d) next[d.id] = (next[d.id] || 0) + 1;
    });
    setPicked(next);
    setAppliedTpl(id);
    setTimeout(() => setAppliedTpl(null), 1500);
  };

  const total = Object.entries(picked).reduce((s, [id, q]) => {
    const d = drugs.find(x => x.id === id);
    return s + (d?.unit_price || 0) * q;
  }, 0);

  const chosen = Object.entries(picked).filter(([, q]) => q > 0);
  const hasOverdraw = chosen.some(([id, q]) => {
    const d = drugs.find(x => x.id === id);
    return d ? q > d.stock_qty : false;
  });

  const submit = async () => {
    if (!patientId || chosen.length === 0) return;
    setBusy(true);
    for (const [drugId, qty] of chosen) {
      const d = drugs.find(x => x.id === drugId);
      await recordMovement({
        drug_id: drugId,
        movement_type: 'dispense',
        quantity: -qty,
        unit_price: d?.unit_price || 0,
        patient_id: patientId
      });
    }
    setBusy(false);
    setPicked({});
  };

  const card = 'rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-sm';
  const field =
    'w-full min-h-[44px] px-3.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-sm text-[#2C3137] dark:text-white focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15';

  const list = drugs.filter(d => {
    const q = search.trim().toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || (d.name_ar || '').includes(search.trim());
  });

  const StepLabel: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-6 h-6 rounded-full bg-[#6AB8FF] text-white text-xs font-black flex items-center justify-center shrink-0">
        {n}
      </span>
      <h3 className="text-sm font-bold text-[#2C3137] dark:text-white">{children}</h3>
    </div>
  );

  return (
    <div className="space-y-4 pb-24">
      <div className={`${card} p-5`}>
        <StepLabel n={1}>{isAr ? 'اختر المريضة' : 'Choose the patient'}</StepLabel>
        <select
          value={patientId}
          onChange={e => setPatientId(e.target.value)}
          aria-label={isAr ? 'اختر المريضة' : 'Choose patient'}
          className={field}
        >
          <option value="">{isAr ? 'اختر...' : 'Select...'}</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.full_name}</option>
          ))}
        </select>
      </div>

      <div className={`${card} p-5`}>
        <StepLabel n={2}>{isAr ? 'روشتة جاهزة (اختياري)' : 'Ready protocol (optional)'}</StepLabel>
        <div className="flex flex-wrap gap-2">
          {prescriptionTemplates.map(t => {
            const just = appliedTpl === t.id;
            return (
              <button
                key={t.id}
                onClick={() => applyTemplate(t.id)}
                className={`min-h-[44px] px-4 rounded-full border text-sm font-semibold transition flex items-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30 ${
                  just
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-[#6AB8FF]/8 text-[#2C3137] dark:text-slate-200 border-[#6AB8FF]/30 hover:bg-[#6AB8FF] hover:text-white'
                }`}
              >
                {just ? <Check className="w-4 h-4" aria-hidden="true" /> : <Plus className="w-4 h-4" aria-hidden="true" />}
                {isAr && t.name_ar ? t.name_ar : t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`${card} p-5`}>
        <StepLabel n={3}>{isAr ? 'الأدوية والكميات' : 'Drugs and quantities'}</StepLabel>

        <div className="relative mb-3">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-[#7C7C7C]" aria-hidden="true" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث...' : 'Search...'}
            aria-label={isAr ? 'ابحث عن دواء' : 'Search drugs'}
            className={`${field} ps-11`}
          />
        </div>

        <ul className="max-h-[26rem] overflow-y-auto space-y-2 pe-1">
          {list.map(d => {
            const qty = picked[d.id] || 0;
            const over = qty > d.stock_qty;
            return (
              <li
                key={d.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  qty > 0
                    ? over
                      ? 'border-rose-400 bg-rose-500/5'
                      : 'border-[#6AB8FF] bg-[#6AB8FF]/5'
                    : 'border-[#C6D2E2] dark:border-white/10'
                }`}
              >
                <DrugImage drug={d} size="row" />

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-[#2C3137] dark:text-white truncate">{d.name}</div>
                  <div className="text-xs text-[#7C7C7C] dark:text-slate-400" dir="ltr">
                    {egp(d.unit_price)} {isAr ? 'ج.م' : 'EGP'} · {isAr ? 'متاح' : 'have'} {d.stock_qty}
                  </div>
                  {over && (
                    <div className="text-xs text-rose-500 font-bold mt-0.5">
                      ⚠ {isAr ? 'أكبر من الكمية المتاحة' : 'more than available'}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setPicked(p => ({ ...p, [d.id]: Math.max(0, (p[d.id] || 0) - 1) }))}
                    aria-label={isAr ? `إنقاص ${d.name}` : `Decrease ${d.name}`}
                    className="w-11 h-11 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-white/10 text-[#2C3137] dark:text-white hover:border-[#6AB8FF] hover:text-[#6AB8FF] transition flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span
                    className="w-9 text-center font-mono font-black text-base text-[#2C3137] dark:text-white"
                    dir="ltr"
                    aria-live="polite"
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setPicked(p => ({ ...p, [d.id]: (p[d.id] || 0) + 1 }))}
                    aria-label={isAr ? `زيادة ${d.name}` : `Increase ${d.name}`}
                    className="w-11 h-11 rounded-xl bg-[#6AB8FF] text-white hover:bg-[#4FA5F5] transition flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sticky summary bar */}
      {chosen.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 md:sticky md:bottom-4 px-3 pb-3 md:px-0 md:pb-0">
          <div className="max-w-7xl mx-auto rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-lg p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#7C7C7C] dark:text-slate-400">
                {chosen.length} {isAr ? 'صنف' : 'items'}
              </div>
              <div className="text-2xl font-black text-[#6AB8FF] leading-tight" dir="ltr">
                {egp(total)}
                <span className="text-sm font-bold text-[#7C7C7C] ms-1.5">{isAr ? 'ج.م' : 'EGP'}</span>
              </div>
            </div>
            <button
              onClick={submit}
              disabled={busy || !patientId || hasOverdraw}
              className="min-h-[48px] px-6 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
            >
              {busy
                ? isAr ? 'جارٍ الحفظ...' : 'Saving...'
                : !patientId
                ? isAr ? 'اختر المريضة أولاً' : 'Choose a patient'
                : hasOverdraw
                ? isAr ? 'الكمية غير متاحة' : 'Not enough stock'
                : isAr ? 'صرف للمريضة' : 'Give to patient'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
const AddDrugModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lang, addDrug, uploadDrugImage } = useClinic();
  const isAr = lang === 'ar';
  const [f, setF] = useState({ name: '', name_ar: '', category: '', unit_price: 0, stock_qty: 0, reorder_level: 5 });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const field =
    'w-full min-h-[44px] px-3.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-sm text-[#2C3137] dark:text-white focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15';
  const label = 'text-xs font-semibold text-[#2C3137] dark:text-slate-200 mb-1.5 block';

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const created = await addDrug({ ...f, unit_cost: 0, form: 'tab', strength: '', is_active: true });
    if (created && photo) {
      await uploadDrugImage(created.id, photo);
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-black text-[#2C3137] dark:text-white">{isAr ? 'إضافة دواء' : 'Add Drug'}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="w-11 h-11 rounded-lg text-[#7C7C7C] hover:text-rose-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Photo upload */}
        <div>
          <label className={label} htmlFor="dph">{isAr ? 'صورة الدواء' : 'Drug photo'}</label>
          <label
            htmlFor="dph"
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-[#C6D2E2] dark:border-[#6AB8FF]/25 hover:border-[#6AB8FF] cursor-pointer transition"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="" className="w-14 h-14 rounded-lg object-contain bg-white border border-[#C6D2E2] shrink-0" />
            ) : (
              <span className="w-14 h-14 rounded-lg bg-[#FCFDFF] dark:bg-[#22262B] flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5 text-[#7C7C7C]" aria-hidden="true" />
              </span>
            )}
            <span className="text-sm font-semibold text-[#2C3137] dark:text-white">
              {photo ? (isAr ? 'تغيير الصورة' : 'Change photo') : isAr ? 'اختر صورة' : 'Choose a photo'}
            </span>
          </label>
          <input id="dph" type="file" accept="image/*" capture="environment" className="hidden" onChange={pickPhoto} />
        </div>

        <div>
          <label className={label} htmlFor="dn">{isAr ? 'اسم الدواء' : 'Drug name'}</label>
          <input id="dn" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="dna">{isAr ? 'الاسم بالعربي' : 'Arabic name'}</label>
          <input id="dna" value={f.name_ar} onChange={e => setF({ ...f, name_ar: e.target.value })} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="dc">{isAr ? 'التصنيف' : 'Category'}</label>
          <input id="dc" value={f.category} onChange={e => setF({ ...f, category: e.target.value })} className={field} placeholder={isAr ? 'مثال: مضاد حيوي' : 'e.g. Antibiotic'} />
        </div>

        <div>
          <label className={label} htmlFor="dp">{isAr ? 'سعر البيع (ج.م)' : 'Selling price (EGP)'}</label>
          <input id="dp" type="number" min={0} value={f.unit_price} onChange={e => setF({ ...f, unit_price: Number(e.target.value) })} className={field} dir="ltr" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="dq">{isAr ? 'الكمية' : 'Quantity'}</label>
            <input id="dq" type="number" min={0} value={f.stock_qty} onChange={e => setF({ ...f, stock_qty: Number(e.target.value) })} className={field} dir="ltr" />
          </div>
          <div>
            <label className={label} htmlFor="dr">{isAr ? 'حد التنبيه' : 'Alert at'}</label>
            <input id="dr" type="number" min={0} value={f.reorder_level} onChange={e => setF({ ...f, reorder_level: Number(e.target.value) })} className={field} dir="ltr" />
            <p className="text-[11px] text-[#7C7C7C] mt-1">{isAr ? 'ينبهك عند هذه الكمية' : 'Warns at this level'}</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full min-h-[48px] rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] disabled:opacity-60 text-white font-bold text-sm shadow transition"
        >
          {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : isAr ? 'حفظ' : 'Save'}
        </button>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ */
const MovementModal: React.FC<{ drug: Drug; onClose: () => void }> = ({ drug, onClose }) => {
  const { lang, recordMovement } = useClinic();
  const isAr = lang === 'ar';
  const [type, setType] = useState<MovementType>('purchase');
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('');

  const adding = type === 'purchase' || type === 'return';
  const signed = adding ? Math.abs(qty) : -Math.abs(qty);
  const needsReason = type === 'loss' || type === 'adjustment';
  const after = drug.stock_qty + signed;

  const field =
    'w-full min-h-[44px] px-3.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-sm text-[#2C3137] dark:text-white focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recordMovement({
      drug_id: drug.id,
      movement_type: type,
      quantity: signed,
      unit_price: drug.unit_price,
      reason: reason || undefined,
      patient_id: null
    });
    onClose();
  };

  const options: { v: MovementType; label: string; hint: string }[] = [
    { v: 'purchase', label: isAr ? 'وصل جديد' : 'New delivery', hint: isAr ? 'زيادة' : 'adds' },
    { v: 'return', label: isAr ? 'مرتجع' : 'Returned', hint: isAr ? 'زيادة' : 'adds' },
    { v: 'loss', label: isAr ? 'تالف / مفقود' : 'Damaged / lost', hint: isAr ? 'نقص' : 'removes' },
    { v: 'adjustment', label: isAr ? 'تصحيح جرد' : 'Count correction', hint: isAr ? 'نقص' : 'removes' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <DrugImage drug={drug} size="thumb" />
            <div className="min-w-0">
              <h3 className="font-black text-[#2C3137] dark:text-white text-sm truncate">{drug.name}</h3>
              <p className="text-xs text-[#7C7C7C]" dir="ltr">
                {isAr ? 'الحالي' : 'Now'}: {drug.stock_qty}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="w-11 h-11 rounded-lg text-[#7C7C7C] hover:text-rose-500 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold text-[#2C3137] dark:text-slate-200 mb-2">
            {isAr ? 'ماذا حدث؟' : 'What happened?'}
          </legend>
          {options.map(o => (
            <button
              key={o.v}
              type="button"
              onClick={() => setType(o.v)}
              aria-pressed={type === o.v}
              className={`w-full min-h-[44px] text-start px-3.5 rounded-xl text-sm font-semibold border transition flex items-center justify-between ${
                type === o.v
                  ? 'border-[#6AB8FF] bg-[#6AB8FF]/10 text-[#2C3137] dark:text-white'
                  : 'border-[#C6D2E2] dark:border-white/10 text-[#7C7C7C] hover:border-[#6AB8FF]/50'
              }`}
            >
              <span>{o.label}</span>
              <span className={`text-xs font-bold ${o.hint === (isAr ? 'زيادة' : 'adds') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {o.hint === (isAr ? 'زيادة' : 'adds') ? '+' : '−'} {o.hint}
              </span>
            </button>
          ))}
        </fieldset>

        <div>
          <label className="text-xs font-semibold text-[#2C3137] dark:text-slate-200 mb-1.5 block" htmlFor="mq">
            {isAr ? 'الكمية' : 'Quantity'}
          </label>
          <input id="mq" type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} className={field} dir="ltr" />
        </div>

        {needsReason && (
          <div>
            <label className="text-xs font-semibold text-[#2C3137] dark:text-slate-200 mb-1.5 block" htmlFor="mr">
              {isAr ? 'السبب' : 'Reason'} <span className="text-rose-500">*</span>
            </label>
            <input
              id="mr"
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={isAr ? 'مثال: منتهي الصلاحية' : 'e.g. expired'}
              className={field}
              aria-describedby="mr-help"
            />
            <p id="mr-help" className="text-xs text-rose-500 mt-1.5">
              {isAr ? 'ستظهر هذه الكمية في تقرير الناقص.' : 'This will appear in the missing-stock report.'}
            </p>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] flex justify-between items-center">
          <span className="text-sm text-[#7C7C7C]">{isAr ? 'الكمية بعد التعديل' : 'New quantity'}</span>
          <span className={`text-xl font-mono font-black ${after < 0 ? 'text-rose-500' : 'text-[#6AB8FF]'}`} dir="ltr">
            {after}
          </span>
        </div>

        <button
          type="submit"
          disabled={after < 0}
          className="w-full min-h-[48px] rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] disabled:opacity-50 text-white font-bold text-sm shadow transition"
        >
          {after < 0 ? (isAr ? 'الكمية غير كافية' : 'Not enough stock') : isAr ? 'حفظ' : 'Save'}
        </button>
      </form>
    </div>
  );
};
