// ============================================================
// Veronica Method PERSONALIZED PROGRAM ENGINE
// Builds unique daily plans based on quiz data, symptoms,
// goals, fitness level, and program phase.
// ============================================================

export type Exercise = {
  name: string;
  image: string;
  start: string;
  end: string;
  why: string;
  reps: string;
  seconds: number;
  category: ExerciseCategory;
  intensity: 1 | 2 | 3; // 1=gentle, 2=moderate, 3=challenging
};

export type ExerciseCategory =
  | "warmup"
  | "cooldown"
  | "core"
  | "lower"
  | "upper"
  | "mobility"
  | "balance"
  | "breathing"
  | "pelvic"
  | "posture";

export type ProgramPhase = "foundation" | "build" | "strengthen" | "master";

export type DayPlan = {
  day: number;
  title: string;
  theme: string;
  description: string;
  phase: ProgramPhase;
  focusAreas: string[];
  exercises: Exercise[];
  totalMinutes: number;
};

export type UserProfile = {
  symptoms: string[];
  severity: Record<string, number>;
  goal: string;
  activity: string;
  age: number;
  time: string;
  sleep: number;
  confidence: number;
};

const img = (file: string) => `/exercises/${file}`;

// ============================================================
// EXERCISE LIBRARY - Organized by category and intensity
// ============================================================

const EXERCISES: Exercise[] = [
  // --- WARM-UP (8 exercises, progressive) ---
  {
    name: "Gentle March in Place",
    image: img("march.jpg"),
    start: "Stand tall, arms relaxed by your sides.",
    end: "Lift knees alternately in a gentle rhythm, swinging arms naturally.",
    why: "Warms up the body, increases blood flow and prepares joints for movement.",
    reps: "2 min", seconds: 120,
    category: "warmup", intensity: 1,
  },
  {
    name: "Ankle & Wrist Circles",
    image: img("ankle.jpg"),
    start: "Stand with support or sit comfortably.",
    end: "Rotate each ankle and wrist 10 times in each direction.",
    why: "Lubricates synovial joints, distributes synovial fluid to reduce morning stiffness.",
    reps: "1 min", seconds: 60,
    category: "warmup", intensity: 1,
  },
  {
    name: "Walking Warm-Up",
    image: img("walk.jpg"),
    start: "Stand tall with good posture.",
    end: "Walk in place with exaggerated arm swings, gradually increasing pace.",
    why: "Elevates heart rate gently and activates full-body circulation.",
    reps: "2 min", seconds: 120,
    category: "warmup", intensity: 1,
  },
  {
    name: "Arm Circles Progressive",
    image: img("shoulder.jpg"),
    start: "Stand tall, arms extended to sides at shoulder height.",
    end: "Small circles forward 15 sec, backward 15 sec. Then medium circles 15 sec each. Then large circles 15 sec each.",
    why: "Progressively warms rotator cuff and shoulder joint through full range of motion. Prevents impingement during upper body work.",
    reps: "90 sec total", seconds: 90,
    category: "warmup", intensity: 1,
  },
  {
    name: "Lateral Leg Swings",
    image: img("hip.jpg"),
    start: "Stand sideways to wall, one hand on wall for support.",
    end: "Swing outside leg forward and back like a pendulum, 10 times. Then side to side 10 times. Switch legs.",
    why: "Dynamically warms hip joint through sagittal and frontal planes. Activates hip flexors, glutes and adductors for lower body work.",
    reps: "20 each leg", seconds: 120,
    category: "warmup", intensity: 2,
  },
  {
    name: "Torso Rotation with Reach",
    image: img("twist.jpg"),
    start: "Stand with feet shoulder-width, arms at chest height.",
    end: "Rotate torso to right, extending right arm back. Return to center. Alternate sides with increasing range.",
    why: "Warms thoracic spine, activates obliques and prepares core for rotational movements. Improves spinal mobility.",
    reps: "10 each side", seconds: 90,
    category: "warmup", intensity: 2,
  },
  {
    name: "Squat to Stand",
    image: img("squat.jpg"),
    start: "Stand with feet hip-width. Bend forward, touch toes (or shins).",
    end: "Bend knees into deep squat, chest up. Then straighten legs keeping hands down. Repeat flow.",
    why: "Dynamic hamstring and hip warm-up that prepares the entire posterior chain. Combines mobility with gentle activation.",
    reps: "8 reps", seconds: 90,
    category: "warmup", intensity: 2,
  },
  {
    name: "Inchworm Walk-Out",
    image: img("inchworm.jpg"),
    start: "Stand tall. Fold forward, hands to floor (bend knees if needed).",
    end: "Walk hands out to plank position. Hold 2 sec. Walk hands back to feet. Stand up. Repeat.",
    why: "Full-body dynamic warm-up that activates core, shoulders, hamstrings and wrists simultaneously. Excellent preparation for any workout.",
    reps: "5 reps", seconds: 120,
    category: "warmup", intensity: 3,
  },

  // --- BREATHING & NERVOUS SYSTEM (8 exercises, progressive) ---
  {
    name: "Diaphragmatic Breathing",
    image: img("breathing.jpg"),
    start: "Sit or lie comfortably, one hand on chest, one on belly.",
    end: "Breathe deeply into belly for 4 counts, hold 4, exhale 6. Repeat.",
    why: "Activates parasympathetic nervous system, reduces cortisol by up to 25%. Primary intervention for hot flash management per EMAS guidelines.",
    reps: "3 min", seconds: 180,
    category: "breathing", intensity: 1,
  },
  {
    name: "Box Breathing Reset",
    image: img("boxbreathing.jpg"),
    start: "Sit tall with eyes closed.",
    end: "Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 6 cycles.",
    why: "Used by Navy SEALs for stress management. Balances autonomic nervous system, reduces anxiety and improves heart rate variability.",
    reps: "2 min", seconds: 120,
    category: "breathing", intensity: 1,
  },
  {
    name: "Evening Wind-Down Breath",
    image: img("winddown.jpg"),
    start: "Lie on back, knees bent, arms relaxed.",
    end: "Long exhales (twice the length of inhales) for 3 minutes. Inhale 3, exhale 6.",
    why: "Extended exhales activate vagus nerve, lowering heart rate and preparing body for deep sleep. Reduces night sweats and restlessness.",
    reps: "3 min", seconds: 180,
    category: "breathing", intensity: 1,
  },
  {
    name: "4-7-8 Sleep Breath",
    image: img("478-breath.jpg"),
    start: "Lie in bed or sit comfortably. Tongue tip behind upper front teeth.",
    end: "Inhale through nose 4 counts. Hold breath 7 counts. Exhale through mouth with whoosh sound 8 counts. Repeat 4 cycles.",
    why: "Developed by Dr. Andrew Weil. Acts as natural tranquilizer for the nervous system. Particularly effective for menopausal insomnia.",
    reps: "4 cycles", seconds: 120,
    category: "breathing", intensity: 1,
  },
  {
    name: "Alternate Nostril Breathing (Nadi Shodhana)",
    image: img("alternate-nostril.jpg"),
    start: "Sit tall. Right thumb closes right nostril, ring finger will close left.",
    end: "Inhale left nostril 4 counts. Close both, hold 4. Exhale right 4. Inhale right 4. Close both, hold 4. Exhale left 4. That's one cycle.",
    why: "Balances left and right brain hemispheres. Research shows it reduces blood pressure, heart rate and perceived stress. Excellent for mood swings.",
    reps: "6 cycles", seconds: 180,
    category: "breathing", intensity: 2,
  },
  {
    name: "Cooling Breath (Sitali Pranayama)",
    image: img("cooling-breath.jpg"),
    start: "Sit comfortably. Curl tongue into a tube (or purse lips if you can't curl tongue).",
    end: "Inhale slowly through curled tongue — feel cool air. Close mouth, exhale through nose. Repeat 10 times.",
    why: "Physically cools the body by 1-2°C. Specifically recommended for hot flash relief in integrative medicine. Immediate symptom reduction.",
    reps: "10 breaths", seconds: 120,
    category: "breathing", intensity: 1,
  },
  {
    name: "Resonance Breathing (Coherent Breathing)",
    image: img("resonance-breath.jpg"),
    start: "Sit or lie comfortably. Set a timer or count internally.",
    end: "Breathe at exactly 5 breaths per minute: inhale 6 seconds, exhale 6 seconds. No pauses. Smooth and continuous.",
    why: "5 breaths/min creates 'coherence' — optimal heart rate variability. Clinically shown to reduce anxiety, improve sleep and balance hormones over 4 weeks of practice.",
    reps: "5 min", seconds: 300,
    category: "breathing", intensity: 2,
  },
  {
    name: "Lion's Breath (Simhasana)",
    image: img("lions-breath.jpg"),
    start: "Kneel or sit. Inhale deeply through nose.",
    end: "Open mouth wide, stick tongue out toward chin, exhale forcefully with 'HAAA' sound. Eyes wide. Repeat 5 times.",
    why: "Releases jaw tension (common in menopause), stretches facial muscles, and provides emotional release. Activates throat chakra and reduces tension headaches.",
    reps: "5 breaths", seconds: 60,
    category: "breathing", intensity: 2,
  },

  // --- CORE ---
  {
    name: "Bridge Lift",
    image: img("bridge.jpg"),
    start: "Lie on back, knees bent, feet flat hip-width apart.",
    end: "Press through heels, lift hips until body forms a line. Squeeze glutes at top, hold 3 sec.",
    why: "Strengthens glutes and pelvic floor, supports lower back and improves posture.",
    reps: "12 reps", seconds: 120,
    category: "core", intensity: 1,
  },
  {
    name: "Single-Leg Bridge",
    image: img("singlebridg.jpg"),
    start: "Lie on back, one leg extended toward ceiling.",
    end: "Lift hips pressing through grounded foot. Hold 2 sec at top.",
    why: "Advanced glute and core activation, corrects muscle imbalances.",
    reps: "8 each side", seconds: 120,
    category: "core", intensity: 3,
  },
  {
    name: "Dead Bug Hold",
    image: img("deadbug.jpg"),
    start: "Lie on back, arms up, knees at 90°.",
    end: "Slowly extend opposite arm and leg while keeping lower back pressed to floor.",
    why: "Deep core stabilization without straining the neck or back.",
    reps: "10 reps", seconds: 120,
    category: "core", intensity: 2,
  },
  {
    name: "Bird-Dog",
    image: img("birddog.jpg"),
    start: "Get onto all fours, hands under shoulders, knees under hips. Keep back flat.",
    end: "Simultaneously extend the opposite arm and leg until they are parallel with the body, keeping core tight.",
    why: "Strengthens core muscles (abs and lower back), glutes, and improves balance.",
    reps: "12 each side", seconds: 120,
    category: "core", intensity: 2,
  },

  // --- LOWER BODY ---
  {
    name: "Chair Squat",
    image: img("chairsquat.jpg"),
    start: "Stand in front of a sturdy chair, feet hip-width.",
    end: "Lower hips back until you lightly touch the chair, then stand. Keep chest lifted.",
    why: "Builds functional leg strength safely, supports bone density.",
    reps: "12 reps", seconds: 120,
    category: "lower", intensity: 1,
  },
  {
    name: "Bodyweight Squat",
    image: img("bodyweight-squat.jpg"),
    start: "Stand with feet shoulder-width, toes slightly out.",
    end: "Lower until thighs are parallel, drive through heels to stand.",
    why: "Full lower body strengthening, boosts metabolism and bone health.",
    reps: "15 reps", seconds: 120,
    category: "lower", intensity: 2,
  },
  {
    name: "Sumo Squat Pulse",
    image: img("sumosquat.jpg"),
    start: "Wide stance, toes pointed out 45°.",
    end: "Lower into deep squat, pulse 3 times at bottom, then stand.",
    why: "Targets inner thighs and glutes, improves hip mobility.",
    reps: "10 reps", seconds: 120,
    category: "lower", intensity: 3,
  },
  {
    name: "Standing Calf Raise",
    image: img("calfraise.jpg"),
    start: "Stand near wall for balance, feet hip-width.",
    end: "Rise onto toes slowly (3 sec up), hold at top, lower slowly (3 sec down).",
    why: "Improves circulation in legs, reduces swelling and supports ankle stability.",
    reps: "15 reps", seconds: 90,
    category: "lower", intensity: 1,
  },

  // --- UPPER BODY ---
  {
    name: "Wall Push-Up",
    image: img("pushup.jpg"),
    start: "Stand arm's length from wall, hands at shoulder height.",
    end: "Bend elbows to bring chest toward wall, push back. Keep body straight.",
    why: "Builds upper body strength without floor strain, supports bone density in wrists.",
    reps: "12 reps", seconds: 90,
    category: "upper", intensity: 1,
  },
  {
    name: "Incline Push-Up",
    image: img("incline-pushup.jpg"),
    start: "Hands on sturdy counter or bench, body in plank line.",
    end: "Lower chest toward surface, push back up with control.",
    why: "Progressive upper body strength, prepares for full push-ups.",
    reps: "10 reps", seconds: 90,
    category: "upper", intensity: 2,
  },
  {
    name: "Power Pose Hold",
    image: img("power.jpg"),
    start: "Stand with feet wide, arms raised in a V shape.",
    end: "Hold strong stance for 30 seconds. Breathe deeply and feel grounded.",
    why: "Builds shoulder endurance, boosts confidence through posture.",
    reps: "3 × 30 sec", seconds: 120,
    category: "upper", intensity: 1,
  },

  // --- MOBILITY ---
  {
    name: "Cat-Cow Flow",
    image: img("catcow.jpg"),
    start: "Hands and knees, wrists under shoulders, knees under hips.",
    end: "Inhale: arch spine, lift chest (cow). Exhale: round spine, tuck chin (cat).",
    why: "Restores spinal mobility, relieves morning stiffness and back tension.",
    reps: "10 cycles", seconds: 120,
    category: "mobility", intensity: 1,
  },
  {
    name: "Hip Opener Stretch",
    image: img("hip-opener.jpg"),
    start: "Stand or kneel with one foot forward in a lunge position.",
    end: "Gently press hips forward, feeling stretch in hip flexor. Hold each side.",
    why: "Releases tight hip flexors from sitting, reduces lower back pain.",
    reps: "30 sec each", seconds: 120,
    category: "mobility", intensity: 1,
  },
  {
    name: "Standing Twist",
    image: img("standing-twist.jpg"),
    start: "Stand with feet hip-width, arms at shoulder height.",
    end: "Rotate torso left and right with control, keeping hips stable.",
    why: "Gentle twists and deep breathing may help ease abdominal tension and promote comfort.",
    reps: "20 reps", seconds: 90,
    category: "mobility", intensity: 1,
  },
  {
    name: "Neck Release Sequence",
    image: img("neck.jpg"),
    start: "Sit or stand tall, shoulders relaxed.",
    end: "Tilt ear to shoulder (hold 15s each side), then chin to chest (hold 15s).",
    why: "Relieves tension headaches, reduces neck stiffness from desk work.",
    reps: "3 positions", seconds: 90,
    category: "mobility", intensity: 1,
  },
  {
    name: "Shoulder Roll & Open",
    image: img("shoulder.jpg"),
    start: "Stand tall, arms by sides.",
    end: "Roll shoulders back 10 times, then clasp hands behind back and open chest.",
    why: "Counteracts forward posture, opens chest for better breathing.",
    reps: "2 min", seconds: 120,
    category: "mobility", intensity: 1,
  },

  // --- BALANCE ---
  {
    name: "Single-Leg Stand",
    image: img("singleleg.jpg"),
    start: "Stand near wall for safety, shift weight to one foot.",
    end: "Lift other foot off ground, hold 20-30 seconds. Switch sides.",
    why: "Improves balance and proprioception, reduces fall risk.",
    reps: "30 sec each", seconds: 90,
    category: "balance", intensity: 1,
  },
  {
    name: "Heel-to-Toe Walk",
    image: img("heeltoe.jpg"),
    start: "Stand at one end of room.",
    end: "Walk in a straight line placing heel directly in front of toes each step.",
    why: "Trains balance and coordination, strengthens stabilizer muscles.",
    reps: "2 lengths", seconds: 90,
    category: "balance", intensity: 2,
  },

  // --- PELVIC FLOOR ---
  {
    name: "Pelvic Floor Activation",
    image: img("pelvicfloor.jpg"),
    start: "Sit or lie comfortably with neutral spine.",
    end: "Gently contract pelvic floor (as if stopping urine flow), hold 5 sec, release. Repeat.",
    why: "Strengthens pelvic floor muscles weakened by hormonal changes.",
    reps: "10 reps", seconds: 120,
    category: "pelvic", intensity: 1,
  },
  {
    name: "Bridge with Pelvic Squeeze",
    image: img("pelvicsqueeze.jpg"),
    start: "Lie on back, knees bent, small ball or pillow between knees.",
    end: "Lift hips while squeezing knees together. Hold 5 sec at top.",
    why: "Combines glute strength with pelvic floor engagement for maximum benefit.",
    reps: "10 reps", seconds: 120,
    category: "pelvic", intensity: 2,
  },
  {
    name: "Slow Kegel Hold (Endurance)",
    image: img("kegel-slow.jpg"),
    start: "Sit on firm chair, feet flat. Imagine lifting a marble with your pelvic floor.",
    end: "Contract pelvic floor gently, hold 10 seconds, release fully for 10 seconds. Repeat 10 times.",
    why: "Builds slow-twitch muscle endurance critical for organ support. Research shows 10-second holds are more effective than quick contractions for prolapse management.",
    reps: "10 × 10 sec holds", seconds: 180,
    category: "pelvic", intensity: 1,
  },
  {
    name: "Quick Flick Kegels (Power)",
    image: img("kegel-quick.jpg"),
    start: "Sit or stand comfortably with neutral spine.",
    end: "Contract pelvic floor quickly and firmly for 1 second, release fully. Repeat rapidly 10 times, rest 10 sec, do 3 sets.",
    why: "Trains fast-twitch fibers that prevent leakage during coughing, sneezing, or laughing. Essential for stress urinary incontinence.",
    reps: "3 × 10 quick", seconds: 120,
    category: "pelvic", intensity: 2,
  },
  {
    name: "Hypopressive Breathing",
    image: img("hypopressive.jpg"),
    start: "Stand with slight forward lean, hands on thighs. Exhale completely.",
    end: "After full exhale, close mouth and nose, expand ribcage as if inhaling (but don't). Hold 5-10 sec. Release and breathe normally.",
    why: "Creates negative pressure that lifts pelvic organs. Clinically proven to reduce prolapse symptoms and improve pelvic floor activation by up to 40%.",
    reps: "5 reps", seconds: 150,
    category: "pelvic", intensity: 2,
  },
  {
    name: "Knack Technique (Brace Before Cough)",
    image: img("knack.jpg"),
    start: "Stand or sit. Practice contracting pelvic floor just before a cough or sneeze.",
    end: "Squeeze pelvic floor firmly, then cough. Release after. Practice 5 times with voluntary cough.",
    why: "The 'Knack' is the #1 evidence-based technique for preventing stress incontinence leaks. Trains automatic bracing reflex.",
    reps: "5 practice coughs", seconds: 90,
    category: "pelvic", intensity: 1,
  },
  {
    name: "Deep Squat Pelvic Floor Release",
    image: img("deepsquat-release.jpg"),
    start: "Stand with feet wider than hips, toes turned out. Hold onto chair for support.",
    end: "Lower into deep squat, let pelvic floor relax and lengthen. Breathe deeply for 30 sec. Rise slowly.",
    why: "Pelvic floor needs both strength AND flexibility. Tight pelvic floor can worsen prolapse symptoms. This teaches full relaxation.",
    reps: "3 × 30 sec", seconds: 120,
    category: "pelvic", intensity: 1,
  },
  {
    name: "Transverse Abdominis Activation",
    image: img("transverse-abs.jpg"),
    start: "Lie on back, knees bent. Place fingers just inside hip bones.",
    end: "Gently draw lower belly inward (as if zipping up tight jeans). Hold 10 sec while breathing normally. You should feel a gentle tension under your fingers.",
    why: "The transverse abdominis works synergistically with the pelvic floor. Activating it provides internal support for pelvic organs and reduces intra-abdominal pressure.",
    reps: "10 × 10 sec", seconds: 150,
    category: "pelvic", intensity: 1,
  },
  {
    name: "Elevated Legs Pelvic Rest",
    image: img("legsup.jpg"),
    start: "Lie on back, place legs up on a chair or wall (90° angle at hips).",
    end: "Rest here for 3-5 minutes. Breathe deeply. Gravity assists pelvic organ repositioning.",
    why: "Gravity reversal reduces pressure on prolapsed tissues. Recommended by pelvic physiotherapists as daily relief position, especially after prolonged standing.",
    reps: "3-5 min", seconds: 240,
    category: "pelvic", intensity: 1,
  },
  {
    name: "Clamshell with Pelvic Floor",
    image: img("clamshell.jpg"),
    start: "Lie on side, knees bent 90°, feet together. Engage pelvic floor first.",
    end: "Keeping feet together, lift top knee like a clamshell opening. Hold 3 sec. Lower slowly. Keep pelvic floor engaged throughout.",
    why: "Strengthens hip external rotators while maintaining pelvic floor engagement. Supports pelvic stability and reduces prolapse symptoms during movement.",
    reps: "12 each side", seconds: 150,
    category: "pelvic", intensity: 2,
  },

  // --- POSTURE (6 exercises, progressive) ---
  {
    name: "Wall Posture Reset",
    image: img("wallposture.jpg"),
    start: "Stand with back against wall, heels 2 inches from wall.",
    end: "Press head, shoulders, and hips to wall. Tuck chin slightly. Hold.",
    why: "Resets posture alignment, builds proprioceptive awareness of correct standing position. Corrects forward head posture common in menopause.",
    reps: "1 min hold", seconds: 90,
    category: "posture", intensity: 1,
  },
  {
    name: "Scapula Squeeze",
    image: img("scapula.jpg"),
    start: "Sit or stand tall, arms by sides.",
    end: "Squeeze shoulder blades together and down, hold 5 sec, release.",
    why: "Strengthens rhomboids and middle trapezius — the muscles that prevent rounded shoulders and thoracic kyphosis.",
    reps: "12 reps", seconds: 90,
    category: "posture", intensity: 1,
  },
  {
    name: "Chin Tuck (Deep Neck Flexor)",
    image: img("chintuck.jpg"),
    start: "Sit tall or stand against wall. Look straight ahead.",
    end: "Draw chin straight back (making a double chin). Hold 5 sec. Release. Don't tilt head up or down.",
    why: "Strengthens deep cervical flexors that counteract forward head posture. Reduces neck pain and tension headaches by up to 70% per research.",
    reps: "10 reps × 5 sec", seconds: 90,
    category: "posture", intensity: 1,
  },
  {
    name: "Thoracic Extension Over Roller",
    image: img("thoracic-roller.jpg"),
    start: "Sit on floor, foam roller (or rolled towel) behind upper back. Knees bent, hands behind head.",
    end: "Gently arch upper back over roller. Hold 3 sec. Move roller slightly up/down spine. Repeat at 3-4 positions.",
    why: "Reverses thoracic kyphosis (hunched upper back) that worsens with age. Improves breathing capacity and reduces shoulder impingement.",
    reps: "3-4 positions × 3 reps", seconds: 120,
    category: "posture", intensity: 2,
  },
  {
    name: "Prone Y-T-W Raises",
    image: img("ytw-raises.jpg"),
    start: "Lie face down, forehead on small towel. Arms extended overhead (Y position).",
    end: "Lift arms 2 inches off floor in Y shape, hold 3 sec. Lower. Repeat in T shape (arms to sides) and W shape (elbows bent).",
    why: "Activates lower trapezius and serratus anterior — critical postural muscles that weaken with desk work and aging. Prevents rotator cuff issues.",
    reps: "5 each position", seconds: 150,
    category: "posture", intensity: 2,
  },
  {
    name: "Standing Posture Flow",
    image: img("postureflow.jpg"),
    start: "Stand tall, feet hip-width. Arms by sides.",
    end: "Inhale: roll shoulders up and back, open chest, slight backbend. Exhale: return to tall neutral. Repeat with awareness of alignment.",
    why: "Integrates all postural muscles in a flowing movement. Builds the habit of self-correcting posture throughout the day.",
    reps: "10 flows", seconds: 90,
    category: "posture", intensity: 1,
  },

  // --- COOL-DOWN (6 exercises) ---
  {
    name: "Forward Fold Release",
    image: img("fold.jpg"),
    start: "Stand with feet hip-width, soft bend in knees.",
    end: "Fold forward from hips, let head and arms hang heavy. Sway gently side to side.",
    why: "Releases erector spinae tension, decompresses spine, calms nervous system through inversion effect.",
    reps: "1 min", seconds: 60,
    category: "cooldown", intensity: 1,
  },
  {
    name: "Child's Pose Rest",
    image: img("childpose.jpg"),
    start: "Kneel on floor, big toes touching, knees wide.",
    end: "Fold forward, arms extended, forehead to floor. Breathe deeply into back ribs.",
    why: "Full-body relaxation, stretches hips, back and shoulders simultaneously. Activates rest-and-digest response.",
    reps: "2 min", seconds: 120,
    category: "cooldown", intensity: 1,
  },
  {
    name: "Supine Spinal Twist",
    image: img("supinetwist.jpg"),
    start: "Lie on back, arms in T position. Knees bent, feet flat.",
    end: "Drop both knees to right, look left. Hold 30 sec. Switch sides. Keep both shoulders on floor.",
    why: "Releases lower back and hip tension, stretches obliques and IT band. Promotes spinal decompression after exercise.",
    reps: "30 sec each side", seconds: 90,
    category: "cooldown", intensity: 1,
  },
  {
    name: "Figure-4 Hip Stretch",
    image: img("figure4.jpg"),
    start: "Lie on back. Cross right ankle over left knee (figure-4 shape).",
    end: "Pull left thigh toward chest until you feel deep stretch in right hip. Hold 30 sec. Switch sides.",
    why: "Releases piriformis and deep hip rotators. Reduces sciatic-type pain and hip tightness common in perimenopause.",
    reps: "30 sec each side", seconds: 90,
    category: "cooldown", intensity: 1,
  },
  {
    name: "Legs Up the Wall",
    image: img("legsonwall.jpg"),
    start: "Sit sideways next to wall. Swing legs up wall as you lie back.",
    end: "Rest with legs straight up wall, arms relaxed by sides. Close eyes. Breathe naturally for 3 min.",
    why: "Reverses blood pooling in legs, reduces swelling, calms nervous system. Recommended by physiotherapists for pelvic floor recovery and sleep preparation.",
    reps: "3 min", seconds: 180,
    category: "cooldown", intensity: 1,
  },
  {
    name: "Body Scan Relaxation",
    image: img("bodyscan.jpg"),
    start: "Lie on back in comfortable position. Close eyes.",
    end: "Mentally scan from toes to head, consciously releasing tension in each body part. Spend 5 breaths on each area.",
    why: "Progressive muscle relaxation reduces cortisol, improves sleep onset and teaches body awareness. Clinically effective for chronic pain and anxiety.",
    reps: "3-5 min", seconds: 240,
    category: "cooldown", intensity: 1,
  },

  // --- ADDITIONAL CORE (expanded, progressive) ---
  {
    name: "Pallof Press (Anti-Rotation)",
    image: img("core.jpg"),
    start: "Stand sideways to anchor point (door frame with resistance band, or just clasp hands at chest).",
    end: "Press hands straight out from chest, resisting rotation. Hold 3 sec. Return. Keep hips and shoulders square.",
    why: "Trains anti-rotation — the core's primary function in daily life. Protects spine during twisting movements. Superior to crunches for functional strength.",
    reps: "10 each side", seconds: 120,
    category: "core", intensity: 2,
  },
  {
    name: "Side Plank (Modified)",
    image: img("sideplank-mod.jpg"),
    start: "Lie on side, bottom knee bent (on floor for support). Top leg straight. Bottom elbow under shoulder.",
    end: "Lift hips off floor, creating straight line from top foot to head. Hold 20 sec. Lower. Switch sides.",
    why: "Strengthens obliques and quadratus lumborum — critical for spinal stability and preventing lower back pain. Modified version is joint-friendly.",
    reps: "20 sec each side × 3", seconds: 150,
    category: "core", intensity: 2,
  },
  {
    name: "Full Side Plank",
    image: img("sideplank-full.jpg"),
    start: "Lie on side, legs stacked. Bottom elbow under shoulder.",
    end: "Lift hips, creating straight line from feet to head. Hold 30 sec. Lower with control.",
    why: "Advanced oblique and hip stabilizer strengthening. Builds lateral core endurance essential for balance and fall prevention.",
    reps: "30 sec each side", seconds: 120,
    category: "core", intensity: 3,
  },
  {
    name: "Plank Hold (Modified)",
    image: img("plank-modified.jpg"),
    start: "Forearms on floor, knees on floor (modified). Elbows under shoulders.",
    end: "Lift hips to create straight line from knees to head. Hold position, breathing normally. Don't let hips sag or pike.",
    why: "Isometric core strengthening that builds endurance without spinal flexion. Safer than sit-ups for osteoporosis risk.",
    reps: "30 sec × 3", seconds: 120,
    category: "core", intensity: 1,
  },
  {
    name: "Full Plank Hold",
    image: img("plank-full.jpg"),
    start: "Forearms on floor, toes on floor. Body in straight line.",
    end: "Hold plank position 30-45 sec. Engage core, squeeze glutes, breathe steadily.",
    why: "Full-body isometric that strengthens entire anterior chain. Builds bone density in wrists and spine through loading.",
    reps: "30-45 sec × 2", seconds: 120,
    category: "core", intensity: 3,
  },
  {
    name: "Pelvic Tilt (Imprint)",
    image: img("pelvictilt.jpg"),
    start: "Lie on back, knees bent, feet flat. Neutral spine (small gap under lower back).",
    end: "Gently flatten lower back to floor by tilting pelvis (belly button toward spine). Hold 5 sec. Release to neutral.",
    why: "Teaches pelvic awareness and activates deep core stabilizers. Foundation exercise for all core work. Reduces lower back pain.",
    reps: "15 reps", seconds: 90,
    category: "core", intensity: 1,
  },

  // --- ADDITIONAL LOWER BODY (expanded, progressive) ---
  {
    name: "Glute Kickback (All Fours)",
    image: img("glutekickback.jpg"),
    start: "All fours position, hands under shoulders, knees under hips.",
    end: "Keeping knee bent 90°, lift one leg until thigh is parallel to floor. Squeeze glute at top. Lower with control.",
    why: "Isolates gluteus maximus without loading the spine. Essential for pelvic stability and reducing lower back compensation.",
    reps: "15 each leg", seconds: 120,
    category: "lower", intensity: 1,
  },
  {
    name: "Step-Up (Low Step)",
    image: img("stepup.jpg"),
    start: "Stand facing a low step or sturdy platform (15-20cm). Hands on hips.",
    end: "Step up with right foot, drive through heel to stand on top. Step down with control. Alternate legs.",
    why: "Functional unilateral exercise that builds leg strength for stairs and daily activities. Improves bone density in hips and femur.",
    reps: "10 each leg", seconds: 120,
    category: "lower", intensity: 2,
  },
  {
    name: "Romanian Deadlift (Bodyweight)",
    image: img("rdl.jpg"),
    start: "Stand tall, feet hip-width, slight bend in knees. Hands on thighs.",
    end: "Hinge at hips, sliding hands down legs. Keep back flat, push hips back. Go until you feel hamstring stretch. Return to standing.",
    why: "Strengthens posterior chain (hamstrings, glutes, erectors) — the muscles that prevent falls and support posture. Builds hip hinge pattern.",
    reps: "12 reps", seconds: 120,
    category: "lower", intensity: 2,
  },
  {
    name: "Split Squat (Static Lunge)",
    image: img("splitsquat.jpg"),
    start: "Stand in split stance — one foot forward, one back. Back heel lifted.",
    end: "Lower back knee toward floor (don't touch). Front knee stays over ankle. Push up through front heel.",
    why: "Unilateral leg strengthening that corrects imbalances. Builds stability and strength for walking, stairs and fall prevention.",
    reps: "10 each leg", seconds: 150,
    category: "lower", intensity: 2,
  },
  {
    name: "Wall Sit Hold",
    image: img("wallsit.jpg"),
    start: "Stand with back against wall. Walk feet out and slide down until thighs are parallel to floor.",
    end: "Hold position — back flat against wall, knees at 90°. Breathe steadily. Hold as long as possible (aim 30-60 sec).",
    why: "Isometric quad and glute strengthening. Builds muscular endurance without joint impact. Excellent for knee rehabilitation.",
    reps: "30-60 sec × 2", seconds: 120,
    category: "lower", intensity: 2,
  },
  {
    name: "Lateral Band Walk (or Side Steps)",
    image: img("lateralwalk.jpg"),
    start: "Stand with slight squat, feet hip-width. (Use resistance band above knees if available, or just bodyweight).",
    end: "Take 10 steps to the right, maintaining squat position. Then 10 steps left. Keep tension in glutes.",
    why: "Activates gluteus medius — the key hip stabilizer that prevents knee collapse and pelvic drop. Critical for balance and joint health.",
    reps: "10 steps each way × 2", seconds: 120,
    category: "lower", intensity: 2,
  },
  {
    name: "Bulgarian Split Squat",
    image: img("bulgariansquat.jpg"),
    start: "Stand 2 feet in front of chair. Place top of back foot on chair seat.",
    end: "Lower back knee toward floor, keeping front knee over ankle. Push up through front heel. Keep torso upright.",
    why: "Advanced unilateral exercise that maximally loads quads and glutes. Builds significant lower body strength and balance.",
    reps: "8 each leg", seconds: 150,
    category: "lower", intensity: 3,
  },

  // --- ADDITIONAL UPPER BODY (expanded, progressive) ---
  {
    name: "Seated Row (Resistance Band or Towel)",
    image: img("seatedrow.jpg"),
    start: "Sit on floor, legs extended. Loop band around feet (or hold towel around feet for isometric).",
    end: "Pull elbows back, squeezing shoulder blades together. Hold 2 sec. Slowly release forward.",
    why: "Strengthens rhomboids, rear deltoids and biceps. Counteracts forward shoulder posture from daily activities.",
    reps: "12 reps", seconds: 90,
    category: "upper", intensity: 1,
  },
  {
    name: "Tricep Dip (Chair)",
    image: img("tricepdip.jpg"),
    start: "Sit on edge of sturdy chair, hands gripping edge beside hips. Walk feet forward.",
    end: "Lower body by bending elbows to 90°. Push back up. Keep back close to chair.",
    why: "Strengthens triceps and anterior deltoids. Builds arm strength for pushing movements and getting up from chairs.",
    reps: "10 reps", seconds: 90,
    category: "upper", intensity: 2,
  },
  {
    name: "Overhead Press (Water Bottles)",
    image: img("overheadpress.jpg"),
    start: "Stand or sit tall. Hold water bottles (or light weights) at shoulder height, palms forward.",
    end: "Press both arms overhead until straight. Lower with control back to shoulders.",
    why: "Builds shoulder strength and bone density in upper arms. Functional for reaching overhead — a movement that weakens with age.",
    reps: "12 reps", seconds: 90,
    category: "upper", intensity: 2,
  },
  {
    name: "Bicep Curl (Water Bottles)",
    image: img("bicepcurl.jpg"),
    start: "Stand tall, arms by sides holding water bottles (or light weights). Palms forward.",
    end: "Curl both arms up, squeezing biceps at top. Lower slowly (3 sec down).",
    why: "Builds arm strength for carrying groceries, lifting grandchildren. Slow eccentric phase builds more muscle with less joint stress.",
    reps: "12 reps", seconds: 90,
    category: "upper", intensity: 1,
  },
  {
    name: "Push-Up (Full or Knee)",
    image: img("pushup-full.jpg"),
    start: "Plank position (full or from knees). Hands slightly wider than shoulders.",
    end: "Lower chest toward floor, elbows at 45°. Push back up. Keep core tight throughout.",
    why: "Gold standard upper body exercise. Builds chest, shoulders, triceps and core simultaneously. Improves bone density in wrists and spine.",
    reps: "8-12 reps", seconds: 90,
    category: "upper", intensity: 3,
  },
  {
    name: "Reverse Fly (Bent Over)",
    image: img("reversefly.jpg"),
    start: "Stand with slight forward lean (45°), arms hanging down with water bottles or fists.",
    end: "Raise arms out to sides, squeezing shoulder blades together. Hold 2 sec at top. Lower slowly.",
    why: "Targets posterior deltoids and rhomboids — muscles that prevent rounded shoulders. Essential for posture correction.",
    reps: "12 reps", seconds: 90,
    category: "upper", intensity: 2,
  },

  // --- ADDITIONAL MOBILITY (expanded) ---
  {
    name: "Thread the Needle",
    image: img("threadneedle.jpg"),
    start: "All fours position. Right arm extended to ceiling (open twist).",
    end: "Thread right arm under body, sliding it along floor to left. Rest right shoulder and temple on floor. Hold 20 sec. Switch.",
    why: "Deep thoracic rotation stretch. Releases tension between shoulder blades and improves spinal rotation for daily activities.",
    reps: "20 sec each side × 2", seconds: 120,
    category: "mobility", intensity: 1,
  },
  {
    name: "90/90 Hip Switch",
    image: img("9090hip.jpg"),
    start: "Sit on floor, both legs bent at 90°. Right leg in front (external rotation), left leg behind (internal rotation).",
    end: "Lift knees and switch to opposite position. Move slowly with control. Keep torso tall.",
    why: "Improves hip internal and external rotation — movements that stiffen significantly during menopause. Reduces hip and knee pain.",
    reps: "8 switches", seconds: 120,
    category: "mobility", intensity: 2,
  },
  {
    name: "World's Greatest Stretch",
    image: img("worldstretch.jpg"),
    start: "Start in lunge position, right foot forward. Place left hand on floor inside right foot.",
    end: "Rotate torso right, reaching right arm to ceiling. Hold 3 sec. Return hand to floor. Repeat 5 times. Switch sides.",
    why: "Combines hip flexor stretch, thoracic rotation, and hamstring lengthening in one movement. Used by physiotherapists as comprehensive mobility assessment.",
    reps: "5 each side", seconds: 150,
    category: "mobility", intensity: 2,
  },
  {
    name: "Doorway Chest Stretch",
    image: img("doorwaychest.jpg"),
    start: "Stand in doorway. Place forearms on door frame, elbows at shoulder height.",
    end: "Step one foot forward through doorway until you feel stretch across chest and front of shoulders. Hold 30 sec.",
    why: "Opens pectoralis major and minor — muscles that shorten from desk work and cause rounded posture. Improves breathing capacity.",
    reps: "30 sec × 3", seconds: 120,
    category: "mobility", intensity: 1,
  },
  {
    name: "Seated Hamstring Stretch",
    image: img("hamstring-stretch.jpg"),
    start: "Sit on floor, one leg extended, other foot against inner thigh.",
    end: "Hinge forward from hips toward extended foot. Keep back flat (don't round). Hold 30 sec. Switch legs.",
    why: "Tight hamstrings contribute to lower back pain and pelvic tilt issues. Gentle sustained stretch improves flexibility without risk.",
    reps: "30 sec each leg", seconds: 90,
    category: "mobility", intensity: 1,
  },

  // --- ADDITIONAL BALANCE (expanded, progressive) ---
  {
    name: "Tandem Stand",
    image: img("tandemstand.jpg"),
    start: "Stand with one foot directly in front of the other (heel to toe). Arms out for balance.",
    end: "Hold position 30 seconds. Switch which foot is in front. Progress: close eyes.",
    why: "Challenges balance in narrow base of support. Directly trains the vestibular system to prevent falls.",
    reps: "30 sec each foot", seconds: 90,
    category: "balance", intensity: 1,
  },
  {
    name: "Single-Leg Stand Eyes Closed",
    image: img("singleleg-eyes.jpg"),
    start: "Stand on one foot near wall (for safety). Close eyes.",
    end: "Hold balance with eyes closed for 10-20 seconds. Switch feet. Wall is there if you wobble.",
    why: "Removes visual input, forcing proprioceptive system to work harder. Research shows this is the strongest predictor of fall risk reduction.",
    reps: "10-20 sec each × 3", seconds: 120,
    category: "balance", intensity: 2,
  },
  {
    name: "Clock Reach",
    image: img("clockreach.jpg"),
    start: "Stand on right foot. Imagine standing in center of a clock.",
    end: "Reach left foot to 12 o'clock (forward), tap floor. Return. Reach to 3 (side). Return. Reach to 6 (behind). Return. Switch legs.",
    why: "Multi-directional balance challenge that trains reactive stability. Mimics real-world balance demands like reaching and stepping.",
    reps: "3 positions each leg × 2", seconds: 150,
    category: "balance", intensity: 2,
  },
  {
    name: "Heel Raises with Balance",
    image: img("heelraise-balance.jpg"),
    start: "Stand on one foot (hold wall lightly if needed).",
    end: "Rise onto toes of standing foot. Hold 3 sec at top. Lower slowly. Repeat 8 times. Switch feet.",
    why: "Combines calf strengthening with single-leg balance. Builds ankle stability critical for uneven surfaces and stair safety.",
    reps: "8 each foot", seconds: 120,
    category: "balance", intensity: 3,
  },
];

// ============================================================
// SYMPTOM → EXERCISE MAPPING
// Which categories help which symptoms
// ============================================================

const SYMPTOM_FOCUS: Record<string, ExerciseCategory[]> = {
  "Hot flashes":    ["breathing", "mobility", "cooldown"],
  "Poor sleep":     ["breathing", "mobility", "cooldown", "balance"],
  "Weight gain":    ["lower", "core", "upper", "balance"],
  "Low energy":     ["lower", "core", "upper", "warmup", "breathing"],
  "Joint pain":     ["mobility", "warmup", "balance", "cooldown"],
  "Bloating":       ["mobility", "breathing", "core"],
  "Back pain":      ["core", "mobility", "pelvic", "posture"],
  "Mood swings":    ["breathing", "balance", "posture", "mobility", "lower"],
  "Low confidence": ["posture", "upper", "core", "balance"],
  "Incontinence":   ["pelvic", "core", "breathing", "lower"],
  "Pelvic prolapse": ["pelvic", "core", "breathing", "posture"],
};

const GOAL_FOCUS: Record<string, ExerciseCategory[]> = {
  fat_loss:  ["lower", "core", "upper", "balance"],
  tone:      ["lower", "core", "upper", "pelvic"],
  energy:    ["lower", "mobility", "balance", "upper"],
  maintain:  ["mobility", "breathing", "balance", "core"],
};

// ============================================================
// PHASE SYSTEM - Progressive difficulty over 30/90 days
// ============================================================

function getPhase(day: number): ProgramPhase {
  if (day <= 7)  return "foundation";
  if (day <= 16) return "build";
  if (day <= 24) return "strengthen";
  return "master";
}

function getPhaseIntensity(phase: ProgramPhase): (1 | 2 | 3)[] {
  switch (phase) {
    case "foundation": return [1];
    case "build":      return [1, 2];
    case "strengthen": return [2, 3];
    case "master":     return [2, 3];
  }
}

const PHASE_TITLES: Record<ProgramPhase, string> = {
  foundation: "Foundation",
  build:      "Building Strength",
  strengthen: "Getting Stronger",
  master:     "Mastery",
};

// ============================================================
// DAY THEMES - Rotating focus areas through the week
// ============================================================

type DayTheme = {
  name: string;
  primary: ExerciseCategory[];
  secondary: ExerciseCategory[];
};

const WEEK_THEMES: DayTheme[] = [
  { name: "Full Body Flow",       primary: ["lower", "upper", "core"],       secondary: ["mobility"] },
  { name: "Core & Pelvic Health", primary: ["core", "pelvic", "breathing"],  secondary: ["mobility"] },
  { name: "Lower Body Strength",  primary: ["lower", "balance"],             secondary: ["core"] },
  { name: "Mobility & Recovery",  primary: ["mobility", "breathing"],        secondary: ["posture", "balance"] },
  { name: "Upper Body & Posture", primary: ["upper", "posture"],             secondary: ["core"] },
  { name: "Balance & Stability",  primary: ["balance", "core", "lower"],     secondary: ["mobility"] },
  { name: "Restore & Breathe",    primary: ["breathing", "mobility", "cooldown"], secondary: ["pelvic"] },
];

// ============================================================
// MAIN PROGRAM BUILDER
// ============================================================

function getExerciseCount(time: string): number {
  if (time === "10 min") return 5;
  if (time === "30 min" || time === "30+ min") return 12;
  return 8; // 20 min default
}

function pickExercises(
  categories: ExerciseCategory[],
  intensities: (1 | 2 | 3)[],
  count: number,
  daySeed: number,
  exclude: Set<string>
): Exercise[] {
  // Filter exercises matching categories and intensity
  const pool = EXERCISES.filter(
    (e) =>
      categories.includes(e.category) &&
      intensities.includes(e.intensity) &&
      !exclude.has(e.name)
  );

  if (pool.length === 0) {
    // Fallback: relax intensity filter
    const relaxed = EXERCISES.filter(
      (e) => categories.includes(e.category) && !exclude.has(e.name)
    );
    return shuffleWithSeed(relaxed, daySeed).slice(0, count);
  }

  return shuffleWithSeed(pool, daySeed).slice(0, count);
}

// Deterministic shuffle so same day always gives same result
function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildTitle(
  phase: ProgramPhase,
  dayTheme: DayTheme,
  symptoms: string[],
  day: number
): { title: string; description: string } {
  // Symptom-specific titles take priority
  const primarySymptom = symptoms[0];

  const symptomTitles: Record<string, string> = {
    "Hot flashes":    "Cooling & Calm",
    "Poor sleep":     "Sleep Recovery",
    "Weight gain":    "Metabolism Boost",
    "Low energy":     "Energy Activation",
    "Joint pain":     "Joint Ease",
    "Bloating":       "Digestive Flow",
    "Back pain":      "Back Relief",
    "Mood swings":    "Mood Balance",
    "Low confidence": "Confidence Builder",
    "Incontinence":   "Bladder Control",
    "Pelvic prolapse": "Pelvic Support",
  };

  const symptomDescs: Record<string, string> = {
    "Hot flashes":    "Breathing techniques and gentle movement to regulate body temperature and calm the nervous system.",
    "Poor sleep":     "Evening-friendly exercises that prepare your body for deep, restorative sleep.",
    "Weight gain":    "Metabolism-boosting strength work combined with movement that targets stubborn areas.",
    "Low energy":     "Energizing movements that wake up your body without exhausting it.",
    "Joint pain":     "Gentle mobility work that lubricates joints and reduces stiffness safely.",
    "Bloating":       "Twists and breathing that support digestion and reduce abdominal discomfort.",
    "Back pain":      "Core stabilization and mobility to relieve and prevent back pain.",
    "Mood swings":    "Mindful movement and breathing to stabilize mood and reduce stress hormones.",
    "Low confidence": "Posture-building and strength exercises that help you stand taller and feel powerful.",
    "Incontinence":   "Evidence-based pelvic floor training with Knack technique and endurance holds to restore bladder control and prevent leakage.",
    "Pelvic prolapse": "Hypopressive breathing, pelvic floor strengthening and gravity-assisted positions to support pelvic organs and reduce prolapse symptoms.",
  };

  const base = primarySymptom && symptomTitles[primarySymptom]
    ? symptomTitles[primarySymptom]
    : dayTheme.name;

  const desc = primarySymptom && symptomDescs[primarySymptom]
    ? symptomDescs[primarySymptom]
    : `${PHASE_TITLES[phase]} phase: ${dayTheme.name.toLowerCase()} focused session.`;

  return {
    title: `${base} – Day ${day} (${PHASE_TITLES[phase]})`,
    description: desc,
  };
}

export function buildPlan(
  day: number,
  profile: Partial<UserProfile> = {}
): DayPlan {
  const {
    symptoms = [],
    severity = {},
    goal = "tone",
    activity = "light",
    age = 48,
    time = "20 min",
    sleep = 5,
  } = profile;

  const phase = getPhase(((day - 1) % 30) + 1); // Cycle every 30 days
  const intensities = getPhaseIntensity(phase);

  // Adjust intensity for age and fitness
  const adjustedIntensities = [...intensities];
  if (age >= 60 || activity === "sedentary") {
    // Keep only gentler options
    const idx = adjustedIntensities.indexOf(3);
    if (idx !== -1) adjustedIntensities[idx] = 2;
  }

  const exerciseCount = getExerciseCount(time);
  const dayTheme = WEEK_THEMES[(day - 1) % 7];
  const daySeed = day * 7919 + symptoms.length * 31 + (goal.charCodeAt(0) || 0);

  // Build priority categories from symptoms + goal + day theme
  const symptomCategories: ExerciseCategory[] = [];
  const sortedSymptoms = [...symptoms].sort(
    (a, b) => (severity[b] || 3) - (severity[a] || 3)
  );
  for (const s of sortedSymptoms) {
    const cats = SYMPTOM_FOCUS[s] || [];
    for (const c of cats) {
      if (!symptomCategories.includes(c)) symptomCategories.push(c);
    }
  }

  const goalCategories = GOAL_FOCUS[goal] || GOAL_FOCUS.tone;
  const themeCategories = [...dayTheme.primary, ...dayTheme.secondary];

  // Merge priorities: symptoms first, then goal, then day theme
  const allCategories: ExerciseCategory[] = [];
  for (const c of [...symptomCategories, ...goalCategories, ...themeCategories]) {
    if (!allCategories.includes(c)) allCategories.push(c);
  }

  // Build the session
  const used = new Set<string>();
  const exercises: Exercise[] = [];

  // 1. Always start with warm-up
  const warmups = pickExercises(["warmup"], [1], 1, daySeed, used);
  for (const e of warmups) { exercises.push(e); used.add(e.name); }

  // 2. If poor sleep or hot flashes are severe, add breathing early
  if (
    (symptoms.includes("Poor sleep") && sleep <= 4) ||
    (symptoms.includes("Hot flashes") && (severity["Hot flashes"] || 3) >= 4)
  ) {
    const breathe = pickExercises(["breathing"], [1], 1, daySeed + 1, used);
    for (const e of breathe) { exercises.push(e); used.add(e.name); }
  }

  // 3. Main exercises from priority categories
  const mainCount = exerciseCount - exercises.length - 1; // -1 for cooldown
  const mainExercises = pickExercises(
    allCategories,
    adjustedIntensities as (1 | 2 | 3)[],
    mainCount,
    daySeed + 2,
    used
  );
  for (const e of mainExercises) { exercises.push(e); used.add(e.name); }

  // 4. Always end with cool-down
  const cooldowns = pickExercises(["cooldown"], [1], 1, daySeed + 3, used);
  for (const e of cooldowns) { exercises.push(e); used.add(e.name); }

  // Calculate total time
  const totalSeconds = exercises.reduce((sum, e) => sum + e.seconds, 0);

  const { title, description } = buildTitle(phase, dayTheme, symptoms, day);

  const focusAreas = [...new Set(exercises.map((e) => e.category))];

  return {
    day,
    title,
    theme: `${PHASE_TITLES[phase]} • ${dayTheme.name}`,
    description,
    phase,
    focusAreas,
    exercises,
    totalMinutes: Math.round(totalSeconds / 60),
  };
}

// ============================================================
// PUBLIC API - Backward compatible
// ============================================================

/** Load quiz data from localStorage and build plan */
function loadProfile(): Partial<UserProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("quizData");
    if (!raw) return {};
    const data = JSON.parse(raw);
    return {
      symptoms: data.symptoms || [],
      severity: data.severity || {},
      goal: data.goal || "tone",
      activity: data.activity || "light",
      age: Number(data.age) || 48,
      time: data.time || "20 min",
      sleep: Number(data.sleep) || 5,
      confidence: Number(data.confidence) || 5,
    };
  } catch {
    return {};
  }
}

export function getTodayProgram(
  day: number,
  symptoms?: string[],
  selectedTime?: string
): DayPlan {
  const profile = loadProfile();

  // Allow overrides from function params (backward compat)
  if (symptoms && symptoms.length > 0) profile.symptoms = symptoms;
  if (selectedTime) profile.time = selectedTime;

  const safeDay = Math.max(1, Math.min(90, day || 1));
  return buildPlan(safeDay, profile);
}

export function getPlan(
  day: number,
  symptoms: string[] = [],
  selectedTime = "10 min"
) {
  return getTodayProgram(day, symptoms, selectedTime);
}

/** Generate preview plans (used by legacy code) */
export const plans: DayPlan[] = Array.from({ length: 30 }, (_, i) =>
  buildPlan(i + 1)
);

// ============================================================
// REST DAY SYSTEM - Every 7th day is recovery
// ============================================================

export function isRestDay(day: number): boolean {
  return day % 7 === 0;
}

export type RestDayContent = {
  title: string;
  theme: string;
  meditation: { title: string; duration: string; instructions: string[] };
  journalPrompt: string;
  selfCareTips: string[];
  affirmation: string;
};

const REST_DAYS: RestDayContent[] = [
  {
    title: "Restore & Reflect",
    theme: "Your body heals when you rest",
    meditation: {
      title: "Body Scan Relaxation",
      duration: "10 min",
      instructions: [
        "Lie down comfortably. Close your eyes.",
        "Starting from your toes, notice any tension. Breathe into it and release.",
        "Slowly move attention up: feet, calves, knees, thighs.",
        "Continue through hips, belly, chest, shoulders.",
        "Relax your jaw, forehead, and scalp.",
        "Stay here for 2 minutes, breathing naturally.",
        "When ready, gently wiggle fingers and toes. Open your eyes.",
      ],
    },
    journalPrompt: "What is one thing your body did for you this week that you're grateful for?",
    selfCareTips: [
      "Take a warm bath with epsom salts (magnesium helps muscle recovery)",
      "Drink an extra glass of water with lemon today",
      "Go for a gentle 15-minute walk in nature",
      "Apply body lotion mindfully — notice how your skin feels",
    ],
    affirmation: "I am becoming stronger and more balanced every day. Rest is part of my strength.",
  },
  {
    title: "Nourish & Renew",
    theme: "Recovery is where transformation happens",
    meditation: {
      title: "Gratitude Breathing",
      duration: "8 min",
      instructions: [
        "Sit comfortably with hands on your lap.",
        "Breathe in for 4 counts. Think of something you're grateful for.",
        "Hold for 4 counts. Feel the gratitude in your chest.",
        "Exhale for 6 counts. Release any tension.",
        "Repeat for 8 cycles, each time choosing a new gratitude.",
        "End with 3 deep breaths and a gentle smile.",
      ],
    },
    journalPrompt: "How has your energy changed since you started? What surprised you most?",
    selfCareTips: [
      "Prepare tomorrow's breakfast tonight (overnight oats are perfect)",
      "Stretch gently for 5 minutes before bed",
      "Put your phone away 30 minutes before sleep",
      "Write down 3 things that went well this week",
    ],
    affirmation: "I honor my body's need for rest. Every pause makes me stronger.",
  },
  {
    title: "Gentle Reset",
    theme: "Stillness is not weakness — it's wisdom",
    meditation: {
      title: "Cooling Breath (for hot flashes)",
      duration: "7 min",
      instructions: [
        "Sit tall. Curl your tongue into a tube (or purse lips if you can't).",
        "Inhale slowly through the curled tongue — feel the cool air.",
        "Close mouth, exhale through nose for 6 counts.",
        "Repeat 10 times. Notice your body temperature dropping.",
        "Finish with 5 normal breaths, eyes closed.",
      ],
    },
    journalPrompt: "What symptom has improved the most? What still needs attention?",
    selfCareTips: [
      "Try a cup of chamomile or valerian tea this evening",
      "Do 5 minutes of gentle neck and shoulder rolls",
      "Spend 10 minutes doing something purely for pleasure (reading, music, garden)",
      "Lay on the floor with legs up the wall for 5 minutes (great for circulation)",
    ],
    affirmation: "I am patient with my body. Change takes time, and I am on the right path.",
  },
  {
    title: "Celebrate & Recharge",
    theme: "Look how far you've come",
    meditation: {
      title: "Self-Compassion Meditation",
      duration: "10 min",
      instructions: [
        "Place both hands on your heart. Close your eyes.",
        "Say silently: 'May I be kind to myself.'",
        "Breathe deeply. Say: 'May I accept where I am right now.'",
        "Breathe again. Say: 'May I have the strength to keep going.'",
        "Sit with these words for 5 minutes.",
        "Open your eyes. Smile. You deserve this moment.",
      ],
    },
    journalPrompt: "If you could tell yourself from Day 1 one thing, what would it be?",
    selfCareTips: [
      "Take progress photos or measurements if you'd like (optional, no pressure)",
      "Cook your favorite healthy meal today — make it special",
      "Call or message a friend you haven't spoken to in a while",
      "Plan something to look forward to this week",
    ],
    affirmation: "I celebrate every small victory. My consistency is my superpower.",
  },
  {
    title: "Deep Rest & Renewal",
    theme: "Sleep is your body's repair workshop",
    meditation: {
      title: "Yoga Nidra (Yogic Sleep)",
      duration: "12 min",
      instructions: [
        "Lie on your back in a comfortable position. Cover yourself with a blanket.",
        "Close your eyes. Set an intention: 'I am relaxing deeply.'",
        "Bring awareness to your right hand. Feel each finger, the palm, the wrist.",
        "Move awareness up: forearm, elbow, upper arm, shoulder.",
        "Repeat on the left side. Then both legs, torso, face.",
        "Now feel your whole body as one. Heavy and warm.",
        "Rest here for 5 minutes. You may drift between sleep and waking — that's perfect.",
        "Slowly wiggle fingers and toes. Take a deep breath. Open your eyes.",
      ],
    },
    journalPrompt: "What does your body need more of right now? Less of? How can you honor that this week?",
    selfCareTips: [
      "Go to bed 30 minutes earlier tonight — your body will thank you",
      "Take a warm shower and end with 30 seconds of cool water (improves circulation)",
      "Diffuse lavender essential oil or put a drop on your pillow",
      "Do absolutely nothing for 10 minutes — no phone, no tasks, just be",
    ],
    affirmation: "Rest is not laziness. It is the foundation of my strength.",
  },
  {
    title: "Connect & Nurture",
    theme: "You are not alone on this journey",
    meditation: {
      title: "Loving-Kindness Meditation (Metta)",
      duration: "10 min",
      instructions: [
        "Sit comfortably. Close your eyes. Place hands on your heart.",
        "Silently repeat: 'May I be happy. May I be healthy. May I be at peace.'",
        "Now think of someone you love. Repeat: 'May you be happy. May you be healthy.'",
        "Think of a neutral person (neighbor, cashier). Send them the same wishes.",
        "Think of someone difficult. Try: 'May you be at peace.' (This is hard — that's okay.)",
        "Finally, expand to all beings: 'May all women going through this be supported.'",
        "Sit with this feeling of connection for 2 minutes.",
        "Open your eyes. Notice how your chest feels.",
      ],
    },
    journalPrompt: "Who has supported you on this journey? Have you told them? What would you say?",
    selfCareTips: [
      "Send a voice message to a friend you haven't spoken to in a while",
      "Write a thank-you note to yourself for showing up this week",
      "Spend 15 minutes in nature — even a balcony or park bench counts",
      "Make a cup of tea and drink it slowly, without your phone",
    ],
    affirmation: "I am surrounded by support, even when I can't see it. I am enough.",
  },
  {
    title: "Strength in Stillness",
    theme: "The strongest trees have the deepest roots",
    meditation: {
      title: "Grounding Visualization",
      duration: "8 min",
      instructions: [
        "Sit with feet flat on the floor. Feel the ground beneath you.",
        "Imagine roots growing from the soles of your feet, deep into the earth.",
        "With each exhale, send tension down through the roots into the ground.",
        "With each inhale, draw up calm, stable energy from the earth.",
        "Feel yourself becoming heavier, more grounded, more present.",
        "Imagine a warm golden light filling your body from feet to head.",
        "Stay here for 3 minutes. You are safe. You are supported.",
      ],
    },
    journalPrompt: "What makes you feel grounded? When do you feel most like yourself?",
    selfCareTips: [
      "Walk barefoot on grass or earth for 5 minutes (grounding/earthing)",
      "Organize one small space — a drawer, a shelf. External order creates internal calm",
      "Eat a meal slowly today, noticing every flavor and texture",
      "Stretch your hips for 5 minutes — they hold emotional tension",
    ],
    affirmation: "I am grounded. I am present. I am exactly where I need to be.",
  },
  {
    title: "Joy & Playfulness",
    theme: "Wellness doesn't have to be serious",
    meditation: {
      title: "Smile Meditation",
      duration: "5 min",
      instructions: [
        "Sit comfortably. Close your eyes.",
        "Bring a gentle smile to your face — even if it feels forced at first.",
        "Notice how the smile changes your breathing. It naturally slows.",
        "Think of something that made you laugh recently. Let the smile grow.",
        "Imagine the smile spreading: to your eyes, your chest, your belly.",
        "Hold this feeling for 2 minutes. Smiling releases endorphins — this is real medicine.",
        "Open your eyes. Keep the smile. Carry it into your day.",
      ],
    },
    journalPrompt: "When was the last time you laughed until you cried? What brings you pure joy without any effort?",
    selfCareTips: [
      "Dance to one song — alone in your kitchen, no judgment",
      "Watch something that makes you genuinely laugh (not scroll — choose intentionally)",
      "Do something you loved as a child (coloring, swinging, baking, singing)",
      "Wear something that makes you feel beautiful today — just for you",
    ],
    affirmation: "Joy is not a luxury. It is medicine. I deserve to feel light and free.",
  },
];

export function getRestDayContent(day: number): RestDayContent {
  const weekNumber = Math.floor(day / 7);
  return REST_DAYS[weekNumber % REST_DAYS.length];
}
