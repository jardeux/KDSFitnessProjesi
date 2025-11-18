import { useFitnessStore } from '../../state/useFitnessStore';

export default function WeeklyPlan() {
  const { workoutPlan, isProcessing } = useFitnessStore();

  if (isProcessing) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center text-slate-300">
        <p className="text-sm uppercase tracking-widest text-brand-400">Haftalık Plan</p>
        <p className="mt-2 font-display text-2xl text-white">Program hesaplanıyor...</p>
        <p className="mt-3 text-sm text-slate-400">
          ExerciseDB verileri yükleniyor ve günlere dağıtılıyor.
        </p>
      </section>
    );
  }

  if (!workoutPlan?.length) {
    return (
      <section className="rounded-3xl border border-dashed border-white/10 bg-slate-900/30 p-6 text-center text-slate-400">
        <p className="text-sm uppercase tracking-widest text-brand-400">Haftalık Plan</p>
        <p className="mt-2 font-display text-2xl text-white">Henüz plan oluşturulmadı</p>
        <p className="mt-3 text-sm">
          Formu doldurup Karar Motorunu çalıştırdığında günlere özel hareket listeleri burada
          görünecek.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-brand-400">Haftalık Antrenman</p>
          <h3 className="font-display text-3xl text-white">Planlanan gün sayısı: {workoutPlan.length}</h3>
        </div>
      </header>

      <div className="mt-6 space-y-4">
        {workoutPlan.map((session) => (
          <article
            key={session.day}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-inner"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{session.day}</p>
                <h4 className="text-xl font-semibold text-white">{session.focus}</h4>
              </div>
              <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1 text-xs font-semibold text-brand-200">
                {session.intensity} yoğunluk
              </span>
            </div>

            <ul className="mt-4 space-y-3">
              {session.exercises.map((exercise) => (
                <li
                  key={exercise.id}
                  className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    {exercise.gifUrl ? (
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        loading="lazy"
                        className="h-24 w-24 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-800 text-[10px] text-slate-400">
                        GIF bulunamadı
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-base font-semibold">{exercise.name}</p>
                        <p className="text-xs text-slate-300">
                          Hedef: {exercise.target} • Ekipman: {exercise.equipment}
                        </p>
                        {exercise.secondaryMuscles?.length ? (
                          <p className="mt-1 text-xs text-slate-400">
                            Yardımcı: {exercise.secondaryMuscles.join(', ')}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-slate-100">
                        <span className="rounded-full bg-brand-500/20 px-2 py-1">
                          Set: {exercise.sets}
                        </span>
                        <span className="rounded-full bg-brand-500/20 px-2 py-1">
                          Tekrar/Süre: {exercise.reps}
                        </span>
                        {exercise.tempo ? (
                          <span className="rounded-full bg-white/10 px-2 py-1">
                            Tempo: {exercise.tempo}
                          </span>
                        ) : null}
                      </div>

                      {exercise.notes ? (
                        <p className="text-xs text-slate-300">
                          {exercise.notes}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

