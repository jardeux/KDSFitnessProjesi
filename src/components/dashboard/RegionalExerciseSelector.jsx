import { useEffect, useMemo, useState } from "react";

const REGION_DATA = [
  {
    id: "chest",
    label: "Göğüs",
    description:
      "Pectoralis major/minor ve ön omuzları etkileyen itiş hareketleri.",
    color: "#f43f5e",
    shapes: [
      { type: "rect", props: { x: 72, y: 118, width: 60, height: 38, rx: 18 } },
      {
        type: "rect",
        props: { x: 272, y: 118, width: 60, height: 38, rx: 18 },
      },
    ],
  },
  {
    id: "back",
    label: "Sırt",
    description: "Latissimus dorsi ve üst sırt için çekiş hareketleri.",
    color: "#22d3ee",
    shapes: [
      {
        type: "rect",
        props: { x: 262, y: 120, width: 80, height: 60, rx: 20 },
      },
    ],
  },
  {
    id: "shoulders",
    label: "Omuz",
    description: "Deltoid demetleri ve skapula stabilizatörleri.",
    color: "#a78bfa",
    shapes: [
      { type: "rect", props: { x: 40, y: 102, width: 42, height: 26, rx: 12 } },
      {
        type: "rect",
        props: { x: 122, y: 102, width: 42, height: 26, rx: 12 },
      },
      {
        type: "rect",
        props: { x: 240, y: 102, width: 42, height: 26, rx: 12 },
      },
      {
        type: "rect",
        props: { x: 322, y: 102, width: 42, height: 26, rx: 12 },
      },
    ],
  },
  {
    id: "arms",
    label: "Kollar",
    description: "Biseps, triseps ve ön kol yardımcı kasları.",
    color: "#fb7185",
    shapes: [
      { type: "rect", props: { x: 36, y: 128, width: 30, height: 70, rx: 14 } },
      {
        type: "rect",
        props: { x: 140, y: 128, width: 30, height: 70, rx: 14 },
      },
      {
        type: "rect",
        props: { x: 236, y: 128, width: 30, height: 70, rx: 14 },
      },
      {
        type: "rect",
        props: { x: 340, y: 128, width: 30, height: 70, rx: 14 },
      },
    ],
  },
  {
    id: "core",
    label: "Çekirdek",
    description:
      "Rektus abdominis ve oblikler için stabilizasyon egzersizleri.",
    color: "#34d399",
    shapes: [
      { type: "rect", props: { x: 84, y: 162, width: 52, height: 56, rx: 20 } },
    ],
  },
  {
    id: "glutes",
    label: "Kalça",
    description: "Kalça abdüksiyonu ve ekstansiyon hareketleri.",
    color: "#fbbf24",
    shapes: [
      { type: "rect", props: { x: 80, y: 220, width: 60, height: 36, rx: 18 } },
      {
        type: "rect",
        props: { x: 280, y: 220, width: 60, height: 36, rx: 18 },
      },
    ],
  },
  {
    id: "legs",
    label: "Bacak",
    description: "Quadriceps, hamstring ve baldır hareketleri.",
    color: "#38bdf8",
    shapes: [
      {
        type: "rect",
        props: { x: 70, y: 260, width: 34, height: 110, rx: 18 },
      },
      {
        type: "rect",
        props: { x: 118, y: 260, width: 34, height: 110, rx: 18 },
      },
      {
        type: "rect",
        props: { x: 270, y: 260, width: 34, height: 110, rx: 18 },
      },
      {
        type: "rect",
        props: { x: 318, y: 260, width: 34, height: 110, rx: 18 },
      },
    ],
  },
];

const DEFAULT_SEQUENCE = REGION_DATA.map((region) => region.id);

const pillClasses =
  "rounded-full border border-slate-700 px-3 py-1 text-xs font-medium tracking-wide uppercase transition hover:border-brand-400 hover:text-brand-200";

const getRegionById = (regionId) =>
  REGION_DATA.find((region) => region.id === regionId) ?? REGION_DATA[0];

const buildPlanLookup = (workoutPlan = []) => {
  const lookup = new Map();

  workoutPlan.forEach((day) => {
    day.exercises?.forEach((exercise) => {
      // Hareketin hedef bölgesini bul
      let key = exercise.target?.toLowerCase();

      // Basit eşleştirme (target içinde region id geçiyor mu?)
      if (!key) return;

      // Mapping düzeltmeleri
      if (key.includes("pectoral") || key.includes("chest")) key = "chest";
      else if (key.includes("lat") || key.includes("back")) key = "back";
      else if (
        key.includes("leg") ||
        key.includes("quad") ||
        key.includes("hamstring") ||
        key.includes("calf")
      )
        key = "legs";
      else if (
        key.includes("bicep") ||
        key.includes("tricep") ||
        key.includes("arm")
      )
        key = "arms";
      else if (key.includes("delt") || key.includes("shoulder"))
        key = "shoulders";
      else if (
        key.includes("abs") ||
        key.includes("waist") ||
        key.includes("core")
      )
        key = "core";

      const list = lookup.get(key) || [];
      console.log(`Adding exercise: ${exercise.name}, gifUrl: ${exercise.gifUrl}`); // Debug
      list.push({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        day: day.day,
        gifUrl: exercise.gifUrl,
      });
      lookup.set(key, list);
    });
  });

  return lookup;
};

function BodyMap({ selectedRegion, onSelectRegion }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 400 420" role="img" className="w-full max-w-md">
        <defs>
          <linearGradient id="silhouette" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="12"
              floodColor="#020617"
              floodOpacity="0.8"
            />
          </filter>
        </defs>

        <g filter="url(#soft-shadow)">
          <circle cx="102" cy="60" r="32" fill="url(#silhouette)" />
          <rect
            x="72"
            y="92"
            width="60"
            height="80"
            rx="26"
            fill="url(#silhouette)"
          />
          <rect
            x="54"
            y="92"
            width="24"
            height="78"
            rx="12"
            fill="url(#silhouette)"
          />
          <rect
            x="132"
            y="92"
            width="24"
            height="78"
            rx="12"
            fill="url(#silhouette)"
          />
          <rect
            x="82"
            y="172"
            width="40"
            height="60"
            rx="20"
            fill="url(#silhouette)"
          />
          <rect
            x="68"
            y="232"
            width="28"
            height="90"
            rx="16"
            fill="url(#silhouette)"
          />
          <rect
            x="108"
            y="232"
            width="28"
            height="90"
            rx="16"
            fill="url(#silhouette)"
          />
        </g>

        <g filter="url(#soft-shadow)">
          <circle cx="302" cy="60" r="32" fill="url(#silhouette)" />
          <rect
            x="272"
            y="92"
            width="60"
            height="80"
            rx="26"
            fill="url(#silhouette)"
          />
          <rect
            x="254"
            y="92"
            width="24"
            height="78"
            rx="12"
            fill="url(#silhouette)"
          />
          <rect
            x="332"
            y="92"
            width="24"
            height="78"
            rx="12"
            fill="url(#silhouette)"
          />
          <rect
            x="282"
            y="172"
            width="40"
            height="60"
            rx="20"
            fill="url(#silhouette)"
          />
          <rect
            x="268"
            y="232"
            width="28"
            height="90"
            rx="16"
            fill="url(#silhouette)"
          />
          <rect
            x="308"
            y="232"
            width="28"
            height="90"
            rx="16"
            fill="url(#silhouette)"
          />
        </g>

        {REGION_DATA.map((region) =>
          region.shapes.map((shape, index) => {
            const isActive = region.id === selectedRegion;
            const isHovered = hoveredId === region.id;
            const sharedProps = {
              key: `${region.id}-${index}`,
              fill: region.color,
              fillOpacity: isActive || isHovered ? 0.9 : 0.35,
              stroke: region.color,
              strokeWidth: isActive ? 2 : 1,
              className: "cursor-pointer transition-all duration-200",
              onMouseEnter: () => setHoveredId(region.id),
              onMouseLeave: () => setHoveredId(null),
              onClick: () => onSelectRegion(region.id),
            };

            if (shape.type === "rect") {
              return <rect {...shape.props} {...sharedProps} />;
            }

            return <path d={shape.d} {...sharedProps} />;
          })
        )}
      </svg>

      <div className="mt-3 text-center text-sm text-slate-300">
        <p className="font-semibold text-white">
          {getRegionById(selectedRegion).label}
        </p>
        <p>{getRegionById(selectedRegion).description}</p>
      </div>
    </div>
  );
}

function ExercisePreview({ regionId, exercises, highlightedExercise }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  // Auto-open highlighted exercise
  useEffect(() => {
    if (highlightedExercise) {
      setSelectedExercise(exercises.find(ex => ex.name === highlightedExercise));
    }
  }, [highlightedExercise, exercises]);

  if (!exercises.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-300">
        Bu bölge için programda kayıtlı hareket bulunamadı.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-brand-400">
            Programdaki {getRegionById(regionId).label} Hareketleri
          </p>

          <ul className="space-y-3">
            {exercises.map((exercise, idx) => {
              console.log("Exercise data:", exercise); // Debug
              const isHighlighted = exercise.name === highlightedExercise;
              return (
              <li key={idx} className="space-y-2">
                <div
                  className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-brand-500/40 via-purple-500/40 to-brand-500/40 border-2 border-brand-400 animate-[pulse_0.8s_ease-in-out_infinite] shadow-lg shadow-brand-500/50'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                  onClick={() =>
                    setSelectedExercise(
                      selectedExercise?.name === exercise.name ? null : exercise
                    )
                  }
                >
                  <div>
                    <p className="font-medium text-white">{exercise.name}</p>
                    <p className="text-xs text-slate-400">{exercise.day}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="block text-brand-200">
                        {exercise.sets} Set
                      </span>
                      <span className="text-slate-500">{exercise.reps}</span>
                    </div>
                    <svg
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        selectedExercise?.name === exercise.name
                          ? "rotate-180"
                          : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {selectedExercise?.name === exercise.name && (
                  <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                    {exercise.gifUrl ? (
                      <>
                        <img
                          src={exercise.gifUrl}
                          alt={exercise.name}
                          className="h-auto w-full cursor-zoom-in rounded-md object-cover transition hover:opacity-90"
                          onClick={() => setImageModal({ url: exercise.gifUrl, name: exercise.name })}
                          onError={(e) => {
                            console.error("Image failed to load:", exercise.gifUrl);
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                          onLoad={() => {
                            console.log("Image loaded successfully:", exercise.gifUrl);
                          }}
                        />
                        <p className="hidden text-center text-sm text-slate-400">
                          Görsel yüklenemedi: {exercise.gifUrl}
                        </p>
                      </>
                    ) : (
                      <p className="text-center text-sm text-slate-400">
                        Bu hareket için görsel bulunamadı
                      </p>
                    )}
                  </div>
                )}
            </li>
            );
          })}
        </ul>
      </div>
    </div>

    {/* Image Modal */}
    {imageModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={() => setImageModal(null)}
      >
        <div className="relative max-h-[90vh] max-w-4xl">
          <button
            onClick={() => setImageModal(null)}
            className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-slate-900 shadow-lg transition hover:bg-slate-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={imageModal.url}
            alt={imageModal.name}
            className="max-h-[90vh] w-auto rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="mt-3 text-center text-sm text-white">
            {imageModal.name}
          </p>
        </div>
      </div>
    )}
  </>
  );
}

export default function RegionalExerciseSelector({ workoutPlan = [], selectedExercise, onExerciseProcessed }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(REGION_DATA[0].id);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [highlightedExercise, setHighlightedExercise] = useState(null);

  const planLookup = useMemo(() => buildPlanLookup(workoutPlan), [workoutPlan]);

  // Handle exercise selection from WeeklyPlan
  useEffect(() => {
    if (selectedExercise) {
      const target = selectedExercise.target?.toLowerCase() || '';
      let regionKey = null;

      // Map target to region
      if (target.includes('pectoral') || target.includes('chest')) regionKey = 'chest';
      else if (target.includes('lat') || target.includes('back')) regionKey = 'back';
      else if (target.includes('leg') || target.includes('quad') || target.includes('hamstring') || target.includes('calf')) regionKey = 'legs';
      else if (target.includes('bicep') || target.includes('tricep') || target.includes('arm')) regionKey = 'arms';
      else if (target.includes('delt') || target.includes('shoulder')) regionKey = 'shoulders';
      else if (target.includes('abs') || target.includes('waist') || target.includes('core')) regionKey = 'core';
      else if (target.includes('glute')) regionKey = 'glutes';

      if (regionKey) {
        setSelectedRegion(regionKey);
        setIsOpen(true);
        setHighlightedExercise(selectedExercise.name);
        
        // Auto-scroll to highlighted exercise after a brief delay
        setTimeout(() => {
          setHighlightedExercise(null);
          onExerciseProcessed?.();
        }, 5000);
      }
    }
  }, [selectedExercise, onExerciseProcessed]);

  useEffect(() => {
    if (workoutPlan.length) {
      if (!hasAutoOpened) {
        setIsOpen(true);
        setHasAutoOpened(true);
      }
    } else {
      setHasAutoOpened(false);
      setIsOpen(false);
    }
  }, [workoutPlan, hasAutoOpened]);

  const exercisesForRegion = planLookup.get(selectedRegion) || [];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-400">
            Kas atlası
          </p>
          <h2 className="text-2xl font-semibold text-white">Program Analizi</h2>
          <p className="text-sm text-slate-300">
            {workoutPlan.length
              ? `Vücut haritasından bir bölge seçerek programındaki ilgili hareketleri incele.`
              : "Plan oluşturduğunda program analizi burada görünecek."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="self-start rounded-full border border-brand-400 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-brand-100 transition hover:bg-brand-400/10"
        >
          {isOpen ? "Gizle" : "Atlası Aç"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {REGION_DATA.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => setSelectedRegion(region.id)}
            className={`${pillClasses} ${
              region.id === selectedRegion
                ? "border-brand-400 text-brand-200"
                : "text-slate-300"
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      {isOpen && (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <BodyMap
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
          <ExercisePreview
            regionId={selectedRegion}
            exercises={exercisesForRegion}
            highlightedExercise={highlightedExercise}
          />
        </div>
      )}
    </section>
  );
}
