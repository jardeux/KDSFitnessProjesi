const CRITERIA = ["Kas Kazanımı", "Yağ Kaybı", "Dayanıklılık"];

const experienceLevels = [
  { value: "beginner", label: "Başlangıç" },
  { value: "intermediate", label: "Orta Seviye" },
  { value: "advanced", label: "İleri Seviye" },
];

const numberFields = [
  { name: "age", label: "Yaş", placeholder: "28", min: 14, max: 80 },
  { name: "weight", label: "Kilo (kg)", placeholder: "72", min: 30, max: 200 },
  { name: "height", label: "Boy (cm)", placeholder: "175", min: 120, max: 230 },
];

export default function UserProfileForm({
  profile,
  onChange,
  onSubmit,
  isProcessing,
  errors,
}) {
  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    onChange?.({ [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-neon backdrop-blur-md"
    >
      <header>
        <p className="text-sm uppercase tracking-wide text-brand-400">
          Başlangıç
        </p>
        <h2 className="mt-1 font-display text-3xl text-white">
          Vücudunu ve hedeflerini tanımla
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Girdiğin veriler Karar Motoru'na (TOPSIS) aktarılır. Yaş, boy, kilo ve
          deneyim seviyene göre kriter ağırlıkları otomatik hesaplanır ve
          kişiselleştirilmiş antrenman planın oluşturulur.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {numberFields.map(({ name, label, placeholder, min, max }) => (
          <label
            key={name}
            className="flex flex-col gap-2 text-sm font-medium text-slate-200"
          >
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
              min={2}
              max={6}
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-400">
              Önceliklendirme
            </p>
            <h3 className="font-display text-2xl text-white">
              Ana hedefin nedir?
            </h3>
            <p className="text-sm text-slate-300">
              Seçimine göre Karar Motoru kriter ağırlıklarını otomatik
              hesaplayacaktır.
            </p>
          </div>
          <span className="rounded-full bg-brand-500/20 px-4 py-1 text-xs font-semibold text-brand-200">
            TOPSIS
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 shadow-inner">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
            Hedef Seçimi
            <select
              value={profile.selectedGoal || CRITERIA[0]}
              onChange={(e) =>
                onChange?.({ selectedGoal: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900 p-4 text-lg text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40"
            >
              {CRITERIA.map((criterion) => (
                <option key={criterion} value={criterion}>
                  {criterion}
                </option>
              ))}
            </select>
          </label>
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
        {isProcessing ? "Hesaplanıyor..." : "Karar Motorunu Çalıştır"}
      </button>
    </form>
  );
}
