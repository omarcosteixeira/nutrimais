
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type WeightGoal = 'lose' | 'maintain' | 'gain';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface ScheduleConfig {
  workingDays: string[]; // 'seg', 'ter', etc.
  startHour: string;
  endHour: string;
  slotDuration: number; // minutes
  blockedTimes: string[]; // ['12:00', '12:30'] specific times that are always blocked
  blockedDates: string[]; // ['2023-12-25'] specific dates that are fully blocked
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export interface WhatsappTemplates {
  appointment: string;
  rescheduling: string;
  return: string;
}

export interface NutritionistProfile {
  name: string;
  crn: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  theme: ThemeConfig;
  schedule: ScheduleConfig;
  socialMedia?: SocialMedia;
  whatsappMessages: WhatsappTemplates;
}

export interface HistoryRecord {
  date: string;
  weight: number;
  bodyFat: number;
  leanMass: number;
  fatMass: number;
  tricepsFold: number;
  labs?: { name: string, value: number }[];
  notes?: string;
}

export interface PatientData {
  id: string;
  // Personal & Contact
  name: string;
  birthDate: string; // YYYY-MM-DD
  profession?: string;
  objective?: string;
  phone: string;
  email: string;
  address: string;
  gender: Gender;
  age: number; // Calculated automatically
  
  // Socio-economic
  isWorking: boolean;
  workHours?: string;
  foodBudget?: number;
  livesAlone: boolean;
  peopleInHouse?: number;
  whoCooks: string;

  // Women's Health (Dynamic)
  isGestante: boolean;
  isMenopausa: boolean;
  statusMenstruacao: string;

  // Infant Data (0-2 years)
  infantFeedingMethod?: string;
  infantStartedSolids?: string;

  // Athlete Status
  isAthlete: boolean;

  // Neurodivergent Status (TEA/TDAH)
  isNeurodivergent: boolean;

  // Anthropometry - General
  weight: number; // kg
  height: number; // cm
  waistCirc: number; // cm
  hipCirc: number; // cm
  armCirc: number; // cm
  tricepsFold: number; // mm
  bicepsFold: number; // mm
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
  goalKcalPerKg?: number;
  
  // Anthropometry - Perimetry
  perimetry: {
    deltoid: number;
    thoraxInap: number;
    thoraxExp: number;
    abdomen: number;
    armRightContracted: number;
    armRightRelaxed: number;
    armLeftContracted: number;
    armLeftRelaxed: number;
    thighRight: number;
    thighLeft: number;
    thighRightMedial: number;
    thighLeftMedial: number;
    legRight: number;
    legLeft: number;
  };

  // Anthropometry - Diameters
  diameters: {
    wrist: number; // Punho
    humerus: number; // Úmero
    femur: number; // Fêmur
  };

  // Bioimpedance (BIA)
  bia: {
    bodyFatPercent: number;
    fatMass: number;
    totalBodyWater: number; // Liters
    leanMassWater: number;
    hydrationIndex: number;
    intracellularWaterPercent: number;
    extracellularWaterPercent: number;
    leanMass: number;
    skeletalMuscleMass: number;
    phaseAngle: number;
  };

  // Anamnesis - Lifestyle
  alcoholFreq: string; // 'Never', '1x/week', etc.
  smokerFreq: string;
  exerciseFreq: string;
  exerciseType: string;
  sleepQuality: string;
  
  reflux: boolean;
  insomnia: boolean;
  bowel: string;

  waterIntake: number; // Liters
  medications: string;
  pathologies: string;
  allergies: string;
  aversions: string;

  // Expanded Clinical Signs
  clinicalSigns: {
    energyLevel: string; 
    dehydration: string[];
    sleepStress: string[]; // Keep for legacy compatibility or repurpose
    hair: string[];
    nails: string[];
    skin: string[];
    giSymptoms: string[];
    eatingBehavior: string[];
    gestationalSymptoms: string[]; 
    cycleSymptoms: string[]; 
    infantObservations: string[]; 
    redsSymptoms: string[]; 
    neurodivergentSymptoms: string[]; // New: TEA/TDAH symptoms
  };

  history: HistoryRecord[];
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  patientBirthDate: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientAddress: string;
  objective: string; 
  status: 'scheduled' | 'completed' | 'canceled';
}

export interface LabResult {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  category: 'low' | 'normal' | 'high';
  suggestion?: string;
}

export interface NutrientInfo {
  calories: number;
  protein: number;
  lipids: number;
  carbs: number;
  fiber: number;
  calcium: number;
  iron: number;
  magnesium: number;
  zinc: number;
}

export interface Food {
  id: string;
  name: string;
  baseUnit: string; // e.g., '100g'
  nutrients: NutrientInfo; // per 100g
  group?: string;
  // Household Measures
  householdUnit?: string; // e.g., "1 colher de sopa"
  householdWeight?: number; // e.g., 25 (grams)
}

export interface FoodEntry {
  foodId: string;
  foodName: string;
  measureType: 'grams' | 'household';
  quantity: number; // User input value
  unitLabel: string; // "g" or "colher de sopa"
  grams: number; // Actual grams used for calculation
  calculated: NutrientInfo;
}

export interface Meal {
  name: string;
  time: string;
  foods: FoodEntry[];
}

export interface DailyPlan {
  name?: string; // For saved templates
  breakfast: Meal;
  morningSnack: Meal;
  lunch: Meal;
  afternoonSnack: Meal;
  dinner: Meal;
  supper: Meal;
  observations: string;
  substitutionList?: string; 
}

export interface DietModel {
  id: string;
  name: string;
  plan: DailyPlan;
}

export interface SubstitutionListModel {
  id: string;
  title: string;
  content: string;
}

export interface EvolutionNote {
  date: string;
  weight: number;
  bmi: number;
  notes: string;
}

export interface CalculatedResults {
  bmi: number;
  bmiClass: string;
  idealWeight: number;
  whr: number;
  whrRisk: string;
  bodyFatPercent: number;
  fatMass: number;
  leanMass: number;
  vet: number;
  bmr: number;
  idealWater: number;
  waterDifference: number;
  armCircAdequacy: number;
  tricepsFoldAdequacy: number;
  armMuscleCirc: number;
  armMuscleCircAdequacy: number;
  correctedMuscleArea: number;
  isChild: boolean;
  bmiPercentile?: string;
}

export interface AiRecipe {
  title: string;
  helpText: string;
  ingredients: string[];
  steps: string[];
  nutrition: string;
}
