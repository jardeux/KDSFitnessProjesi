export default function DecisionResults({
  workoutPlan,
  isProcessing,
  planExplanation,
}) {
  if (isProcessing && !workoutPlan?.length) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center text-slate-300">
        <p className="text-sm uppercase tracking-widest text-brand-400">
          Plan Motoru
        </p>
        <h3 className="mt-2 font-display text-2xl text-white">
          Hesaplama devam ediyor...
        </h3>
        <p className="mt-4 text-sm text-slate-400">
          Egzersizler profiline göre sıralanıyor.
        </p>
      </section>
    );
  }

  if (!workoutPlan?.length) {
    return (
      <section className="rounded-3xl border border-dashed border-brand-500/40 bg-slate-900/40 p-6 text-center text-slate-300">
        <p className="text-sm uppercase tracking-widest text-brand-400">
          Plan Motoru
        </p>
        <h3 className="mt-2 font-display text-2xl text-white">
          Sonuçlara ulaşmak için formu doldur ve gönder
        </h3>
        <p className="mt-4 text-sm text-slate-400">
          Egzersiz optimizasyonu ve özet burada görünecek.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-neon">
      <header>
        <p className="text-sm uppercase tracking-widest text-brand-400">
          Önerilen Program
        </p>
        <h3 className="font-display text-3xl text-white">
          {workoutPlan.length} Günlük Plan
        </h3>
        <p className="text-sm text-slate-400">
          Gün başlıkları:{" "}
          <span className="text-brand-300">
            {workoutPlan.map((d) => d.day).join(" • ")}
          </span>
        </p>
      </header>

      <div className="grid gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-4 md:grid-cols-2">
        <div>
          <p>Plan açıklaması</p>
          <p className="text-sm text-slate-300">
            {planExplanation || "Program ayrıntıları hesaplandı."}
          </p>
        </div>
      </div>

      <div></div>
    </section>
  );
}
