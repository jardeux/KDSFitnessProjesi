import { CRITERIA, useFitnessStore } from '../../state/useFitnessStore';

const experienceLevels = [
  { value: 'beginner', label: 'Başlangıç' },
  { value: 'intermediate', label: 'Orta Seviye' },
  { value: 'advanced', label: 'İleri Seviye' },
];

const splitOptions = [
  { value: 'ppl', label: 'PPL (Push/Pull/Legs)' },
  { value: 'upperLower', label: 'Upper / Lower' },
  { value: 'fullBody', label: 'Full Body' },
];

const numberFields = [
  { name: 'age', label: 'Yaş', placeholder: '28', min: 14, max: 80 },
  { name: 'weight', label: 'Kilo (kg)', placeholder: '72', min: 30, max: 200 },
  { name: 'height', label: 'Boy (cm)', placeholder: '175', min: 120, max: 230 },
];

export default function UserProfileForm() {
  const {
    profile,
    setProfile,
    criteriaRatings,
    setCriteriaRating,
    runDecisionEngine,
    errors,
    isProcessing,
  } = useFitnessStore();

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile({ [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runDecisionEngine();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-neon backdrop-blur-md"
    >
      <header>
        <p className="text-sm uppercase tracking-wide text-brand-400">Başlangıç</p>
        <h2 className="mt-1 font-display text-3xl text-white">Vücudunu ve hedeflerini tanımla</h2>
        <p className="mt-2 text-sm text-slate-300">
          Girdiğin veriler Karar Motoru&apos;na (AHP + Regresyon) aktarılır ve 12 haftalık planın
          kişiselleştirilir.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {numberFields.map(({ name, label, placeholder, min, max }) => (
          <label key={name} className="flex flex-col gap-2 text-sm font-medium text-slate-200">
            {label}
            <input
              type="number"
              name={name}
              min={min}
              max={max}
              value={profile[name]}
              placeholder={placeholder}
              onChange={handleProfileChange}
              className="rounded-xl border border-white/10 bg-slate-800/70 p-3 text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40"
            />
          </label>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
          Deneyim seviyesi
          <select
            name="experience"
            value={profile.experience}
            onChange={handleProfileChange}
            className="rounded-xl border border-white/10 bg-slate-800/70 p-3 text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40"
          >
            {experienceLevels.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-200 md:col-span-2">
          Haftalık antrenman günü
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              name="availability"
              value={profile.availability}
              onChange={handleProfileChange}
              className="w-full accent-brand-500"
            />
            <div className="mt-2 text-xl font-semibold text-brand-300">
              {profile.availability} gün
            </div>
          </div>
        </label>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-400">Önceliklendirme</p>
            <h3 className="font-display text-2xl text-white">Senin için en kritik kriter ne?</h3>
            <p className="text-sm text-slate-300">
              1-9 AHP ölçeğini kullan. Yüksek değerler kriterin daha önemli olduğunu ifade eder.
            </p>
          </div>
          <span className="rounded-full bg-brand-500/20 px-4 py-1 text-xs font-semibold text-brand-200">
            AHP girdisi
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {CRITERIA.map((criterion) => (
            <div
              key={criterion}
              className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Kriter</p>
                  <p className="text-lg font-semibold text-white">{criterion}</p>
                </div>
                <div className="text-3xl font-bold text-brand-300">
                  {criteriaRatings[criterion]}
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={9}
                step={1}
                value={criteriaRatings[criterion]}
                onChange={(event) => setCriteriaRating(criterion, Number(event.target.value))}
                className="mt-4 w-full accent-brand-500"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>Eşit ağırlık</span>
                <span>En yüksek öncelik</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {errors && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errors}
        </p>
      )}

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full rounded-2xl bg-brand-500 px-6 py-4 text-lg font-semibold uppercase tracking-wide text-white transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isProcessing ? 'Hesaplanıyor...' : 'Karar Motorunu Çalıştır'}
      </button>
    </form>
  );
}



