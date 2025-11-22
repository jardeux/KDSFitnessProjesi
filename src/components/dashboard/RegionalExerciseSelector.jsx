import { useEffect, useMemo, useState } from 'react';
import { HYPERTROPHY_LIBRARY } from '../../data/hypertrophyLibrary';
import { useFitnessStore } from '../../state/useFitnessStore';

const REGION_DATA = [
  {
    id: 'chest',
    label: 'Göğüs',
    description: 'Pectoralis major/minor ve ön omuzları etkileyen itiş hareketleri.',
    color: '#f43f5e',
    shapes: [
      { type: 'rect', props: { x: 72, y: 118, width: 60, height: 38, rx: 18 } },
      { type: 'rect', props: { x: 272, y: 118, width: 60, height: 38, rx: 18 } },
    ],
  },
  {
    id: 'back',
    label: 'Sırt',
    description: 'Latissimus dorsi ve üst sırt için çekiş hareketleri.',
    color: '#22d3ee',
    shapes: [
      { type: 'rect', props: { x: 262, y: 120, width: 80, height: 60, rx: 20 } },
    ],
  },
  {
    id: 'shoulders',
    label: 'Omuz',
    description: 'Deltoid demetleri ve skapula stabilizatörleri.',
    color: '#a78bfa',
    shapes: [
      { type: 'rect', props: { x: 40, y: 102, width: 42, height: 26, rx: 12 } },
      { type: 'rect', props: { x: 122, y: 102, width: 42, height: 26, rx: 12 } },
      { type: 'rect', props: { x: 240, y: 102, width: 42, height: 26, rx: 12 } },
      { type: 'rect', props: { x: 322, y: 102, width: 42, height: 26, rx: 12 } },
    ],
  },
  {
    id: 'arms',
    label: 'Kollar',
    description: 'Biseps, triseps ve ön kol yardımcı kasları.',
    color: '#fb7185',
    shapes: [
      { type: 'rect', props: { x: 36, y: 128, width: 30, height: 70, rx: 14 } },
      { type: 'rect', props: { x: 140, y: 128, width: 30, height: 70, rx: 14 } },
      { type: 'rect', props: { x: 236, y: 128, width: 30, height: 70, rx: 14 } },
      { type: 'rect', props: { x: 340, y: 128, width: 30, height: 70, rx: 14 } },
    ],
  },
  {
    id: 'core',
    label: 'Çekirdek',
    description: 'Rektus abdominis ve oblikler için stabilizasyon egzersizleri.',
    color: '#34d399',
    shapes: [
      { type: 'rect', props: { x: 84, y: 162, width: 52, height: 56, rx: 20 } },
    ],
  },
  {
    id: 'glutes',
    label: 'Kalça',
    description: 'Kalça abdüksiyonu ve ekstansiyon hareketleri.',
    color: '#fbbf24',
    shapes: [
      { type: 'rect', props: { x: 80, y: 220, width: 60, height: 36, rx: 18 } },
      { type: 'rect', props: { x: 280, y: 220, width: 60, height: 36, rx: 18 } },
    ],
  },
  {
    id: 'legs',
    label: 'Bacak',
    description: 'Quadriceps, hamstring ve baldır hareketleri.',
    color: '#38bdf8',
    shapes: [
      { type: 'rect', props: { x: 70, y: 260, width: 34, height: 110, rx: 18 } },
      { type: 'rect', props: { x: 118, y: 260, width: 34, height: 110, rx: 18 } },
      { type: 'rect', props: { x: 270, y: 260, width: 34, height: 110, rx: 18 } },
      { type: 'rect', props: { x: 318, y: 260, width: 34, height: 110, rx: 18 } },
    ],
  },
];

const DEFAULT_SEQUENCE = REGION_DATA.map((region) => region.id);

const pillClasses =
  'rounded-full border border-slate-700 px-3 py-1 text-xs font-medium tracking-wide uppercase transition hover:border-brand-400 hover:text-brand-200';

const getRegionById = (regionId) => REGION_DATA.find((region) => region.id === regionId) ?? REGION_DATA[0];

const buildPlanLookup = (workoutPlan = []) => {
  const lookup = new Map();

  workoutPlan.forEach((day) => {
    day.exercises?.forEach((exercise) => {
      const key = exercise.target?.toLowerCase();
      if (!key) return;
      const list = lookup.get(key) || [];
      list.push({
        name: exercise.name,
        gifUrl: exercise.gifUrl,
        sets: exercise.sets,
        reps: exercise.reps,
        notes: exercise.notes,
        day: day.day,
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
      <svg
        viewBox="0 0 400 420"
        role="img"
        className="w-full max-w-md"
      >
        <defs>
          <linearGradient id="silhouette" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#020617" floodOpacity="0.8" />
          </filter>
        </defs>

        <g filter="url(#soft-shadow)">
          <circle cx="102" cy="60" r="32" fill="url(#silhouette)" />
          <rect x="72" y="92" width="60" height="80" rx="26" fill="url(#silhouette)" />
          <rect x="54" y="92" width="24" height="78" rx="12" fill="url(#silhouette)" />
          <rect x="132" y="92" width="24" height="78" rx="12" fill="url(#silhouette)" />
          <rect x="82" y="172" width="40" height="60" rx="20" fill="url(#silhouette)" />
          <rect x="68" y="232" width="28" height="90" rx="16" fill="url(#silhouette)" />
          <rect x="108" y="232" width="28" height="90" rx="16" fill="url(#silhouette)" />
        </g>

        <g filter="url(#soft-shadow)">
          <circle cx="302" cy="60" r="32" fill="url(#silhouette)" />
          <rect x="272" y="92" width="60" height="80" rx="26" fill="url(#silhouette)" />
          <rect x="254" y="92" width="24" height="78" rx="12" fill="url(#silhouette)" />
          <rect x="332" y="92" width="24" height="78" rx="12" fill="url(#silhouette)" />
          <rect x="282" y="172" width="40" height="60" rx="20" fill="url(#silhouette)" />
          <rect x="268" y="232" width="28" height="90" rx="16" fill="url(#silhouette)" />
          <rect x="308" y="232" width="28" height="90" rx="16" fill="url(#silhouette)" />
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
              className: 'cursor-pointer transition-all duration-200',
              onMouseEnter: () => setHoveredId(region.id),
              onMouseLeave: () => setHoveredId(null),
              onClick: () => onSelectRegion(region.id),
            };

            if (shape.type === 'rect') {
              return <rect {...shape.props} {...sharedProps} />;
            }

            return <path d={shape.d} {...sharedProps} />;
          }),
        )}
      </svg>

      <div className="mt-3 text-center text-sm text-slate-300">
        <p className="font-semibold text-white">{getRegionById(selectedRegion).label}</p>
        <p>{getRegionById(selectedRegion).description}</p>
      </div>
    </div>
  );
}

function ExercisePreview({ regionId, exercises, source, exerciseIndex, onNextExercise }) {
  if (!exercises.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-300">
        Bu bölge için kayıtlı hareket bulunamadı.
      </div>
    );
  }

  const activeExercise = exercises[exerciseIndex % exercises.length];
  const metaChips = [
    activeExercise.day ? `Gün: ${activeExercise.day}` : null,
    activeExercise.sets && activeExercise.reps ? `${activeExercise.sets} set × ${activeExercise.reps}` : null,
  ].filter(Boolean);

  const otherExercises = exercises.filter((exercise) => exercise.name !== activeExercise.name);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-400">
              {source === 'plan' ? 'AHP programı çıkışı' : 'Kütüphane önerisi'}
            </p>
            <h3 className="text-xl font-semibold text-white">{activeExercise.name}</h3>
            {metaChips.length ? (
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                {metaChips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/10 px-2 py-0.5">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-brand-200 transition hover:border-brand-400 hover:text-white"
            onClick={onNextExercise}
          >
            Sonraki
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg bg-black/60">
          <img
            src={activeExercise.gifUrl}
            alt={activeExercise.name}
            className="h-64 w-full object-cover"
            loading="lazy"
          />
        </div>

        {activeExercise.notes ? (
          <p className="mt-3 text-sm text-slate-300">{activeExercise.notes}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Bölgedeki diğer hareketler</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {otherExercises.length ? (
            otherExercises.map((exercise) => (
              <li key={`${regionId}-${exercise.name}`}>{exercise.name}</li>
            ))
          ) : (
            <li className="text-slate-500">Araştırılacak başka hareket yok.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default function RegionalExerciseSelector() {
  const { recommendation, programMeta, workoutPlan } = useFitnessStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(REGION_DATA[0].id);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const planLookup = useMemo(() => buildPlanLookup(workoutPlan), [workoutPlan]);

  const recommendedTargets = useMemo(() => {
    if (programMeta?.hypertrophyTargets?.length) {
      return programMeta.hypertrophyTargets;
    }
    return DEFAULT_SEQUENCE;
  }, [programMeta?.hypertrophyTargets]);

  const selectableRegions = useMemo(() => {
    const canonical = REGION_DATA.map((region) => region.id);
    const ordered = [...recommendedTargets, ...canonical];
    return ordered.filter((id, index) => ordered.indexOf(id) === index && canonical.includes(id));
  }, [recommendedTargets]);

  const exercisesForRegion = useMemo(() => {
    const regionKey = (selectedRegion || '').toLowerCase();
    const planMatches = planLookup.get(regionKey) || [];
    if (planMatches.length) {
      return { source: 'plan', items: planMatches };
    }
    const fallback = HYPERTROPHY_LIBRARY[regionKey] || [];
    return { source: 'library', items: fallback };
  }, [planLookup, selectedRegion]);

  useEffect(() => {
    if (recommendation) {
      if (!hasAutoOpened) {
        setIsOpen(true);
        setHasAutoOpened(true);
      }
    } else {
      setHasAutoOpened(false);
      setIsOpen(false);
    }
  }, [recommendation, hasAutoOpened]);

  useEffect(() => {
    if (!recommendedTargets.length) return;
    const priority = recommendedTargets.find((target) => selectableRegions.includes(target));
    if (priority) {
      setSelectedRegion((current) => (current === priority ? current : priority));
      setExerciseIndex(0);
    }
  }, [recommendedTargets, selectableRegions]);

  useEffect(() => {
    setExerciseIndex(0);
  }, [selectedRegion, exercisesForRegion.source, exercisesForRegion.items.length]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Kas atlası</p>
          <h2 className="text-2xl font-semibold text-white">AHP programına göre bölgesel hedef</h2>
          <p className="text-sm text-slate-300">
            {recommendation
              ? `${recommendation.name} programı ${programMeta?.hypertrophyTargets?.length || 0} kas grubunu önceliklendiriyor. Seç ve gifleri incele.`
              : 'Formu çalıştırdığında AHP sonucuna göre öncelikli kas grupları burada vurgulanacak.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="self-start rounded-full border border-brand-400 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-brand-100 transition hover:bg-brand-400/10"
        >
          {isOpen ? 'Paneli gizle' : 'Bölgesel'}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {selectableRegions.map((regionId) => (
          <button
            key={regionId}
            type="button"
            onClick={() => setSelectedRegion(regionId)}
            className={`${pillClasses} ${
              regionId === selectedRegion ? 'border-brand-400 text-brand-200' : 'text-slate-300'
            } ${recommendedTargets[0] === regionId ? 'bg-brand-500/10 text-brand-100' : ''}`}
          >
            {getRegionById(regionId).label}
          </button>
        ))}
      </div>

      {isOpen && (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <BodyMap selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
          <ExercisePreview
            regionId={selectedRegion}
            exercises={exercisesForRegion.items}
            source={exercisesForRegion.source}
            exerciseIndex={exerciseIndex}
            onNextExercise={() =>
              setExerciseIndex((prev) => {
                const length = exercisesForRegion.items.length || 1;
                return (prev + 1) % length;
              })
            }
          />
        </div>
      )}
    </section>
  );
}
