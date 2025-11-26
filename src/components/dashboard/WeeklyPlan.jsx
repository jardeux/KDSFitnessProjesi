export default function WeeklyPlan({
  workoutPlan,
  planExplanation,
  isProcessing,
}) {
  if (isProcessing) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center text-slate-300">
        <p className="text-sm uppercase tracking-widest text-brand-400">
          Haftalık Plan
        </p>
        <p className="mt-2 font-display text-2xl text-white">
          Program hesaplanıyor...
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Egzersiz verileri günlere dağıtılıyor.
        </p>
      </section>
    );
  }

  if (!workoutPlan?.length) {
    return (
      <section className="rounded-3xl border border-dashed border-white/10 bg-slate-900/30 p-6 text-center text-slate-400">
        <p className="text-sm uppercase tracking-widest text-brand-400">
          Haftalık Plan
        </p>
        <p className="mt-2 font-display text-2xl text-white">
          Henüz plan oluşturulmadı
        </p>
        <p className="mt-3 text-sm">
          Formu doldurup Karar Motorunu çalıştırdığında günlere özel hareket
          listeleri burada görünecek.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-brand-400">
              Haftalık Antrenman
            </p>
            <h3 className="font-display text-3xl text-white">
              Planlanan gün sayısı: {workoutPlan.length}
            </h3>
          </div>
        </header>

        {planExplanation ? (
          <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-50 shadow-inner">
            <p className="mb-1 text-xs uppercase tracking-wide text-brand-200/80">
              Neden bu plan?
            </p>
            <p className="text-slate-200 leading-relaxed">{planExplanation}</p>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {workoutPlan.map((session) => (
            <article
              key={session.day}
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-inner"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4 border-b border-white/5 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {session.day}
                  </p>
                  <h4 className="text-xl font-semibold text-white">
                    {session.focus}
                  </h4>
                </div>
                <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1 text-xs font-semibold text-brand-200">
                  {session.intensity} yoğunluk
                </span>
              </div>

              <ul className="space-y-2">
                {session.exercises.map((exercise, index) => (
                  <li
                    key={exercise.id}
                    className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-base font-semibold text-slate-100">
                          {exercise.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Hedef: {exercise.target}{" "}
                          {exercise.secondaryMuscles?.length > 0 &&
                            `• Yardımcı: ${exercise.secondaryMuscles.join(
                              ", "
                            )}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 pl-9 sm:pl-0">
                      <span className="rounded bg-brand-500/20 px-2 py-1 text-xs font-medium text-brand-100">
                        {exercise.sets} Set
                      </span>
                      <span className="rounded bg-slate-700/50 px-2 py-1 text-xs text-slate-300">
                        {exercise.reps}
                      </span>
                      {exercise.tempo && (
                        <span className="hidden rounded bg-slate-800 px-2 py-1 text-xs text-slate-500 sm:inline-block">
                          Tempo: {exercise.tempo}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
