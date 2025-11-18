import { useMemo } from 'react';
import { useFitnessStore, CRITERIA } from '../../state/useFitnessStore';

const formatPercent = (value = 0) => `${(value * 100).toFixed(1)}%`;

export default function DecisionResults() {
  const { recommendation, ahpResult, regressionResult, programMeta, isProcessing } = useFitnessStore();

  const regressionSummary = useMemo(() => {
    if (!regressionResult?.projection?.length) return null;
    const first = regressionResult.projection[0];
    const last = regressionResult.projection[regressionResult.projection.length - 1];

    return {
      start: first.value,
      end: last.value,
      delta: Number((last.value - first.value).toFixed(2)),
    };
  }, [regressionResult]);

  if (isProcessing && !recommendation) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center text-slate-300">
        <p className="text-sm uppercase tracking-widest text-brand-400">Karar Motoru</p>
        <h3 className="mt-2 font-display text-2xl text-white">Hesaplama devam ediyor...</h3>
        <p className="mt-4 text-sm text-slate-400">AHP ağırlıkları ve regresyon çalıştırılıyor.</p>
      </section>
    );
  }

  if (!recommendation) {
    return (
      <section className="rounded-3xl border border-dashed border-brand-500/40 bg-slate-900/40 p-6 text-center text-slate-300">
        <p className="text-sm uppercase tracking-widest text-brand-400">Karar Motoru</p>
        <h3 className="mt-2 font-display text-2xl text-white">
          Sonuçlara ulaşmak için formu doldur ve gönder
        </h3>
        <p className="mt-4 text-sm text-slate-400">
          AHP kriter ağırlıkları ve regresyon tahmini burada görüntülenecek.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-neon">
      <header>
        <p className="text-sm uppercase tracking-widest text-brand-400">Önerilen Program</p>
        <h3 className="font-display text-3xl text-white">{recommendation.name}</h3>
        <p className="text-sm text-slate-400">
          Toplam skor: <span className="text-brand-300">{recommendation.score?.toFixed(3)}</span>
        </p>
        {programMeta ? (
          <p className="mt-1 text-xs text-slate-500">
            Split: <span className="text-brand-200">{programMeta.split || 'Çoklu'}</span> • Filtre:{' '}
            <span className="text-brand-200">{programMeta.filter}</span>
          </p>
        ) : null}
      </header>

      <div className="grid gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">AHP Tutarlılık</p>
          <p className="text-2xl font-semibold text-white">
            {ahpResult?.consistencyRatio ? `${(ahpResult.consistencyRatio * 100).toFixed(1)}%` : '—'}
          </p>
          <p className="text-xs text-slate-400">0.1 altında olması önerilir.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Regresyon Delta</p>
          <p className="text-2xl font-semibold text-white">
            {regressionSummary ? `${regressionSummary.delta > 0 ? '+' : ''}${regressionSummary.delta} kg` : '—'}
          </p>
          <p className="text-xs text-slate-400">
            12 haftalık projeksiyon ({regressionSummary?.start} ➜ {regressionSummary?.end} kg)
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm uppercase tracking-wide text-brand-400">Kriter Ağırlıkları</p>
          <span className="text-xs text-slate-500">Toplam = 100%</span>
        </div>
        <div className="mt-3 space-y-2">
          {ahpResult?.weights?.map((weight, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-2"
            >
              <span className="text-sm text-slate-200">{CRITERIA[index]}</span>
              <span className="text-lg font-semibold text-brand-300">{formatPercent(weight)}</span>
            </div>
          ))}
        </div>
      </div>

      {ahpResult?.ranking?.length ? (
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-400">Program Sıralaması</p>
          <ul className="mt-3 space-y-2">
            {ahpResult.ranking.map((alt) => (
              <li
                key={alt.name}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-white"
              >
                <span>{alt.name}</span>
                <span className="font-semibold text-brand-200">{alt.score}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

