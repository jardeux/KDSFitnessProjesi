import UserProfileForm from './components/forms/UserProfileForm';
import DecisionResults from './components/dashboard/DecisionResults';
import WeeklyPlan from './components/dashboard/WeeklyPlan';
import RegionalExerciseSelector from './components/dashboard/RegionalExerciseSelector';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:py-16">
        <header className="space-y-3 text-center lg:text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-400">Fitness DSS</p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            Karar destekli <span className="text-brand-400">antrenman planı</span> oluştur
          </h1>
          <p className="text-base text-slate-300 lg:max-w-2xl">
            Vücut verilerini ve hedef önceliklerini gir. AHP tabanlı Karar Motoru programları
            sıralasın, regresyon ise 12 haftalık ilerlemeyi projekte etsin.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <UserProfileForm />
          <div className="flex flex-col gap-6">
            <RegionalExerciseSelector />
            <DecisionResults />
            <WeeklyPlan />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;