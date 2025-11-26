import { useState } from "react";
import UserProfileForm from "./components/forms/UserProfileForm";
import DecisionResults from "./components/dashboard/DecisionResults";
import WeeklyPlan from "./components/dashboard/WeeklyPlan";
import RegionalExerciseSelector from "./components/dashboard/RegionalExerciseSelector";
import {
  buildTopsisWorkoutProgram,
  fetchAllExercises,
} from "./services/exerciseService";

function App() {
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    height: "",
    experience: "beginner",
    availability: 3,
    selectedGoal: "Kas Kazanımı",
  });
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [planExplanation, setPlanExplanation] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleProfileChange = (updates) =>
    setProfile((prev) => ({ ...prev, ...updates }));

  const runPlanner = async () => {
    setIsProcessing(true);
    setErrors(null);
    try {
      const exercises = await fetchAllExercises();
      const { days, explanation } = buildTopsisWorkoutProgram({
        exercises,
        profile,
        availability: profile.availability,
      });
      setWorkoutPlan(days || []);
      setPlanExplanation(explanation || "");
    } catch (error) {
      console.error("Plan oluşturma hatası:", error);
      setErrors("Plan oluşturulamadı, lütfen tekrar deneyin.");
      setWorkoutPlan([]);
      setPlanExplanation("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:py-16">
        <header className="space-y-3 text-center lg:text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-400">
            Fitness DSS
          </p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            Karar destekli{" "}
            <span className="text-brand-400">antrenman planı</span> oluştur
          </h1>
          <p className="text-base text-slate-300 lg:max-w-2xl">
            Vücut verilerini ve hedef önceliklerini gir. AHP tabanlı Karar
            Motoru programları sıralasın, regresyon ise 12 haftalık ilerlemeyi
            projekte etsin.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <UserProfileForm
            profile={profile}
            onChange={handleProfileChange}
            onSubmit={runPlanner}
            isProcessing={isProcessing}
            errors={errors}
          />
          <div className="flex flex-col gap-6">
            <RegionalExerciseSelector workoutPlan={workoutPlan} />
            <DecisionResults
              workoutPlan={workoutPlan}
              isProcessing={isProcessing}
              planExplanation={planExplanation}
            />
            <WeeklyPlan
              workoutPlan={workoutPlan}
              planExplanation={planExplanation}
              isProcessing={isProcessing}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
