
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Calendar, Activity, Utensils, FileText, Settings, 
  Printer, Share2, Download, Save, Plus, Trash2, Search,
  ChevronRight, ChevronDown, User, Scale, Ruler, 
  ClipboardList, FlaskConical, Pill, Menu, X,
  Baby, Flower2, CalendarHeart, Copy, Clock,
  UserPlus, BarChart2, Lock, Unlock, FileInput,
  MessageCircle, RefreshCw, CheckCircle, ArrowRight,
  AlertCircle, CalendarX, Heart, Trophy, Zap,
  Lightbulb, CheckSquare, TrendingUp, Brain,
  Instagram, Facebook, Video, Sparkles, Loader2,
  Coins, Briefcase, ChefHat, Apple, FileDown, FileUp, 
  Rocket, Shield, LayoutDashboard, Check, Image as ImageIcon, Camera
} from 'lucide-react';
import { BodyVisualizer } from './components/BodyVisualizer';
import { PatientData, Gender, Appointment, LabResult, Food, FoodEntry, Meal, DailyPlan, DietModel, NutritionistProfile, ScheduleConfig, HistoryRecord, SubstitutionListModel, AiRecipe } from './types';
import { calculateResults, FOOD_DATABASE, calculateNutrients, getLabSuggestion, getSymptomSuggestions, EXAM_LIST, calculateAge, generateChartPath, FUNCTIONAL_LABS_DATABASE, GENDER_SPECIFIC_LABS } from './utils';
import { GoogleGenAI } from "@google/genai";

// --- INITIAL STATES ---

const initialNutritionist: NutritionistProfile = {
  name: 'Daniela Santos Barreto',
  crn: 'CRN 0000',
  email: 'atendimento@multixprint.com',
  phone: '(00) 99900-0000',
  address: 'Rua Brasil, 123 - Centro - Cidade/BR',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3023/3023246.png', 
  theme: {
    primaryColor: '#153828',
    secondaryColor: '#2a7a8c',
    fontFamily: 'Inter'
  },
  schedule: {
    workingDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    startHour: '08:00',
    endHour: '18:00',
    slotDuration: 30,
    blockedTimes: [],
    blockedDates: []
  },
  socialMedia: {
    instagram: '@nutridaniela',
    facebook: '/nutridanielabarreto',
    tiktok: '@nutridani'
  },
  whatsappMessages: {
    appointment: 'Olá {PACIENTE}, confirmamos sua consulta com {NUTRICIONISTA} para o dia {DATA} às {HORA}. Por favor, confirme sua presença.',
    rescheduling: 'Olá {PACIENTE}, sua consulta com {NUTRICIONISTA} foi reagendada com sucesso para o dia {DATA} às {HORA}.',
    return: 'Olá {PACIENTE}, já está na hora de agendarmos seu retorno com {NUTRICIONISTA} para continuarmos sua evolução. Vamos marcar?'
  }
};

const initialPatient: PatientData = {
  id: '1',
  name: '',
  birthDate: '',
  phone: '',
  email: '',
  address: '',
  profession: '',
  objective: '',
  gender: 'female',
  age: 0,
  isWorking: true,
  livesAlone: false,
  peopleInHouse: 1,
  whoCooks: 'self',
  foodBudget: 0,
  isGestante: false,
  isMenopausa: false,
  statusMenstruacao: 'regular',
  isAthlete: false,
  isNeurodivergent: false,
  infantFeedingMethod: '',
  infantStartedSolids: 'não',
  weight: 65,
  height: 165,
  waistCirc: 72,
  hipCirc: 100,
  armCirc: 28,
  tricepsFold: 18,
  bicepsFold: 8,
  activityLevel: 'light',
  weightGoal: 'maintain',
  goalKcalPerKg: 30, // Default for maintain
  perimetry: {
    deltoid: 0, thoraxInap: 0, thoraxExp: 0, abdomen: 0,
    armRightContracted: 0, armRightRelaxed: 0,
    armLeftContracted: 0, armLeftRelaxed: 0,
    thighRight: 0, thighLeft: 0,
    thighRightMedial: 0, thighLeftMedial: 0,
    legRight: 0, legLeft: 0
  },
  diameters: { wrist: 0, humerus: 0, femur: 0 },
  bia: {
    bodyFatPercent: 0, fatMass: 0, totalBodyWater: 0,
    leanMassWater: 0, hydrationIndex: 0,
    intracellularWaterPercent: 0, extracellularWaterPercent: 0,
    leanMass: 0, skeletalMuscleMass: 0, phaseAngle: 0
  },
  alcoholFreq: 'não',
  smokerFreq: 'não',
  exerciseFreq: 'não',
  exerciseType: '',
  sleepQuality: 'normal',
  reflux: false,
  insomnia: false,
  bowel: 'normal', 
  waterIntake: 2,
  medications: '',
  pathologies: '',
  allergies: '',
  aversions: '',
  clinicalSigns: {
    energyLevel: 'stable',
    dehydration: [],
    sleepStress: [],
    hair: [],
    nails: [],
    skin: [],
    giSymptoms: [],
    eatingBehavior: [],
    gestationalSymptoms: [],
    cycleSymptoms: [],
    infantObservations: [],
    redsSymptoms: [],
    neurodivergentSymptoms: []
  },
  history: []
};

const initialDietPlan: DailyPlan = {
  breakfast: { name: 'Desejum', time: '07:00', foods: [] },
  morningSnack: { name: 'Colação', time: '10:00', foods: [] },
  lunch: { name: 'Almoço', time: '13:00', foods: [] },
  afternoonSnack: { name: 'Lanche', time: '16:00', foods: [] },
  dinner: { name: 'Jantar', time: '19:00', foods: [] },
  supper: { name: 'Ceia', time: '22:00', foods: [] },
  observations: '',
  substitutionList: ''
};

const initialNewFood: Food = {
    id: '',
    name: '',
    group: 'Outros',
    baseUnit: '100g',
    householdUnit: '',
    householdWeight: 0,
    nutrients: {
        calories: 0,
        protein: 0,
        lipids: 0,
        carbs: 0,
        fiber: 0,
        calcium: 0,
        iron: 0,
        magnesium: 0,
        zinc: 0
    }
};

const PERIMETRY_LABELS: Record<string, string> = {
  deltoid: 'Deltóide',
  thoraxInap: 'Tórax (Inspirado)',
  thoraxExp: 'Tórax (Expirado)',
  abdomen: 'Abdômen',
  armRightContracted: 'Braço Dir. Contraído',
  armRightRelaxed: 'Braço Dir. Relaxado',
  armLeftContracted: 'Braço Esq. Contraído',
  armLeftRelaxed: 'Braço Esq. Relaxado',
  thighRight: 'Coxa Direita',
  thighLeft: 'Coxa Esquerda',
  thighRightMedial: 'Coxa Dir. Medial',
  thighLeftMedial: 'Coxa Esq. Medial',
  legRight: 'Perna Direita',
  legLeft: 'Perna Esquerda'
};

const getInitialLabs = (gender: Gender = 'female') => {
  // Combine generic functional labs with gender specific ones
  const allLabs = [...FUNCTIONAL_LABS_DATABASE];
  
  GENDER_SPECIFIC_LABS.forEach(spec => {
      const range = gender === 'male' ? spec.male : spec.female;
      allLabs.push({
          group: spec.group,
          name: spec.name,
          unit: spec.unit,
          min: range.min,
          max: range.max
      });
  });

  return allLabs.map(lab => ({
      name: lab.name,
      value: 0,
      unit: lab.unit,
      min: lab.min,
      max: lab.max,
      category: 'normal' as const,
      group: lab.group // Attach group for UI rendering
  }));
};

export default function App() {
  // --- STATES ---
  const [activeTab, setActiveTab] = useState('home');
  const [subTab, setSubTab] = useState('geral');
  const [dietSubTab, setDietSubTab] = useState('calculada');
  const [settingsSubTab, setSettingsSubTab] = useState('profile');
  const [registrationSubTab, setRegistrationSubTab] = useState('list');
  const [prescriptionSubTab, setPrescriptionSubTab] = useState<'recipes' | 'exams'>('recipes');
  
  const [patient, setPatient] = useState<PatientData>(initialPatient);
  const [savedPatients, setSavedPatients] = useState<PatientData[]>([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');

  // History Analytics Tab States
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyViewPatient, setHistoryViewPatient] = useState<PatientData | null>(null);

  const [nutritionist, setNutritionist] = useState<NutritionistProfile>(initialNutritionist);
  const [dietPlan, setDietPlan] = useState<DailyPlan>(initialDietPlan);
  const [recallPlan, setRecallPlan] = useState<DailyPlan>({ ...initialDietPlan, name: 'Recordatório' }); 
  const [foods, setFoods] = useState<Food[]>(FOOD_DATABASE);
  const [newFood, setNewFood] = useState<Food>(initialNewFood);
  const [searchTerm, setSearchTerm] = useState('');
  const [foodQuantity, setFoodQuantity] = useState<number>(1); 
  const [activeMealKey, setActiveMealKey] = useState<keyof DailyPlan | null>(null);
  const [labs, setLabs] = useState<(LabResult & {group?: string})[]>(getInitialLabs());
  const [prescription, setPrescription] = useState('');
  const [evolution, setEvolution] = useState('');
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  
  // Gemini AI States (General Clinical)
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Gemini AI States (Foco No Prato)
  const [focoInput, setFocoInput] = useState('');
  const [focoImage, setFocoImage] = useState<string | null>(null);
  const [focoResult, setFocoResult] = useState('');
  const [focoRecipes, setFocoRecipes] = useState<AiRecipe[]>([]); // New state for structured recipes
  const [isFocoLoading, setIsFocoLoading] = useState(false);
  const [focoPatientSearch, setFocoPatientSearch] = useState('');

  // Scheduling States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPatientName, setBookingPatientName] = useState('');
  
  // Settings - Date Blocking
  const [dateToBlock, setDateToBlock] = useState('');
  
  // Pending Appointment (for registration flow)
  const [pendingAppointment, setPendingAppointment] = useState<{date: string, time: string, name: string} | null>(null);
  
  // Appointment Interaction States
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Consultation Workflow
  const [isConsultationActive, setIsConsultationActive] = useState(false);
  
  // Diet Mode
  const [dietMeasureMode, setDietMeasureMode] = useState<'grams' | 'household'>('grams');
  const [dietModels, setDietModels] = useState<DietModel[]>([]);
  const [newModelName, setNewModelName] = useState('');
  const [editingModel, setEditingModel] = useState<DailyPlan | null>(null);

  // Substitution Lists Mode
  const [substitutionModels, setSubstitutionModels] = useState<SubstitutionListModel[]>([]);
  const [editingSubstitution, setEditingSubstitution] = useState<SubstitutionListModel>({ id: '', title: '', content: '' });

  // History Tab - Lab Analysis
  const [selectedHistoryExam, setSelectedHistoryExam] = useState<string>('');

  const results = calculateResults(patient);

  // Automatic Age Calculation
  useEffect(() => {
    if (patient.birthDate) {
      const calculatedAge = calculateAge(patient.birthDate);
      if (calculatedAge !== patient.age) {
        setPatient(prev => ({ ...prev, age: calculatedAge }));
      }
    }
  }, [patient.birthDate]);

  // Update Labs on Gender Change
  useEffect(() => {
      setLabs(prev => {
          const freshLabs = getInitialLabs(patient.gender);
          return freshLabs.map(fl => {
              const existing = prev.find(p => p.name === fl.name);
              return existing ? { ...fl, value: existing.value, category: existing.category } : fl;
          });
      });
  }, [patient.gender]);

  // --- ACTIONS ---

  const handlePrint = () => {
    window.print();
  };

  const handleAIAnalysis = async () => {
    if (!patient.pathologies && !patient.medications) {
        alert("Preencha patologias ou medicamentos para realizar a análise.");
        return;
    }
    
    setIsAnalyzing(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Atue como um nutricionista clínico especialista.
        Analise o seguinte quadro clínico do paciente:
        
        Patologias: ${patient.pathologies || 'Nenhuma relatada'}
        Medicamentos: ${patient.medications || 'Nenhum relatado'}

        Forneça um resumo conciso (máximo 150 palavras) e prático focando em:
        1. Interações droga-nutriente importantes.
        2. Efeitos colaterais que impactam o estado nutricional (ex: náusea, aumento de apetite, depleção de nutrientes).
        3. 3 recomendações dietéticas prioritárias para manejar esses quadros.
        
        Use formatação em tópicos HTML simples (<b>, <br>, <ul>, <li>) para facilitar a leitura.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        
        setAiAnalysis(response.text || "Sem resposta da IA.");
    } catch (error) {
        console.error("Erro na análise IA:", error);
        alert("Não foi possível realizar a análise no momento. Verifique a configuração da API.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  // --- FOCO NO PRATO (MAIS IA) ---
  
  const handleFocoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              const base64Data = base64String.split(',')[1];
              setFocoImage(base64Data);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleFocoGenerate = async () => {
      if (!focoInput && !focoImage) {
          alert("Por favor, descreva os ingredientes ou envie uma foto.");
          return;
      }

      setIsFocoLoading(true);
      setFocoRecipes([]);
      setFocoResult(''); // Clear previous results

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // Build Context from Patient Data
          const patientContext = `
          PACIENTE: ${patient.name}, ${patient.age} anos.
          OBJETIVO: ${patient.weightGoal === 'lose' ? 'Perda de Peso' : patient.weightGoal === 'gain' ? 'Ganho de Massa' : 'Manutenção'}.
          PATOLOGIAS: ${patient.pathologies || 'Nenhuma'}.
          ALERGIAS/AVERSÕES: ${patient.allergies || 'Nenhuma'} / ${patient.aversions || 'Nenhuma'}.
          VET CALCULADO: ${results.vet} kcal.
          `;

          const prompt = `
          Você é a "Mais", uma IA Nutricionista e Chef de Cozinha integrada ao sistema NUTRI+.
          
          CONTEXTO DO PACIENTE:
          ${patientContext}

          TAREFA:
          Com base nos ingredientes informados (texto ou imagem) e no contexto do paciente, sugira 3 RECEITAS PRÁTICAS e SAUDÁVEIS.
          
          INGREDIENTES DISPONÍVEIS: ${focoInput}
          (Se houver imagem, identifique os ingredientes nela também).

          FORMATO DE RESPOSTA (JSON STRICT):
          Você deve responder APENAS com um JSON contendo um array de objetos. Não use Markdown (nada de \`\`\`json).
          
          Estrutura do JSON:
          [
            {
              "title": "Nome da Receita",
              "helpText": "Explicação curta de por que essa receita ajuda no objetivo/patologia do paciente",
              "ingredients": ["ingrediente 1", "ingrediente 2"],
              "steps": ["passo 1", "passo 2"],
              "nutrition": "Resumo nutricional (ex: 300kcal, 20g Prot...)"
            },
            ...
          ]
          `;

          const contentParts: any[] = [{ text: prompt }];
          
          if (focoImage) {
              contentParts.push({
                  inlineData: {
                      mimeType: "image/jpeg",
                      data: focoImage
                  }
              });
          }

          // Use Pro model for image analysis capability or complex reasoning
          const modelName = focoImage ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

          const response = await ai.models.generateContent({
              model: modelName,
              contents: { parts: contentParts },
              config: { responseMimeType: "application/json" }
          });

          const textResponse = response.text || "[]";
          const recipes = JSON.parse(textResponse);
          setFocoRecipes(recipes);

      } catch (error) {
          console.error("Erro Foco no Prato:", error);
          setFocoResult("Erro ao gerar receitas. Tente novamente.");
      } finally {
          setIsFocoLoading(false);
      }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNutritionist(prev => ({...prev, logoUrl: reader.result as string}));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSavePatient = (silent: boolean = false) => {
      if (pendingAppointment) {
          const calculatedAge = calculateAge(patient.birthDate);
          const appId = Math.random().toString(36).substr(2, 9);
          const newApp: Appointment = {
              id: appId,
              date: pendingAppointment.date,
              time: pendingAppointment.time,
              patientName: patient.name,
              patientBirthDate: patient.birthDate,
              patientPhone: patient.phone,
              patientEmail: patient.email,
              patientAddress: patient.address,
              patientAge: calculatedAge,
              objective: patient.objective || 'Primeira Consulta',
              status: 'scheduled'
          };
          
          setAppointments(prev => [...prev, newApp]);
          setSavedPatients(prev => {
              const exists = prev.findIndex(p => p.id === patient.id);
              if (exists >= 0) {
                  const updated = [...prev];
                  updated[exists] = {...patient, age: calculatedAge};
                  return updated;
              }
              return [...prev, {...patient, age: calculatedAge}];
          });
          
          alert(`Paciente ${patient.name} cadastrado e agendamento confirmado para ${pendingAppointment.date} às ${pendingAppointment.time}!`);
          setPendingAppointment(null);
          setPatient({ ...initialPatient, id: Math.random().toString(36).substr(2, 9) });
          setActiveTab('schedule');
          setRegistrationSubTab('list');
          return;
      }

      setSavedPatients(prev => {
          const exists = prev.findIndex(p => p.id === patient.id);
          if (exists >= 0) {
              const updated = [...prev];
              updated[exists] = patient;
              return updated;
          }
          return [...prev, patient];
      });
      if (!silent) {
        setPatient({ ...initialPatient, id: Math.random().toString(36).substr(2, 9) });
        alert('Paciente salvo com sucesso! Formulário limpo para novo cadastro.');
      }
  };

  const loadPatient = (p: PatientData) => {
      setPatient(p);
      if(activeTab === 'registration') alert(`Paciente ${p.name} carregado.`);
  };

  const handleSaveNewFood = () => {
      if (!newFood.name.trim()) {
          alert("Por favor, insira o nome do alimento.");
          return;
      }
      const foodToAdd: Food = { ...newFood, id: `custom_${Date.now()}` };
      setFoods(prev => [...prev, foodToAdd]);
      setNewFood(initialNewFood);
      alert("Alimento cadastrado com sucesso!");
  };

  const handleExportFoods = () => {
    // CSV Header
    const headers = [
        "id", "name", "group", "baseUnit", "householdUnit", "householdWeight",
        "calories", "protein", "lipids", "carbs", "fiber",
        "calcium", "iron", "magnesium", "zinc"
    ];

    // Map foods to CSV rows
    const rows = foods.map(f => [
        f.id,
        `"${f.name.replace(/"/g, '""')}"`, // Escape quotes
        f.group || '',
        f.baseUnit,
        f.householdUnit || '',
        f.householdWeight || 0,
        f.nutrients.calories,
        f.nutrients.protein,
        f.nutrients.lipids,
        f.nutrients.carbs,
        f.nutrients.fiber,
        f.nutrients.calcium,
        f.nutrients.iron,
        f.nutrients.magnesium,
        f.nutrients.zinc
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "banco_alimentos_nutri_plus.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportFoods = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          const text = event.target?.result as string;
          if (!text) return;

          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          
          if (!headers.includes('name') || !headers.includes('calories')) {
              alert("Formato de arquivo inválido. Certifique-se de usar o modelo exportado.");
              return;
          }

          const newFoods: Food[] = [];
          
          for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              
              // Simple CSV parse handling quotes
              const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => val.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
              
              if (values.length < headers.length) continue;

              const getValue = (key: string) => {
                  const idx = headers.indexOf(key);
                  return idx !== -1 ? values[idx] : undefined;
              };

              const food: any = {
                  id: `imported_${Date.now()}_${i}`,
                  name: getValue('name'),
                  group: getValue('group') || 'Outros',
                  baseUnit: getValue('baseUnit') || '100g',
                  householdUnit: getValue('householdUnit') || '',
                  householdWeight: Number(getValue('householdWeight')) || 0,
                  nutrients: {
                      calories: Number(getValue('calories')) || 0,
                      protein: Number(getValue('protein')) || 0,
                      lipids: Number(getValue('lipids')) || 0,
                      carbs: Number(getValue('carbs')) || 0,
                      fiber: Number(getValue('fiber')) || 0,
                      calcium: Number(getValue('calcium')) || 0,
                      iron: Number(getValue('iron')) || 0,
                      magnesium: Number(getValue('magnesium')) || 0,
                      zinc: Number(getValue('zinc')) || 0,
                  }
              };
              if (food.name) newFoods.push(food);
          }

          if (newFoods.length > 0) {
              setFoods(prev => [...prev, ...newFoods]);
              alert(`${newFoods.length} alimentos importados com sucesso!`);
          } else {
              alert("Nenhum alimento válido encontrado para importação.");
          }
      };
      reader.readAsText(file);
      e.target.value = ''; 
  };

  const addFoodToMeal = (food: Food) => {
    if (registrationSubTab === 'models' && editingModel && activeMealKey) {
        const qty = foodQuantity;
        const nutrients = calculateNutrients(food, qty, dietMeasureMode);
        const newEntry: FoodEntry = {
            foodId: food.id,
            foodName: food.name,
            measureType: dietMeasureMode,
            quantity: qty,
            unitLabel: dietMeasureMode === 'household' && food.householdUnit ? food.householdUnit : 'g',
            grams: dietMeasureMode === 'household' && food.householdWeight ? food.householdWeight * qty : qty,
            calculated: nutrients
        };
        const meal = editingModel[activeMealKey] as Meal;
        setEditingModel({
            ...editingModel,
            [activeMealKey]: { ...meal, foods: [...meal.foods, newEntry] }
        });
        return;
    }

    if (!activeMealKey || activeMealKey === 'observations' || activeMealKey === 'substitutionList') return;
    
    const qty = foodQuantity; 
    const nutrients = calculateNutrients(food, qty, dietMeasureMode);
    
    const newEntry: FoodEntry = {
      foodId: food.id,
      foodName: food.name,
      measureType: dietMeasureMode,
      quantity: qty,
      unitLabel: dietMeasureMode === 'household' && food.householdUnit ? food.householdUnit : 'g',
      grams: dietMeasureMode === 'household' && food.householdWeight ? food.householdWeight * qty : qty,
      calculated: nutrients
    };

    if (dietSubTab === 'recordatorio') {
        setRecallPlan(prev => {
            const meal = prev[activeMealKey] as Meal;
            return { ...prev, [activeMealKey]: { ...meal, foods: [...meal.foods, newEntry] } };
        });
    } else {
        setDietPlan(prev => {
            const meal = prev[activeMealKey] as Meal;
            return { ...prev, [activeMealKey]: { ...meal, foods: [...meal.foods, newEntry] } };
        });
    }
  };

  const removeFoodFromMeal = (mealKey: keyof DailyPlan, index: number, isRecall: boolean = false, isModel: boolean = false) => {
    if (mealKey === 'observations' || mealKey === 'substitutionList') return;
    if (isModel && editingModel) {
        const meal = editingModel[mealKey] as Meal;
        const newFoods = [...meal.foods];
        newFoods.splice(index, 1);
        setEditingModel({...editingModel, [mealKey]: {...meal, foods: newFoods}});
        return;
    }
    const updateFn = isRecall ? setRecallPlan : setDietPlan;
    updateFn(prev => {
       const meal = prev[mealKey] as Meal;
       const newFoods = [...meal.foods];
       newFoods.splice(index, 1);
       return { ...prev, [mealKey]: { ...meal, foods: newFoods } };
    });
  };

  const generateSlots = () => {
    const isDateBlocked = nutritionist.schedule.blockedDates.includes(selectedDate);
    if (isDateBlocked) return [];
    const slots = [];
    const [startH, startM] = nutritionist.schedule.startHour.split(':').map(Number);
    const [endH, endM] = nutritionist.schedule.endHour.split(':').map(Number);
    let current = new Date();
    current.setHours(startH, startM, 0, 0);
    const end = new Date();
    end.setHours(endH, endM, 0, 0);
    while (current < end) {
        const timeStr = current.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        if (!nutritionist.schedule.blockedTimes.includes(timeStr)) {
            slots.push(timeStr);
        }
        current.setMinutes(current.getMinutes() + nutritionist.schedule.slotDuration);
    }
    return slots;
  };
  
  const generateSettingsSlots = () => {
    const slots = [];
    const [startH, startM] = nutritionist.schedule.startHour.split(':').map(Number);
    const [endH, endM] = nutritionist.schedule.endHour.split(':').map(Number);
    let current = new Date();
    current.setHours(startH, startM, 0, 0);
    const end = new Date();
    end.setHours(endH, endM, 0, 0);
    while (current < end) {
        slots.push(current.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        current.setMinutes(current.getMinutes() + nutritionist.schedule.slotDuration);
    }
    return slots;
  };

  const handleSlotClick = (time: string) => {
      if (isRescheduling && selectedAppointment) {
          if(confirm(`Reagendar ${selectedAppointment.patientName} para ${selectedDate} às ${time}?`)) {
              setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? { ...a, date: selectedDate, time } : a));
              setIsRescheduling(false);
              setSelectedAppointment(null);
          }
          return;
      }
      setSelectedTimeSlot(time);
      setIsBookingModalOpen(true);
  };

  const handleAppointmentClick = (app: Appointment) => {
      setSelectedAppointment(app);
      setIsActionModalOpen(true);
  };

  const confirmBooking = () => {
    if (selectedDate && selectedTimeSlot && bookingPatientName) {
        const existing = savedPatients.find(p => p.name.toLowerCase() === bookingPatientName.toLowerCase());
        if (!existing) {
             alert("Paciente não encontrado no banco de dados. Utilize a opção 'Cadastrar Novo Paciente' para realizar o cadastro.");
             return;
        }
        const newApp: Appointment = {
            id: Math.random().toString(36).substr(2, 9),
            date: selectedDate,
            time: selectedTimeSlot,
            patientName: bookingPatientName,
            patientBirthDate: existing.birthDate,
            patientPhone: existing.phone,
            patientEmail: existing.email,
            patientAddress: existing.address,
            patientAge: existing.age,
            objective: existing.objective || 'Consulta de Rotina',
            status: 'scheduled'
        };
        setAppointments([...appointments, newApp]);
        setIsBookingModalOpen(false);
        setBookingPatientName('');
        setSelectedTimeSlot(null);
    }
  };

  const startConsultation = (app: Appointment) => {
      const existing = savedPatients.find(p => p.name.toLowerCase() === app.patientName.toLowerCase());
      const sessionPatient: PatientData = existing ? { ...existing } : {
          ...initialPatient,
          name: app.patientName,
          age: app.patientAge,
          birthDate: app.patientBirthDate,
          email: app.patientEmail,
          phone: app.patientPhone,
          address: app.patientAddress,
          objective: app.objective
      };
      setPatient(sessionPatient);
      setIsConsultationActive(true);
      setActiveTab('assessment');
      setIsActionModalOpen(false);
  };

  const sendWhatsApp = (app: Appointment, type: 'appointment' | 'rescheduling' | 'return' = 'appointment') => {
      const phone = app.patientPhone.replace(/\D/g, '');
      if (!phone) {
          alert("Paciente sem telefone cadastrado.");
          return;
      }
      let template = nutritionist.whatsappMessages[type];
      
      // Replace placeholders
      template = template.replace(/{PACIENTE}/g, app.patientName);
      template = template.replace(/{DATA}/g, app.date);
      template = template.replace(/{HORA}/g, app.time);
      template = template.replace(/{NUTRICIONISTA}/g, nutritionist.name);

      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(template)}`, '_blank');
  };

  const saveConsultationHistory = () => {
      const newHistory: HistoryRecord = {
          date: new Date().toISOString().split('T')[0],
          weight: patient.weight,
          bodyFat: results.bodyFatPercent,
          leanMass: results.leanMass,
          fatMass: results.fatMass,
          tricepsFold: patient.tricepsFold,
          labs: labs.map(l => ({ name: l.name, value: l.value })).filter(l => l.value > 0),
          notes: evolution
      };
      const updatedPatient = {
          ...patient,
          history: [...patient.history, newHistory]
      };
      setPatient(updatedPatient);
      setSavedPatients(prev => {
        const idx = prev.findIndex(p => p.id === updatedPatient.id);
        if (idx >= 0) {
            const arr = [...prev];
            arr[idx] = updatedPatient;
            return arr;
        }
        return [...prev, updatedPatient];
      });
      alert("Atendimento salvo no histórico com sucesso!");
      setIsConsultationActive(false);
      setActiveTab('schedule');
  };

  const handleLabChange = (index: number, field: string, value: string) => {
    const newLabs = [...labs];
    if (field === 'value') {
      const numValue = Number(value);
      newLabs[index] = { ...newLabs[index], value: numValue };
      if (newLabs[index].min !== 0 || newLabs[index].max !== 0) {
        if (numValue < newLabs[index].min) newLabs[index].category = 'low';
        else if (numValue > newLabs[index].max) newLabs[index].category = 'high';
        else newLabs[index].category = 'normal';
      }
    }
    setLabs(newLabs);
  };

  const saveDietModel = () => {
    if (!newModelName.trim() || !editingModel) return;
    const model: DietModel = {
      id: Math.random().toString(36).substr(2, 9),
      name: newModelName,
      plan: JSON.parse(JSON.stringify(editingModel))
    };
    setDietModels([...dietModels, model]);
    setNewModelName('');
    setEditingModel(null);
    setRegistrationSubTab('models');
  };

  const startNewModel = () => {
      setEditingModel(JSON.parse(JSON.stringify(initialDietPlan)));
  };

  const saveSubstitutionModel = () => {
      if(!editingSubstitution.title || !editingSubstitution.content) return;
      const newModel = { ...editingSubstitution, id: Math.random().toString(36).substr(2, 9) };
      setSubstitutionModels([...substitutionModels, newModel]);
      setEditingSubstitution({ id: '', title: '', content: '' });
  };

  const importSubstitutionToDiet = (modelId: string) => {
      const model = substitutionModels.find(m => m.id === modelId);
      if (model) setDietPlan({...dietPlan, substitutionList: model.content});
  }

  const toggleBlockedTime = (time: string) => {
      const currentBlocked = nutritionist.schedule.blockedTimes || [];
      const blocked = currentBlocked.includes(time);
      const newBlocked = blocked ? (currentBlocked as string[]).filter(t => t !== time) : [...currentBlocked, time];
      setNutritionist({...nutritionist, schedule: {...nutritionist.schedule, blockedTimes: newBlocked}});
  };

  const addBlockedDate = () => {
      if (dateToBlock && !nutritionist.schedule.blockedDates.includes(dateToBlock)) {
          setNutritionist({
              ...nutritionist,
              schedule: { ...nutritionist.schedule, blockedDates: [...nutritionist.schedule.blockedDates, dateToBlock] }
          });
          setDateToBlock('');
      }
  };

  const removeBlockedDate = (date: string) => {
      setNutritionist({
          ...nutritionist,
          schedule: { ...nutritionist.schedule, blockedDates: nutritionist.schedule.blockedDates.filter(d => d !== date) }
      });
  };

  const toggleMultiSelect = (category: keyof PatientData['clinicalSigns'], value: string) => {
      const list = patient.clinicalSigns[category];
      if (Array.isArray(list)) {
          const newList = list.includes(value) ? list.filter((i: string) => i !== value) : [...list, value];
          setPatient(prev => ({
              ...prev, 
              clinicalSigns: { ...prev.clinicalSigns, [category]: newList } as PatientData['clinicalSigns']
          }));
      }
  };

  // --- RENDERERS ---

  const renderHome = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                      <Sparkles size={14} /> Sistema Integrado V5.0 - Agora com IA
                  </div>
                  <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                      Revolucione seus <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Atendimentos Nutricionais</span>
                  </h1>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                      O <b>NUTRI+ Pro</b> centraliza anamnese, avaliação antropométrica, planejamento alimentar e gestão de consultório em uma única plataforma inteligente. 
                      Agora com <b>"Foco No Prato"</b> e análise clínica potencializada por IA.
                  </p>
                  <button 
                      onClick={() => setActiveTab('schedule')}
                      className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 flex items-center gap-3 transition-all hover:scale-105"
                  >
                      <Rocket size={24} /> Acessar o Sistema
                  </button>
              </div>
              
              {/* Decorative Background Elements */}
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <Activity size={400} className="absolute -right-20 -top-20 text-white transform rotate-12" />
              </div>
          </div>

          {/* Value Props / Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  {
                      icon: ChefHat, color: "text-orange-600", bg: "bg-orange-50",
                      title: "Foco No Prato (IA)",
                      desc: "Geração automática de receitas personalizadas baseadas nos ingredientes do paciente e suas restrições clínicas."
                  },
                  {
                      icon: Brain, color: "text-purple-600", bg: "bg-purple-50",
                      title: "Anamnese com IA",
                      desc: "Inteligência Artificial Gemini integrada para analisar interações droga-nutriente e sugerir condutas."
                  },
                  {
                      icon: Utensils, color: "text-emerald-600", bg: "bg-emerald-50",
                      title: "Cálculos Automáticos",
                      desc: "VET, TMB, Macro e Micronutrientes calculados instantaneamente com base na TACO e IBGE."
                  },
                  {
                      icon: FlaskConical, color: "text-amber-600", bg: "bg-amber-50",
                      title: "Exames Funcionais",
                      desc: "Interpretação automática de exames laboratoriais com valores de referência da nutrição funcional."
                  },
                  {
                      icon: LayoutDashboard, color: "text-indigo-600", bg: "bg-indigo-50",
                      title: "Gestão Inteligente",
                      desc: "Dashboard completo, agendamento, mensagens automáticas para WhatsApp e controle financeiro."
                  },
                  {
                      icon: Printer, color: "text-slate-600", bg: "bg-slate-50",
                      title: "Documentos Prontos",
                      desc: "Gere PDFs profissionais de receitas, pedidos de exames e planos alimentares com sua logo."
                  }
              ].map((feature, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                          <feature.icon size={24} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderDashboard = () => (
      <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Administrativo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Users size={32} />
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-slate-800">{savedPatients.length}</div>
                      <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Pacientes Ativos</div>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <FileText size={32} />
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-slate-800">{dietModels.length}</div>
                      <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Modelos de Dieta</div>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <Calendar size={32} />
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-slate-800">{appointments.filter(a => a.status === 'scheduled').length}</div>
                      <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Consultas Agendadas</div>
                  </div>
              </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 py-20">
              <BarChart2 size={48} className="mx-auto mb-4 opacity-20" />
              <p>Gráficos e métricas detalhadas estarão disponíveis aqui.</p>
          </div>
      </div>
  );

  const renderHistoryAnalytics = () => (
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <Search size={20} className="text-emerald-600"/> Buscar Histórico do Paciente
              </h3>
              
              <div className="relative mb-6">
                  <input 
                      type="text" 
                      placeholder="Digite o nome do paciente..." 
                      value={historySearchTerm} 
                      onChange={e => setHistorySearchTerm(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                  {historySearchTerm && (
                      <button onClick={() => setHistorySearchTerm('')} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                          <X size={18}/>
                      </button>
                  )}
              </div>

              {!historyViewPatient ? (
                  <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Resultados da Busca</h4>
                      {savedPatients.filter(p => p.name.toLowerCase().includes(historySearchTerm.toLowerCase())).map(p => (
                          <div 
                              key={p.id} 
                              onClick={() => setHistoryViewPatient(p)}
                              className="flex justify-between items-center p-4 border rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors group"
                          >
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-emerald-200 group-hover:text-emerald-800">
                                      <User size={20}/>
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-700 group-hover:text-emerald-800">{p.name}</p>
                                      <p className="text-xs text-slate-500">{p.email || 'Sem email'} • {p.age} anos</p>
                                  </div>
                              </div>
                              <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500"/>
                          </div>
                      ))}
                      {savedPatients.length === 0 && <div className="text-center py-8 text-slate-400">Nenhum paciente cadastrado.</div>}
                  </div>
              ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                      <div className="flex items-center gap-4 mb-6">
                          <button onClick={() => setHistoryViewPatient(null)} className="p-2 hover:bg-slate-100 rounded-full">
                              <ArrowRight className="rotate-180" size={20}/>
                          </button>
                          <div>
                              <h2 className="text-2xl font-bold text-slate-800">{historyViewPatient.name}</h2>
                              <p className="text-sm text-slate-500">Histórico Completo de Evolução</p>
                          </div>
                      </div>

                      {historyViewPatient.history.length > 0 ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                     <h4 className="font-bold text-slate-700 mb-4">Peso e Composição Corporal</h4>
                                     <div className="h-48 w-full flex items-end">
                                        <svg viewBox="0 0 300 150" className="w-full h-full">
                                            <path d={generateChartPath(historyViewPatient.history.map(h => h.weight), 300, 150)} fill="none" stroke="#10b981" strokeWidth="2" />
                                        </svg>
                                     </div>
                                     <div className="text-xs text-center text-slate-500 mt-2 font-medium">Evolução do Peso (kg)</div>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                     <h4 className="font-bold text-slate-700 mb-4">Gordura Corporal (%)</h4>
                                     <div className="h-48 w-full flex items-end">
                                        <svg viewBox="0 0 300 150" className="w-full h-full">
                                            <path d={generateChartPath(historyViewPatient.history.map(h => h.bodyFat), 300, 150)} fill="none" stroke="#f59e0b" strokeWidth="2" />
                                        </svg>
                                     </div>
                                     <div className="text-xs text-center text-slate-500 mt-2 font-medium">Evolução % Gordura</div>
                                </div>
                            </div>

                            {/* Lab Evolution Chart */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><FlaskConical size={18}/> Análise de Evolução Laboratorial</h4>
                                
                                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <label className="text-xs font-bold text-blue-800 mb-2 block uppercase tracking-wide">Selecione o Exame para Comparar:</label>
                                    <select 
                                        className="border-blue-200 rounded-lg p-2 text-sm w-full md:w-1/3 bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                                        onChange={(e) => setSelectedHistoryExam(e.target.value)}
                                        value={selectedHistoryExam}
                                    >
                                        <option value="">Selecione na lista...</option>
                                        {Array.from(new Set(historyViewPatient.history.flatMap(h => h.labs ? h.labs.map(l => l.name) : []))).map(examName => (
                                            <option key={examName} value={examName}>{examName}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedHistoryExam && (
                                    <div className="space-y-6 animate-in fade-in">
                                        {(() => {
                                            const examData = historyViewPatient.history
                                                .filter(h => h.labs?.some(l => l.name === selectedHistoryExam))
                                                .map(h => ({
                                                    date: h.date,
                                                    value: h.labs!.find(l => l.name === selectedHistoryExam)!.value
                                                }));
                                            
                                            // Find reference
                                            const ref = [...FUNCTIONAL_LABS_DATABASE, ...GENDER_SPECIFIC_LABS.map(g => ({
                                                name: g.name, 
                                                min: historyViewPatient.gender === 'male' ? g.male.min : g.female.min,
                                                max: historyViewPatient.gender === 'male' ? g.male.max : g.female.max,
                                                unit: g.unit
                                            }))].find(r => r.name === selectedHistoryExam);

                                            return (
                                                <>
                                                    <div className="h-64 w-full bg-slate-50 rounded-xl relative flex items-end p-6 border border-slate-200">
                                                        {/* Reference Lines */}
                                                        {ref && (
                                                            <>
                                                                <div className="absolute left-0 right-0 border-t border-dashed border-green-300 w-full" style={{bottom: '30%'}}></div>
                                                                <div className="absolute left-0 right-0 border-t border-dashed border-green-300 w-full" style={{bottom: '70%'}}></div>
                                                                <span className="absolute right-2 text-[10px] text-green-600 bg-green-50 px-1 rounded" style={{bottom: '30%'}}>Min: {ref.min}</span>
                                                                <span className="absolute right-2 text-[10px] text-green-600 bg-green-50 px-1 rounded" style={{bottom: '70%'}}>Max: {ref.max}</span>
                                                            </>
                                                        )}
                                                        <svg viewBox="0 0 300 150" className="w-full h-full z-10">
                                                            <path d={generateChartPath(examData.map(d => d.value), 300, 150)} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                    
                                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                                        <table className="w-full text-sm text-left">
                                                            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold">
                                                                <tr>
                                                                    <th className="px-6 py-3">Data</th>
                                                                    <th className="px-6 py-3">Resultado</th>
                                                                    <th className="px-6 py-3">Ref. Ideal</th>
                                                                    <th className="px-6 py-3">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                                {examData.map((d, i) => {
                                                                    let status = 'Normal';
                                                                    let statusColor = 'text-green-600 bg-green-50';
                                                                    if (ref) {
                                                                        if (d.value < ref.min) { status = 'Baixo'; statusColor = 'text-yellow-600 bg-yellow-50'; }
                                                                        if (d.value > ref.max) { status = 'Alto'; statusColor = 'text-red-600 bg-red-50'; }
                                                                    }
                                                                    return (
                                                                        <tr key={i} className="hover:bg-slate-50">
                                                                            <td className="px-6 py-3 text-slate-600">{d.date}</td>
                                                                            <td className="px-6 py-3 font-bold text-slate-800">{d.value} <span className="text-xs font-normal text-slate-400">{ref?.unit}</span></td>
                                                                            <td className="px-6 py-3 text-slate-500">{ref ? `${ref.min} - ${ref.max}` : '-'}</td>
                                                                            <td className="px-6 py-3">
                                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor}`}>{status}</span>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                          </>
                      ) : (
                          <div className="text-center text-slate-400 py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                              <BarChart2 size={48} className="mx-auto mb-4 opacity-20"/>
                              <p>Este paciente ainda não possui histórico de atendimentos registrado.</p>
                          </div>
                      )}
                  </div>
              )}
          </div>
      </div>
  );

  const renderFocoNoPrato = () => (
      <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 rounded-3xl text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <ChefHat size={32} /> Foco No Prato
              </h2>
              <p className="text-orange-100 text-lg max-w-2xl">
                  Utilize a inteligência artificial <b>"Mais"</b> para transformar ingredientes disponíveis em receitas práticas, saudáveis e 100% personalizadas para o seu paciente.
              </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                  {/* PATIENT SELECTION FOR CONTEXT */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <User size={20} className="text-orange-500"/> Selecionar Paciente
                      </h3>
                      <div className="relative">
                          <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-200">
                              <Search size={18} className="text-slate-400 mr-2"/>
                              <input 
                                  type="text" 
                                  placeholder="Buscar paciente cadastrado..." 
                                  value={focoPatientSearch}
                                  onChange={e => setFocoPatientSearch(e.target.value)}
                                  className="w-full outline-none text-sm"
                              />
                          </div>
                          {focoPatientSearch && (
                              <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 rounded-xl mt-2 shadow-lg z-20 max-h-48 overflow-y-auto">
                                  {savedPatients.filter(p => p.name.toLowerCase().includes(focoPatientSearch.toLowerCase())).map(p => (
                                      <button 
                                          key={p.id} 
                                          onClick={() => {
                                              setPatient(p);
                                              setFocoPatientSearch('');
                                          }}
                                          className="w-full text-left px-4 py-3 hover:bg-orange-50 text-sm text-slate-700 flex justify-between items-center transition-colors"
                                      >
                                          <span>{p.name}</span>
                                          <span className="text-xs text-orange-500 font-bold">Selecionar</span>
                                      </button>
                                  ))}
                                  {savedPatients.filter(p => p.name.toLowerCase().includes(focoPatientSearch.toLowerCase())).length === 0 && (
                                      <div className="p-3 text-xs text-slate-400 text-center">Nenhum paciente encontrado.</div>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <Search size={20} className="text-orange-500"/> O que tem na geladeira?
                      </h3>
                      
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-600 mb-2">Descreva os ingredientes disponíveis:</label>
                              <textarea 
                                  value={focoInput}
                                  onChange={e => setFocoInput(e.target.value)}
                                  className="w-full h-32 p-3 border rounded-xl text-sm focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                                  placeholder="Ex: Tenho 3 ovos, espinafre, batata doce e frango desfiado..."
                              />
                          </div>

                          <div className="relative">
                              <div className="flex items-center gap-4">
                                  <div className="flex-1 h-px bg-slate-200"></div>
                                  <span className="text-xs text-slate-400 font-bold">OU ENVIE UMA FOTO</span>
                                  <div className="flex-1 h-px bg-slate-200"></div>
                              </div>
                          </div>

                          <div className="flex justify-center">
                              <label className="cursor-pointer w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                                  {focoImage ? (
                                      <div className="relative w-full h-40">
                                          <img src={`data:image/jpeg;base64,${focoImage}`} alt="Preview" className="w-full h-full object-contain rounded-lg"/>
                                          <button 
                                              onClick={(e) => { e.preventDefault(); setFocoImage(null); }}
                                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                          >
                                              <X size={16}/>
                                          </button>
                                      </div>
                                  ) : (
                                      <>
                                          <Camera size={32} className="text-slate-400 mb-2"/>
                                          <span className="text-sm text-slate-500 font-medium">Clique para tirar foto ou fazer upload</span>
                                          <input type="file" accept="image/*" className="hidden" onChange={handleFocoImageUpload} />
                                      </>
                                  )}
                              </label>
                          </div>

                          <button 
                              onClick={handleFocoGenerate}
                              disabled={isFocoLoading || (!focoInput && !focoImage)}
                              className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                              {isFocoLoading ? <Loader2 size={24} className="animate-spin"/> : <Sparkles size={24}/>}
                              Gerar Receitas com IA
                          </button>
                      </div>
                  </div>

                  {patient.name && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                          <Brain size={20} className="text-blue-600 mt-1 shrink-0"/>
                          <div>
                              <p className="font-bold text-blue-800 text-sm">Contexto Ativo: {patient.name}</p>
                              <p className="text-xs text-blue-700 mt-1">
                                  A IA irá considerar: {patient.weightGoal === 'lose' ? 'Perda de Peso' : 'Ganho de Massa'}, 
                                  {patient.pathologies ? ` Patologias (${patient.pathologies}),` : ''} 
                                  {patient.allergies ? ` Alergias (${patient.allergies})` : ''}.
                              </p>
                          </div>
                      </div>
                  )}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full min-h-[500px]">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <ChefHat size={20} className="text-orange-500"/> Sugestões da Chef "Mais"
                  </h3>
                  
                  {focoRecipes.length > 0 ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                          {focoRecipes.map((recipe, index) => (
                              <div key={index} className="bg-orange-50 border border-orange-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start mb-3">
                                      <h4 className="text-lg font-bold text-orange-800">{recipe.title}</h4>
                                      <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded-full border border-orange-200">
                                          #{index + 1}
                                      </span>
                                  </div>
                                  
                                  <div className="bg-white/50 p-3 rounded-lg border border-orange-100 mb-4">
                                      <p className="text-sm text-orange-900 italic flex gap-2">
                                          <Lightbulb size={16} className="shrink-0 mt-0.5"/> {recipe.helpText}
                                      </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                          <p className="font-bold text-orange-800 mb-1">Ingredientes:</p>
                                          <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                                              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                          </ul>
                                      </div>
                                      <div>
                                          <p className="font-bold text-orange-800 mb-1">Nutrição:</p>
                                          <p className="text-slate-700 bg-white p-2 rounded border border-orange-100">{recipe.nutrition}</p>
                                      </div>
                                  </div>

                                  <div className="mt-4 pt-4 border-t border-orange-200">
                                      <p className="font-bold text-orange-800 mb-1">Modo de Preparo:</p>
                                      <ol className="list-decimal list-inside text-slate-700 space-y-1 text-sm">
                                          {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                                      </ol>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                          <Utensils size={48} className="mb-4 opacity-20"/>
                          <p>As receitas geradas aparecerão aqui.</p>
                          <p className="text-xs mt-2">Personalizadas para o perfil clínico do seu paciente.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  const renderSidebar = () => (
    <aside className="w-64 text-white min-h-screen fixed left-0 top-0 overflow-y-auto no-print z-10" style={{backgroundColor: nutritionist.theme.primaryColor}}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {nutritionist.logoUrl ? <img src={nutritionist.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Activity className="text-emerald-700" />}
            </div>
            <h1 className="font-bold text-lg leading-tight">NUTRI+<br/><span className="text-emerald-400 text-xs font-normal">Pro System</span></h1>
        </div>
        
        <nav className="space-y-2">
          {[
            {id: 'home', icon: LayoutDashboard, label: 'Início'},
            {id: 'dashboard', icon: BarChart2, label: 'Dashboard'},
            {id: 'schedule', icon: Calendar, label: 'Agendamento'},
            {id: 'registration', icon: UserPlus, label: 'Cadastro'},
            {id: 'assessment', icon: Activity, label: 'Avaliação'},
            {id: 'diet', icon: Utensils, label: 'Alimentação'},
            {id: 'focoNoPrato', icon: ChefHat, label: 'Foco No Prato'},
            {id: 'prescription', icon: ClipboardList, label: 'Prescrição'}, // Merged Tab
            {id: 'history', icon: Clock, label: 'Evolução'},
            {id: 'historyAnalytics', icon: TrendingUp, label: 'Histórico Pacientes'},
            {id: 'settings', icon: Settings, label: 'Configurações'}
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10 text-slate-100'}`}>
                <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        {isConsultationActive && (
            <div className="mt-8 p-4 bg-emerald-900/50 rounded-xl border border-emerald-500/30">
                <p className="text-xs text-emerald-300 font-bold mb-2 uppercase tracking-wide">Em Atendimento</p>
                <p className="font-semibold text-white">{patient.name}</p>
                <button onClick={() => setIsConsultationActive(false)} className="mt-3 w-full py-1 text-xs bg-red-500/20 text-red-300 hover:bg-red-500/40 rounded">Cancelar Sessão</button>
            </div>
        )}
      </div>
      <div className="p-6 mt-auto border-t border-white/20">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><User size={20} /></div>
            <div><p className="text-sm font-medium">{nutritionist.name}</p><p className="text-xs text-slate-300">{nutritionist.crn}</p></div>
        </div>
      </div>
    </aside>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
        {isRescheduling && selectedAppointment && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                    <RefreshCw className="text-amber-600" />
                    <div>
                        <p className="font-bold text-amber-800">Modo Reagendamento Ativo</p>
                        <p className="text-sm text-amber-700">Selecione uma nova data e horário para <span className="font-bold">{selectedAppointment.patientName}</span></p>
                    </div>
                </div>
                <button 
                    onClick={() => { setIsRescheduling(false); setSelectedAppointment(null); }}
                    className="px-4 py-2 bg-white text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100"
                >
                    Cancelar Reagendamento
                </button>
            </div>
        )}

        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
                 <h2 className="text-xl font-bold text-slate-800">Agendamento</h2>
            </div>
            <div className="flex items-center gap-4">
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)} 
                    className={`border rounded p-2 text-sm ${isRescheduling ? 'ring-2 ring-amber-400 border-amber-400' : ''}`} 
                />
                <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">Hoje</button>
            </div>
        </div>

        {nutritionist.schedule.blockedDates.includes(selectedDate) ? (
             <div className="bg-red-50 border border-red-200 p-10 rounded-xl flex flex-col items-center justify-center text-red-800">
                 <CalendarX size={48} className="mb-4 text-red-400"/>
                 <h3 className="text-lg font-bold">Data Bloqueada</h3>
                 <p>Não há atendimentos disponíveis para este dia.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {generateSlots().map(time => {
                    const app = appointments.find(a => a.date === selectedDate && a.time === time);
                    return (
                        <div 
                            key={time} 
                            onClick={() => app ? handleAppointmentClick(app) : handleSlotClick(time)}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                                app 
                                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                                : isRescheduling 
                                    ? 'bg-amber-50 border-amber-300 hover:bg-amber-100 ring-2 ring-amber-100 scale-105 shadow-md' 
                                    : 'bg-white border-slate-100 hover:border-emerald-300 hover:shadow-md'
                            }`}
                        >
                            <span className="text-lg font-bold text-slate-700">{time}</span>
                            {app ? (
                                <div className="text-center mt-2">
                                    <p className="text-sm font-medium text-blue-800">{app.patientName}</p>
                                    <span className="text-xs text-blue-600">{app.status}</span>
                                </div>
                            ) : (
                                <span className={`text-xs mt-2 ${isRescheduling ? 'text-amber-700 font-bold uppercase tracking-wider' : 'text-emerald-600'}`}>
                                    {isRescheduling ? 'Confirmar Aqui' : 'Disponível'}
                                </span>
                            )}
                        </div>
                    );
                })}
                {generateSlots().length === 0 && (
                    <div className="col-span-4 text-center py-10 text-slate-500">
                        Nenhum horário disponível para este dia.
                    </div>
                )}
            </div>
        )}

        {isActionModalOpen && selectedAppointment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                    <h3 className="text-lg font-bold mb-1">{selectedAppointment.patientName}</h3>
                    <p className="text-sm text-slate-500 mb-6">{selectedAppointment.date} às {selectedAppointment.time}</p>
                    
                    <div className="space-y-3">
                        <button onClick={() => startConsultation(selectedAppointment)} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-700">
                            <Activity size={18}/> Iniciar Atendimento
                        </button>
                        <button onClick={() => sendWhatsApp(selectedAppointment, 'appointment')} className="w-full py-3 bg-green-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-600">
                            <MessageCircle size={18}/> Enviar WhatsApp
                        </button>
                        <button onClick={() => { setIsRescheduling(true); setIsActionModalOpen(false); }} className="w-full py-3 bg-amber-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-amber-600">
                            <RefreshCw size={18}/> Reagendar
                        </button>
                        <button onClick={() => setIsActionModalOpen(false)} className="w-full py-2 text-slate-500 hover:bg-slate-50 rounded-lg">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {isBookingModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-2xl w-[500px]">
                    <h3 className="text-xl font-bold mb-1">Novo Agendamento</h3>
                    <p className="text-sm text-slate-500 mb-6">{selectedDate} às {selectedTimeSlot}</p>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <Search size={16} className="text-emerald-600"/> Buscar Paciente
                            </h4>
                            
                            <div className="relative mb-3">
                                <input 
                                    type="text" 
                                    placeholder="Digite o nome..." 
                                    value={bookingPatientName}
                                    onChange={e => setBookingPatientName(e.target.value)}
                                    className="w-full border rounded-lg p-2 text-sm pl-9"
                                />
                                 <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                            </div>

                            {bookingPatientName.length > 0 && (
                                <div className="max-h-32 overflow-y-auto border rounded-lg bg-white mb-3">
                                    {savedPatients.filter(p => p.name.toLowerCase().includes(bookingPatientName.toLowerCase())).map(p => (
                                        <div 
                                            key={p.id}
                                            onClick={() => setBookingPatientName(p.name)}
                                            className="p-2 hover:bg-emerald-50 cursor-pointer text-sm border-b last:border-0"
                                        >
                                            {p.name}
                                        </div>
                                    ))}
                                    {savedPatients.filter(p => p.name.toLowerCase().includes(bookingPatientName.toLowerCase())).length === 0 && (
                                        <div className="p-2 text-xs text-slate-400 text-center">Nenhum encontrado</div>
                                    )}
                                </div>
                            )}
                            
                            <button 
                                onClick={confirmBooking} 
                                disabled={!bookingPatientName}
                                className="w-full py-2 bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirmar Agendamento
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-px bg-slate-200 flex-1"></div>
                            <span className="text-xs text-slate-400 font-medium">OU</span>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <button 
                            onClick={() => {
                                setPendingAppointment({
                                    date: selectedDate,
                                    time: selectedTimeSlot!,
                                    name: ''
                                });
                                setPatient({
                                    ...initialPatient,
                                    id: Math.random().toString(36).substr(2, 9)
                                });
                                setActiveTab('registration');
                                setRegistrationSubTab('list');
                                setIsBookingModalOpen(false);
                                setBookingPatientName('');
                            }}
                            className="w-full py-3 border-2 border-dashed border-emerald-300 bg-emerald-50 text-emerald-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
                        >
                            <UserPlus size={18} /> Cadastrar Novo Paciente
                        </button>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <button onClick={() => { setIsBookingModalOpen(false); setBookingPatientName(''); }} className="text-sm text-slate-500 hover:text-slate-800 underline">Cancelar</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );

  const renderFoodSearch = (isModel: boolean = false) => (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-4">
            <div className="mb-4">
                <h3 className="font-bold text-slate-700 mb-2">Adicionar Alimento</h3>
                
                <div className="flex items-center gap-2 mb-3 bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setDietMeasureMode('grams')} className={`flex-1 text-xs py-1 rounded ${dietMeasureMode === 'grams' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}>Gramas</button>
                    <button onClick={() => setDietMeasureMode('household')} className={`flex-1 text-xs py-1 rounded ${dietMeasureMode === 'household' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}>Medida Caseira</button>
                </div>

                <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input 
                        type="text" 
                        placeholder="Buscar alimento..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
                        />
                    </div>
                    <div className="w-20">
                        <input 
                            type="number" 
                            min="0.1"
                            step="0.1"
                            value={foodQuantity}
                            onChange={e => setFoodQuantity(Number(e.target.value))}
                            className="w-full h-full border rounded-lg text-center text-sm"
                            title="Quantidade"
                        />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mb-2">Quantidade: {foodQuantity} {dietMeasureMode === 'grams' ? 'x 1g (aprox)' : 'medidas'}</p>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-1 mb-4">
                {foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(food => (
                    <button key={food.id} onClick={() => addFoodToMeal(food)} className="w-full text-left p-2 hover:bg-emerald-50 rounded text-sm truncate flex justify-between">
                        <span>{food.name}</span>
                        <span className="text-xs text-slate-400">{dietMeasureMode === 'household' && food.householdUnit ? food.householdUnit : '100g'}</span>
                    </button>
                ))}
            </div>
            
            {activeMealKey && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded text-center">
                    Adicionando em: <b>
                    {(() => {
                        const target = isModel ? editingModel : (dietSubTab === 'recordatorio' ? recallPlan : dietPlan);
                        if (!target || !activeMealKey) return '';
                        const val = target[activeMealKey];
                        if (typeof val === 'object' && val !== null && 'name' in val) {
                            return (val as Meal).name;
                        }
                        return '';
                    })()}
                    </b>
                </div>
            )}
    </div>
  );

  const renderRegistration = () => (
      <div className="space-y-6">
          <div className="flex gap-2 border-b border-slate-200 pb-1">
             <button onClick={() => setRegistrationSubTab('list')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${registrationSubTab === 'list' ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500'}`}>Dados do Paciente</button>
             <button onClick={() => setRegistrationSubTab('models')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${registrationSubTab === 'models' ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500'}`}>Modelos de Alimentação</button>
             <button onClick={() => setRegistrationSubTab('substitutions')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${registrationSubTab === 'substitutions' ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500'}`}>Listas de Substituição</button>
             <button onClick={() => setRegistrationSubTab('newFood')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${registrationSubTab === 'newFood' ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500'}`}>Cadastrar Novo Alimento</button>
          </div>

          {registrationSubTab === 'list' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4">Dados Pessoais e Clínicos</h3>
                  
                  {pendingAppointment && (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-6 flex items-start gap-3">
                          <AlertCircle className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                          <div>
                              <p className="font-bold text-emerald-800">Finalizando Cadastro para Agendamento</p>
                              <p className="text-sm text-emerald-700">Preencha os dados abaixo para confirmar o agendamento de <span className="font-bold">{pendingAppointment.name || 'Novo Paciente'}</span> para o dia {pendingAppointment.date} às {pendingAppointment.time}.</p>
                          </div>
                      </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-slate-500">Nome Completo</label><input type="text" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} className="w-full border rounded p-2" /></div>
                      <div><label className="text-xs font-bold text-slate-500">Data de Nascimento</label><input type="date" value={patient.birthDate} onChange={e => setPatient({...patient, birthDate: e.target.value})} className="w-full border rounded p-2" /></div>
                      <div><label className="text-xs font-bold text-slate-500">Profissão</label><input type="text" value={patient.profession || ''} onChange={e => setPatient({...patient, profession: e.target.value})} className="w-full border rounded p-2" /></div>
                      <div><label className="text-xs font-bold text-slate-500">Motivo da Consulta</label><input type="text" value={patient.objective || ''} onChange={e => setPatient({...patient, objective: e.target.value})} className="w-full border rounded p-2" /></div>
                      <div><label className="text-xs font-bold text-slate-500">Email</label><input type="email" value={patient.email} onChange={e => setPatient({...patient, email: e.target.value})} className="w-full border rounded p-2" /></div>
                      <div><label className="text-xs font-bold text-slate-500">Telefone</label><input type="tel" value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})} className="w-full border rounded p-2" /></div>
                      <div className="col-span-2"><label className="text-xs font-bold text-slate-500">Endereço</label><input type="text" value={patient.address} onChange={e => setPatient({...patient, address: e.target.value})} className="w-full border rounded p-2" /></div>
                  </div>
                  <div className="mt-4 flex justify-end">
                      <button onClick={() => handleSavePatient(false)} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2"><Save size={16}/> {pendingAppointment ? 'Salvar e Confirmar Agendamento' : 'Salvar Dados'}</button>
                  </div>

                  {/* Patient Search */}
                  {!pendingAppointment && (
                      <div className="mt-8 border-t pt-6">
                          <h3 className="font-bold text-slate-700 mb-4">Buscar Paciente Cadastrado</h3>
                          <div className="relative mb-4">
                              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                              <input 
                                  type="text" 
                                  placeholder="Buscar por nome..." 
                                  value={patientSearchTerm} 
                                  onChange={e => setPatientSearchTerm(e.target.value)}
                                  className="w-full pl-9 border rounded p-2"
                              />
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                              {savedPatients.filter(p => p.name.toLowerCase().includes(patientSearchTerm.toLowerCase())).map(p => (
                                  <div key={p.id} className="flex justify-between items-center p-3 border rounded hover:bg-slate-50">
                                      <div>
                                          <p className="font-medium text-sm">{p.name}</p>
                                          <p className="text-xs text-slate-500">{p.email || 'Sem email'}</p>
                                      </div>
                                      <button onClick={() => loadPatient(p)} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded hover:bg-emerald-200">Carregar</button>
                                  </div>
                              ))}
                              {savedPatients.length === 0 && <p className="text-sm text-slate-400 text-center">Nenhum paciente salvo.</p>}
                          </div>
                      </div>
                  )}
              </div>
          )}
          {registrationSubTab === 'models' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  {!editingModel ? (
                      <div>
                          <div className="flex justify-between mb-4">
                              <h3 className="font-bold text-slate-700">Modelos de Dieta Salvos</h3>
                              <button onClick={startNewModel} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm flex items-center gap-1"><Plus size={14}/> Novo Modelo</button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {dietModels.map(m => (
                                    <div key={m.id} className="border p-4 rounded-xl flex justify-between items-center">
                                        <span className="font-medium text-slate-700">{m.name}</span>
                                        <button onClick={() => setDietModels(dietModels.filter(d => d.id !== m.id))} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                                {dietModels.length === 0 && <p className="text-sm text-slate-400 col-span-3">Nenhum modelo cadastrado.</p>}
                          </div>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                           <div className="lg:col-span-2 space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-emerald-800">Criando Novo Modelo</h3>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Nome do Modelo" value={newModelName} onChange={e => setNewModelName(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                                        <button onClick={() => setEditingModel(null)} className="text-slate-500 text-sm">Cancelar</button>
                                        <button onClick={saveDietModel} className="bg-emerald-600 text-white px-3 py-1 rounded text-sm">Salvar</button>
                                    </div>
                                </div>
                                {Object.entries(editingModel).map(([key, meal]) => {
                                    if (key === 'observations' || key === 'substitutionList' || key === 'name') return null;
                                    const m = meal as Meal;
                                    return (
                                        <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-sm text-slate-700">{m.name}</h4>
                                                <button onClick={() => setActiveMealKey(key as keyof DailyPlan)} className="text-xs text-emerald-600 font-bold bg-white px-2 py-1 rounded shadow-sm">+ Adicionar</button>
                                            </div>
                                            <div className="space-y-1">
                                                {m.foods.map((f, idx) => (
                                                    <div key={idx} className="flex justify-between text-xs bg-white p-1 rounded border border-slate-100">
                                                        <span>{f.foodName} ({f.quantity} {f.unitLabel})</span>
                                                        <button onClick={() => removeFoodFromMeal(key as keyof DailyPlan, idx, false, true)} className="text-red-500"><X size={12}/></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                           </div>
                           <div className="lg:col-span-1">
                                {renderFoodSearch(true)}
                           </div>
                      </div>
                  )}
              </div>
          )}
          {registrationSubTab === 'substitutions' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-700 mb-4">Gerenciar Listas de Substituição</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="md:col-span-1 border-r pr-6 space-y-4">
                           <h4 className="font-medium text-sm text-slate-600">Nova Lista</h4>
                           <input 
                               type="text" 
                               placeholder="Título da Lista (ex: Low Carb)" 
                               className="w-full border rounded p-2 text-sm"
                               value={editingSubstitution.title}
                               onChange={e => setEditingSubstitution({...editingSubstitution, title: e.target.value})}
                           />
                           <textarea
                               className="w-full h-40 border rounded p-2 text-sm resize-none"
                               placeholder="Conteúdo da lista..."
                               value={editingSubstitution.content}
                               onChange={e => setEditingSubstitution({...editingSubstitution, content: e.target.value})}
                           ></textarea>
                           <button onClick={saveSubstitutionModel} disabled={!editingSubstitution.title} className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50">Salvar Lista</button>
                       </div>
                       <div className="md:col-span-2">
                           <h4 className="font-medium text-sm text-slate-600 mb-4">Listas Salvas</h4>
                           <div className="space-y-3">
                               {substitutionModels.map(model => (
                                   <div key={model.id} className="border p-3 rounded-lg flex justify-between items-center bg-slate-50">
                                       <div>
                                           <span className="font-bold text-slate-800 text-sm block">{model.title}</span>
                                           <p className="text-xs text-slate-500 truncate w-64">{model.content}</p>
                                       </div>
                                       <button onClick={() => setSubstitutionModels(substitutionModels.filter(m => m.id !== model.id))} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                                   </div>
                               ))}
                               {substitutionModels.length === 0 && <p className="text-sm text-slate-400">Nenhuma lista salva.</p>}
                           </div>
                       </div>
                   </div>
              </div>
          )}
          {registrationSubTab === 'newFood' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                      <Apple size={20} className="text-emerald-600"/> Cadastro de Novo Alimento
                  </h3>
                  
                  {/* Import/Export Card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                      <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                          <Briefcase size={16}/> Gerenciar Banco de Dados
                      </h4>
                      <div className="flex gap-4">
                          <button 
                              onClick={handleExportFoods}
                              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                          >
                              <FileDown size={16}/> Exportar Excel (CSV)
                          </button>
                          <label className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2 cursor-pointer">
                              <FileUp size={16}/> Importar Excel (CSV)
                              <input type="file" accept=".csv" className="hidden" onChange={handleImportFoods} />
                          </label>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                          * Para importar, utilize o mesmo formato do arquivo exportado.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                          <h4 className="font-bold text-sm text-slate-600 border-b pb-2">Informações Gerais</h4>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Alimento</label>
                              <input 
                                  type="text" 
                                  value={newFood.name} 
                                  onChange={e => setNewFood({...newFood, name: e.target.value})} 
                                  className="w-full border rounded p-2 text-sm"
                                  placeholder="Ex: Pão Integral Caseiro"
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Grupo Alimentar</label>
                                  <select 
                                      value={newFood.group || ''} 
                                      onChange={e => setNewFood({...newFood, group: e.target.value})}
                                      className="w-full border rounded p-2 text-sm bg-white"
                                  >
                                      <option value="Cereais">Cereais/Pães</option>
                                      <option value="Hortaliças">Hortaliças/Verduras</option>
                                      <option value="Frutas">Frutas</option>
                                      <option value="Leguminosas">Leguminosas</option>
                                      <option value="Carnes">Carnes/Ovos</option>
                                      <option value="Laticínios">Leites/Derivados</option>
                                      <option value="Óleos">Óleos/Gorduras</option>
                                      <option value="Doces">Açúcares/Doces</option>
                                      <option value="Oleaginosas">Castanhas/Sementes</option>
                                      <option value="Outros">Outros/Industrializados</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Unidade Base</label>
                                  <input type="text" value="100g" disabled className="w-full border rounded p-2 text-sm bg-slate-100 text-slate-500" />
                              </div>
                          </div>
                          
                          <h4 className="font-bold text-sm text-slate-600 border-b pb-2 pt-2">Medida Caseira Padrão</h4>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Nome da Medida</label>
                                  <input 
                                      type="text" 
                                      value={newFood.householdUnit || ''} 
                                      onChange={e => setNewFood({...newFood, householdUnit: e.target.value})}
                                      className="w-full border rounded p-2 text-sm"
                                      placeholder="Ex: Fatias, Colher de Sopa"
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Peso em Gramas (g)</label>
                                  <input 
                                      type="number" 
                                      value={newFood.householdWeight || ''} 
                                      onChange={e => setNewFood({...newFood, householdWeight: Number(e.target.value)})}
                                      className="w-full border rounded p-2 text-sm"
                                      placeholder="0"
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h4 className="font-bold text-sm text-slate-600 border-b pb-2">Macronutrientes (por 100g)</h4>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Calorias (kcal)</label>
                                  <input type="number" value={newFood.nutrients.calories} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, calories: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Carboidratos (g)</label>
                                  <input type="number" value={newFood.nutrients.carbs} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, carbs: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Proteínas (g)</label>
                                  <input type="number" value={newFood.nutrients.protein} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, protein: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Lipídeos/Gorduras (g)</label>
                                  <input type="number" value={newFood.nutrients.lipids} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, lipids: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Fibra Alimentar (g)</label>
                                  <input type="number" value={newFood.nutrients.fiber} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, fiber: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                          </div>

                          <h4 className="font-bold text-sm text-slate-600 border-b pb-2 pt-2">Micronutrientes (por 100g)</h4>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Cálcio (mg)</label>
                                  <input type="number" value={newFood.nutrients.calcium} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, calcium: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Ferro (mg)</label>
                                  <input type="number" value={newFood.nutrients.iron} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, iron: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Magnésio (mg)</label>
                                  <input type="number" value={newFood.nutrients.magnesium} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, magnesium: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">Zinco (mg)</label>
                                  <input type="number" value={newFood.nutrients.zinc} onChange={e => setNewFood({...newFood, nutrients: {...newFood.nutrients, zinc: Number(e.target.value)}})} className="w-full border rounded p-2 text-sm" />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                      <button 
                          onClick={handleSaveNewFood} 
                          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg"
                      >
                          <Save size={18} /> Salvar Alimento
                      </button>
                  </div>
              </div>
          )}
      </div>
  );

  const renderAssessment = () => (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto no-print">
        {['geral', 'dobras', 'perimetria', 'diametros', 'bia', 'anamnese', 'exames', 'resultados'].map(t => (
            <button key={t} onClick={() => setSubTab(t)} className={`px-4 py-2 text-sm font-medium rounded-t-lg capitalize transition-colors ${subTab === t ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500 hover:text-emerald-600'}`}>{t === 'bia' ? 'Bioimpedância' : t}</button>
        ))}
      </div>
      {subTab === 'geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2"><User size={20} className="text-emerald-600"/> Dados Pessoais</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs text-slate-500 font-bold">Nome</label><input type="text" readOnly value={patient.name} className="w-full bg-slate-50 border rounded p-2" /></div>
                    <div><label className="text-xs text-slate-500 font-bold">Idade</label><input type="number" readOnly value={patient.age} className="w-full bg-slate-50 border rounded p-2" /></div>
                    
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Sexo</label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPatient({...patient, gender: 'male'})} 
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${patient.gender === 'male' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Masculino
                            </button>
                            <button 
                                onClick={() => setPatient({...patient, gender: 'female'})} 
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${patient.gender === 'female' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Feminino
                            </button>
                        </div>
                    </div>

                    <div><label className="text-xs text-slate-500 font-bold">Peso (kg)</label><input type="number" value={patient.weight} onChange={e => setPatient({...patient, weight: Number(e.target.value)})} className="w-full bg-white border rounded p-2" /></div>
                    <div><label className="text-xs text-slate-500 font-bold">Altura (cm)</label><input type="number" value={patient.height} onChange={e => setPatient({...patient, height: Number(e.target.value)})} className="w-full bg-white border rounded p-2" /></div>
                </div>
             </div>

             {/* CLINICAL CONTEXT CARD WITH GEMINI */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Activity size={20} className="text-blue-600"/> Histórico Clínico & Análise IA
                    </h3>
                    <button 
                        onClick={handleAIAnalysis}
                        disabled={isAnalyzing}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:shadow-md transition-all disabled:opacity-50"
                    >
                        {isAnalyzing ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} />}
                        Analisar Interações
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Patologias</label>
                        <textarea 
                            value={patient.pathologies} 
                            onChange={e => setPatient({...patient, pathologies: e.target.value})} 
                            className="w-full border rounded p-2 text-sm h-20 resize-none"
                            placeholder="Ex: Diabetes, Hipertensão..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Medicamentos</label>
                        <textarea 
                            value={patient.medications} 
                            onChange={e => setPatient({...patient, medications: e.target.value})} 
                            className="w-full border rounded p-2 text-sm h-20 resize-none"
                            placeholder="Ex: Metformina 500mg..."
                        />
                    </div>
                </div>

                {/* AI RESULT DISPLAY */}
                {aiAnalysis && (
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><Sparkles size={12} className="text-purple-500"/> Análise Inteligente</h4>
                        <div className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br>') }} />
                    </div>
                )}
             </div>

             {/* Energy Planning Section */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2"><Zap size={20} className="text-amber-500"/> Planejamento Energético</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                         <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Taxa Metabólica Basal (TMB)</span>
                         <span className="text-2xl font-bold text-slate-700">{results.bmr} <span className="text-sm font-normal text-slate-500">kcal/dia</span></span>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                         <span className="text-xs font-bold text-emerald-600 uppercase block mb-1">Gasto Energético Total (VET/TDEE)</span>
                         <span className="text-2xl font-bold text-emerald-800">{results.vet} <span className="text-sm font-normal text-emerald-600">kcal/dia</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Objetivo de Peso</label>
                        <select 
                            value={patient.weightGoal} 
                            onChange={e => {
                                const goal = e.target.value as any;
                                let defaultFactor = 30;
                                if (goal === 'lose') defaultFactor = 22; // Mid of 20-25
                                if (goal === 'gain') defaultFactor = 33; // Mid of 30-35
                                setPatient({...patient, weightGoal: goal, goalKcalPerKg: defaultFactor});
                            }} 
                            className="w-full border rounded p-2 text-sm bg-white"
                        >
                            <option value="lose">Perder Peso</option>
                            <option value="maintain">Manter Peso</option>
                            <option value="gain">Ganhar Peso</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Fator Kcal/kg</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                value={patient.goalKcalPerKg} 
                                onChange={e => setPatient({...patient, goalKcalPerKg: Number(e.target.value)})} 
                                className="w-full border rounded p-2 text-sm" 
                            />
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                                {patient.weightGoal === 'lose' ? '20-25' : patient.weightGoal === 'gain' ? '30-35' : '25-35'} rec.
                            </span>
                        </div>
                    </div>
                </div>
             </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
              <BodyVisualizer bmi={results.bmi} gender={patient.gender} />
          </div>
        </div>
      )}
      {subTab === 'dobras' && (
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-700 mb-4">Dobras Cutâneas e Circunferências (Frisancho)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <label className="block text-sm font-medium mb-1">Circunferência do Braço (cm)</label>
                     <input type="number" value={patient.armCirc} onChange={e => setPatient({...patient, armCirc: Number(e.target.value)})} className="w-full border rounded p-2" />
                 </div>
                 <div>
                     <label className="block text-sm font-medium mb-1">Dobra Tricipital (mm)</label>
                     <input type="number" value={patient.tricepsFold} onChange={e => setPatient({...patient, tricepsFold: Number(e.target.value)})} className="w-full border rounded p-2" />
                 </div>
                 <div>
                     <label className="block text-sm font-medium mb-1">Dobra Bicipital (mm)</label>
                     <input type="number" value={patient.bicepsFold} onChange={e => setPatient({...patient, bicepsFold: Number(e.target.value)})} className="w-full border rounded p-2" />
                 </div>
             </div>
         </div>
      )}
      {subTab === 'perimetria' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-700 mb-4">Perimetria (cm)</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {Object.entries(patient.perimetry).map(([key, val]) => (
                     <div key={key}>
                         <label className="block text-xs font-medium text-slate-500 mb-1 capitalize">
                             {PERIMETRY_LABELS[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                         </label>
                         <input 
                            type="number" 
                            value={val} 
                            onChange={e => setPatient({...patient, perimetry: {...patient.perimetry, [key]: Number(e.target.value)}})} 
                            className="w-full border rounded p-2 text-sm"
                         />
                     </div>
                 ))}
             </div>
          </div>
      )}
      {subTab === 'diametros' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-700 mb-4">Diâmetros Ósseos (cm)</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div><label className="block text-sm font-medium mb-1">Punho</label><input type="number" value={patient.diameters.wrist} onChange={e => setPatient({...patient, diameters: {...patient.diameters, wrist: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
                 <div><label className="block text-sm font-medium mb-1">Úmero</label><input type="number" value={patient.diameters.humerus} onChange={e => setPatient({...patient, diameters: {...patient.diameters, humerus: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
                 <div><label className="block text-sm font-medium mb-1">Fêmur</label><input type="number" value={patient.diameters.femur} onChange={e => setPatient({...patient, diameters: {...patient.diameters, femur: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
             </div>
          </div>
      )}
      {subTab === 'bia' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-700 mb-4">Bioimpedância</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><label className="block text-xs font-bold text-slate-500">Gordura Corporal (%)</label><input type="number" value={patient.bia.bodyFatPercent} onChange={e => setPatient({...patient, bia: {...patient.bia, bodyFatPercent: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500">Massa Gorda (kg)</label><input type="number" value={patient.bia.fatMass} onChange={e => setPatient({...patient, bia: {...patient.bia, fatMass: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500">Massa Magra (kg)</label><input type="number" value={patient.bia.leanMass} onChange={e => setPatient({...patient, bia: {...patient.bia, leanMass: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500">Água Corporal Total (L)</label><input type="number" value={patient.bia.totalBodyWater} onChange={e => setPatient({...patient, bia: {...patient.bia, totalBodyWater: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500">Ângulo de Fase</label><input type="number" value={patient.bia.phaseAngle} onChange={e => setPatient({...patient, bia: {...patient.bia, phaseAngle: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500">Músculo Esquelético (kg)</label><input type="number" value={patient.bia.skeletalMuscleMass} onChange={e => setPatient({...patient, bia: {...patient.bia, skeletalMuscleMass: Number(e.target.value)}})} className="w-full border rounded p-2" /></div>
             </div>
          </div>
      )}
      {subTab === 'anamnese' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* NEURODIVERSITY (TEA/TDAH) CARD */}
             <div className="md:col-span-3 bg-violet-50 p-5 rounded-2xl shadow-sm border border-violet-100 animate-in fade-in slide-in-from-top-2">
                 <h4 className="font-bold text-violet-800 mb-4 flex items-center gap-2"><Brain size={18}/> Saúde Mental & Neurodesenvolvimento</h4>
                 
                 <div className="mb-4">
                     <label className="flex items-center gap-2 text-sm font-bold text-violet-900 cursor-pointer">
                         <input 
                             type="checkbox" 
                             checked={patient.isNeurodivergent} 
                             onChange={e => setPatient({...patient, isNeurodivergent: e.target.checked})}
                             className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500"
                         /> 
                         Diagnóstico de TEA/TDAH?
                     </label>
                 </div>

                 {patient.isNeurodivergent && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pl-2 border-l-2 border-violet-200">
                         {/* 1. Eating Pattern */}
                         <div>
                             <h5 className="font-bold text-sm text-violet-800 mb-2">1. Padrão e Comportamento Alimentar</h5>
                             <div className="space-y-1">
                                {[
                                    'Recusa por Textura/Consistência',
                                    'Rigidez de Marcas/Embalagem',
                                    'Hiperfoco Alimentar',
                                    'Comer Distraído',
                                    'Necessidade de Incentivo',
                                    'Impulsividade/Compulsão'
                                ].map(opt => (
                                     <label key={opt} className="flex items-center gap-2 text-sm text-violet-700">
                                         <input 
                                             type="checkbox" 
                                             checked={patient.clinicalSigns.neurodivergentSymptoms?.includes(opt)}
                                             onChange={() => toggleMultiSelect('neurodivergentSymptoms', opt)}
                                             className="rounded text-violet-600 focus:ring-violet-500"
                                         /> {opt}
                                     </label>
                                ))}
                             </div>
                         </div>

                         {/* 2. Sensory/Motor */}
                         <div>
                             <h5 className="font-bold text-sm text-violet-800 mb-2">2. Aspectos Sensoriais e Motores</h5>
                             <div className="space-y-1">
                                {[
                                    'Mastigação Ineficiente/Engole Inteiro',
                                    'Armazenamento (Bocado)',
                                    'Sensibilidade a Odores',
                                    'Uso de Talheres (Dificuldade)',
                                    'Isolamento Social na Refeição'
                                ].map(opt => (
                                     <label key={opt} className="flex items-center gap-2 text-sm text-violet-700">
                                         <input 
                                             type="checkbox" 
                                             checked={patient.clinicalSigns.neurodivergentSymptoms?.includes(opt)}
                                             onChange={() => toggleMultiSelect('neurodivergentSymptoms', opt)}
                                             className="rounded text-violet-600 focus:ring-violet-500"
                                         /> {opt}
                                     </label>
                                ))}
                             </div>
                         </div>

                         {/* 3. Physiological */}
                         <div>
                             <h5 className="font-bold text-sm text-violet-800 mb-2">3. Sinais Fisiológicos e Metabólicos</h5>
                             <div className="space-y-1">
                                {[
                                    'Ritmo Intestinal (Constipação/Diarreia)',
                                    'Sinais de Disbiose',
                                    'Percepção de Fome/Saciedade',
                                    'Baixa Ingestão Hídrica Espontânea',
                                    'Uso de Medicação (Inibidor de Apetite)'
                                ].map(opt => (
                                     <label key={opt} className="flex items-center gap-2 text-sm text-violet-700">
                                         <input 
                                             type="checkbox" 
                                             checked={patient.clinicalSigns.neurodivergentSymptoms?.includes(opt)}
                                             onChange={() => toggleMultiSelect('neurodivergentSymptoms', opt)}
                                             className="rounded text-violet-600 focus:ring-violet-500"
                                         /> {opt}
                                     </label>
                                ))}
                             </div>
                         </div>

                         {/* 4. Routine */}
                         <div>
                             <h5 className="font-bold text-sm text-violet-800 mb-2">4. Rotina e Ambiente</h5>
                             <div className="space-y-1">
                                {[
                                    'Refeições fora da mesa',
                                    'Alto consumo de Ultraprocessados',
                                    'Dificuldade no Sono'
                                ].map(opt => (
                                     <label key={opt} className="flex items-center gap-2 text-sm text-violet-700">
                                         <input 
                                             type="checkbox" 
                                             checked={patient.clinicalSigns.neurodivergentSymptoms?.includes(opt)}
                                             onChange={() => toggleMultiSelect('neurodivergentSymptoms', opt)}
                                             className="rounded text-violet-600 focus:ring-violet-500"
                                         /> {opt}
                                     </label>
                                ))}
                             </div>
                         </div>
                     </div>
                 )}
             </div>

             {/* INFANT FEEDING LOGIC (0-2 years) */}
             {patient.age <= 2 && (
                 <div className="md:col-span-3 bg-indigo-50 p-5 rounded-2xl shadow-sm border border-indigo-100">
                     <h4 className="font-bold text-indigo-800 mb-4 flex items-center gap-2"><Baby size={18}/> Introdução Alimentar (Observação dos Pais)</h4>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-indigo-200">
                        <div>
                            <label className="block text-xs font-bold text-indigo-800 mb-1">Mama Peito ou Fórmula?</label>
                            <select 
                                value={patient.infantFeedingMethod || ''} 
                                onChange={e => setPatient({...patient, infantFeedingMethod: e.target.value})}
                                className="w-full border-indigo-200 rounded p-2 text-sm bg-white focus:ring-indigo-500"
                            >
                                <option value="">Selecione...</option>
                                <option value="materno_exclusivo">Leite Materno Exclusivo (LME)</option>
                                <option value="formula">Fórmula Infantil</option>
                                <option value="misto">Misto (Peito + Fórmula)</option>
                                <option value="leite_vaca">Leite de Vaca/Outro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-indigo-800 mb-1">Iniciou a Alimentação Sólida?</label>
                            <select 
                                value={patient.infantStartedSolids || 'não'} 
                                onChange={e => setPatient({...patient, infantStartedSolids: e.target.value})}
                                className="w-full border-indigo-200 rounded p-2 text-sm bg-white focus:ring-indigo-500"
                            >
                                <option value="não">Ainda não</option>
                                <option value="sim">Sim, iniciada</option>
                            </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {[
                             'Sinais de Prontidão presentes (senta sem apoio, leva objetos à boca)',
                             'Reflexo de protusão (cuspir para fora) diminuiu',
                             'Demonstra interesse pela comida da família',
                             'Apresenta "Gag Reflex" (ânsia de proteção)',
                             'Reações na pele ou respiratórias após novos alimentos'
                         ].map(opt => (
                             <label key={opt} className="flex items-center gap-2 text-sm text-indigo-700">
                                 <input 
                                     type="checkbox" 
                                     checked={patient.clinicalSigns.infantObservations?.includes(opt)}
                                     onChange={() => toggleMultiSelect('infantObservations', opt)}
                                     className="rounded text-indigo-600 focus:ring-indigo-500"
                                 /> {opt}
                             </label>
                         ))}
                     </div>
                 </div>
             )}

             {/* WOMEN'S HEALTH LOGIC */}
             {patient.gender === 'female' && patient.age >= 10 && (
                 <div className="md:col-span-3 bg-pink-50 p-5 rounded-2xl shadow-sm border border-pink-100">
                     <h4 className="font-bold text-pink-800 mb-4 flex items-center gap-2"><Flower2 size={18}/> Saúde da Mulher</h4>
                     
                     <div className="flex items-center gap-4 mb-4">
                         <label className="flex items-center gap-2 cursor-pointer">
                             <input 
                                type="checkbox" 
                                checked={patient.isGestante} 
                                onChange={(e) => {
                                    const isGestante = e.target.checked;
                                    setPatient({
                                        ...patient, 
                                        isGestante,
                                        statusMenstruacao: isGestante ? 'amenorreia_gestacional' : 'regular'
                                    });
                                }}
                                className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                             />
                             <span className="font-semibold text-pink-900">Gestante</span>
                         </label>
                     </div>

                     {/* Gestational Symptoms */}
                     {patient.isGestante && (
                         <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                             <h5 className="font-semibold text-sm text-pink-800 mb-2 flex items-center gap-2"><Baby size={16}/> Sintomas Gestacionais</h5>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                 {['Enjoo matinal', 'Aversão a cheiros/alimentos', 'Edema (inchaço)', 'Tonturas frequentes', 'Oscilações de humor'].map(opt => (
                                     <label key={opt} className="flex items-center gap-2 text-sm text-pink-700">
                                         <input 
                                             type="checkbox" 
                                             checked={patient.clinicalSigns.gestationalSymptoms?.includes(opt)}
                                             onChange={() => toggleMultiSelect('gestationalSymptoms', opt)}
                                             className="rounded text-pink-600 focus:ring-pink-500"
                                         /> {opt}
                                     </label>
                                 ))}
                             </div>
                         </div>
                     )}

                     {/* Cycle Symptoms */}
                     {!patient.isGestante && (
                         <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                             <div className="mb-4">
                                 <label className="block text-xs font-bold text-pink-800 mb-1">Ciclo Menstrual</label>
                                 <select 
                                     value={patient.statusMenstruacao} 
                                     onChange={e => setPatient({...patient, statusMenstruacao: e.target.value})} 
                                     className="w-full md:w-1/3 border-pink-200 rounded p-2 text-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                                 >
                                     <option value="regular">Regular</option>
                                     <option value="irregular">Irregular</option>
                                     <option value="absent">Ausente / Menopausa</option>
                                 </select>
                             </div>

                             {(patient.statusMenstruacao === 'regular' || patient.statusMenstruacao === 'irregular') && (
                                 <div>
                                     <h5 className="font-semibold text-sm text-pink-800 mb-2 flex items-center gap-2"><CalendarHeart size={16}/> Sintomas do Ciclo</h5>
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                         {['TPM intensa', 'Cólicas fortes', 'Compulsão por doces', 'Acne cíclica'].map(opt => (
                                             <label key={opt} className="flex items-center gap-2 text-sm text-pink-700">
                                                 <input 
                                                     type="checkbox" 
                                                     checked={patient.clinicalSigns.cycleSymptoms?.includes(opt)}
                                                     onChange={() => toggleMultiSelect('cycleSymptoms', opt)}
                                                     className="rounded text-pink-600 focus:ring-pink-500"
                                                 /> {opt}
                                             </label>
                                         ))}
                                     </div>
                                 </div>
                             )}
                         </div>
                     )}
                 </div>
             )}

             {/* ATHLETE / RED-S LOGIC */}
             {patient.isAthlete && (
                 <div className="md:col-span-3 bg-amber-50 p-5 rounded-2xl shadow-sm border border-amber-100 animate-in fade-in slide-in-from-top-2">
                     <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2"><Trophy size={18}/> Jovens e Esportistas (Foco em RED-S)</h4>
                     <p className="text-xs text-amber-700 mb-4">Rastreamento de Deficiência Energética Relativa no Esporte</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {[
                             'Queda no rendimento nos treinos',
                             'Recuperação lenta / Dor muscular persistente',
                             'Infecções frequentes (imunidade baixa)',
                             'Perda de peso não intencional',
                             'Irregularidade menstrual ou amenorreia (Meninas)',
                             'Histórico de fraturas por estresse'
                         ].map(opt => (
                             <label key={opt} className="flex items-center gap-2 text-sm text-amber-900">
                                 <input 
                                     type="checkbox" 
                                     checked={patient.clinicalSigns.redsSymptoms?.includes(opt)}
                                     onChange={() => toggleMultiSelect('redsSymptoms', opt)}
                                     className="rounded text-amber-600 focus:ring-amber-500"
                                 /> {opt}
                             </label>
                         ))}
                     </div>
                 </div>
             )}

             {/* LIFESTYLE */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                 <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><Activity size={18}/> Estilo de Vida</h4>
                 <div className="space-y-3">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Álcool</label>
                         <select value={patient.alcoholFreq} onChange={e => setPatient({...patient, alcoholFreq: e.target.value})} className="w-full border rounded p-2 text-sm bg-slate-50">
                             <option value="não">Não consumo</option>
                             <option value="socialmente">Socialmente</option>
                             <option value="1x/semana">1x na semana</option>
                             <option value="2-3x/semana">2 a 3x na semana</option>
                             <option value=">4x/semana">Mais de 4x na semana</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Tabagismo</label>
                         <select value={patient.smokerFreq} onChange={e => setPatient({...patient, smokerFreq: e.target.value})} className="w-full border rounded p-2 text-sm bg-slate-50">
                             <option value="não">Não fumo</option>
                             <option value="ex-fumante">Ex-fumante</option>
                             <option value="ocasionalmente">Ocasionalmente</option>
                             <option value="diariamente">Diariamente</option>
                         </select>
                     </div>
                     
                     {/* EXERCISE / ATHLETE */}
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Exercício Físico</label>
                         <div className="flex gap-2 mb-2">
                             <select value={patient.exerciseFreq} onChange={e => setPatient({...patient, exerciseFreq: e.target.value})} className="w-full border rounded p-2 text-sm bg-slate-50">
                                 <option value="não">Sedentário</option>
                                 <option value="1-2x">1-2x/semana</option>
                                 <option value="3-4x">3-4x/semana</option>
                                 <option value="5x+">5x ou mais</option>
                             </select>
                         </div>
                         
                         <div className="flex items-center gap-4 mt-2 mb-2 bg-slate-50 p-2 rounded">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <input 
                                    type="checkbox" 
                                    checked={patient.isAthlete} 
                                    onChange={e => setPatient({...patient, isAthlete: e.target.checked})}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                /> 
                                Atleta?
                            </label>
                         </div>

                         {patient.isAthlete && (
                             <div className="animate-in fade-in slide-in-from-top-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Qual tipo de esporte?</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Natação, Crossfit, Futebol..." 
                                    value={patient.exerciseType} 
                                    onChange={e => setPatient({...patient, exerciseType: e.target.value})} 
                                    className="w-full border rounded p-2 text-sm border-emerald-300 focus:ring-emerald-500" 
                                />
                             </div>
                         )}
                     </div>
                 </div>
             </div>

             {/* BIO-RHYTHM */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                 <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><Clock size={18}/> Sono e Energia</h4>
                 <div className="space-y-3">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Qualidade do Sono</label>
                         <select value={patient.sleepQuality} onChange={e => setPatient({...patient, sleepQuality: e.target.value})} className="w-full border rounded p-2 text-sm bg-slate-50">
                             <option value="normal">Normal / Reparador</option>
                             <option value="insonia">Insônia / Dificuldade para dormir</option>
                             <option value="agitado">Sono agitado / Acorda muito</option>
                             <option value="nao-reparador">Sono não reparador</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Nível de Energia</label>
                         <select value={patient.clinicalSigns.energyLevel} onChange={e => setPatient({...patient, clinicalSigns: {...patient.clinicalSigns, energyLevel: e.target.value}})} className="w-full border rounded p-2 text-sm bg-slate-50">
                             <option value="stable">Energia estável o dia todo</option>
                             <option value="morning_tired">Cansaço ao acordar</option>
                             <option value="afternoon_crash">Queda de energia à tarde</option>
                             <option value="exhaustion">Exaustão constante</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Ingestão Hídrica (Litros)</label>
                         <input type="number" step="0.1" value={patient.waterIntake} onChange={e => setPatient({...patient, waterIntake: Number(e.target.value)})} className="w-full border rounded p-2" />
                     </div>
                 </div>
             </div>

             {/* SOCIAL & ECONOMIC CONTEXT */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                 <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><Briefcase size={18}/> Contexto Social e Econômico</h4>
                 <div className="space-y-3">
                     {/* Work */}
                     <div>
                         <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1">
                             <input 
                                 type="checkbox" 
                                 checked={patient.isWorking} 
                                 onChange={e => setPatient({...patient, isWorking: e.target.checked})}
                                 className="rounded text-emerald-600 focus:ring-emerald-500"
                             /> 
                             Trabalha atualmente?
                         </label>
                         {patient.isWorking && (
                             <input 
                                 type="text" 
                                 placeholder="Profissão / Ocupação"
                                 value={patient.profession || ''} 
                                 onChange={e => setPatient({...patient, profession: e.target.value})}
                                 className="w-full border rounded p-2 text-sm mt-1"
                             />
                         )}
                     </div>

                     {/* Living */}
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Mora Sozinho?</label>
                         <select 
                             value={patient.livesAlone ? 'sim' : 'não'} 
                             onChange={e => setPatient({...patient, livesAlone: e.target.value === 'sim'})}
                             className="w-full border rounded p-2 text-sm bg-slate-50"
                         >
                             <option value="sim">Sim</option>
                             <option value="não">Não</option>
                         </select>
                     </div>

                     {!patient.livesAlone && (
                         <div className="animate-in fade-in slide-in-from-top-1">
                             <label className="block text-xs font-bold text-slate-500 mb-1">Quantas pessoas na casa?</label>
                             <input 
                                 type="number" 
                                 value={patient.peopleInHouse || 1} 
                                 onChange={e => setPatient({...patient, peopleInHouse: Number(e.target.value)})}
                                 className="w-full border rounded p-2 text-sm"
                             />
                         </div>
                     )}

                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Quem cozinha?</label>
                         <select 
                             value={patient.whoCooks} 
                             onChange={e => setPatient({...patient, whoCooks: e.target.value})}
                             className="w-full border rounded p-2 text-sm bg-slate-50"
                         >
                             <option value="self">O Próprio Paciente</option>
                             <option value="partner">Cônjuge/Parceiro(a)</option>
                             <option value="parents">Pais/Mãe/Pai</option>
                             <option value="maid">Empregada/Cozinheira</option>
                             <option value="restaurant">Come fora/Restaurante</option>
                         </select>
                     </div>

                     {/* Budget */}
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Coins size={12}/> Gasto Mensal Alimentação (R$)</label>
                         <input 
                             type="number" 
                             placeholder="0,00"
                             value={patient.foodBudget || ''} 
                             onChange={e => setPatient({...patient, foodBudget: Number(e.target.value)})}
                             className="w-full border rounded p-2 text-sm"
                         />
                     </div>
                 </div>
             </div>

             {/* CLINICAL SIGNS */}
             <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Dehydration */}
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                     <h5 className="font-semibold text-sm text-slate-700 mb-2">Sinais de Desidratação</h5>
                     <div className="space-y-1">
                         {['Urina escura', 'Boca seca', 'Tontura', 'Dor de cabeça', 'Cãibras', 'Fraqueza'].map(opt => (
                             <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                                 <input 
                                     type="checkbox" 
                                     checked={patient.clinicalSigns.dehydration?.includes(opt)}
                                     onChange={() => toggleMultiSelect('dehydration', opt)}
                                     className="rounded text-emerald-600 focus:ring-emerald-500"
                                 /> {opt}
                             </label>
                         ))}
                     </div>
                 </div>

                 {/* Hair, Nails, Skin */}
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                     <h5 className="font-semibold text-sm text-slate-700 mb-2">Cabelos, Unhas e Pele</h5>
                     <div className="space-y-1">
                         {['Queda de cabelo', 'Cabelo fraco', 'Cabelo seco'].map(opt => (
                             <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                                 <input type="checkbox" checked={patient.clinicalSigns.hair?.includes(opt)} onChange={() => toggleMultiSelect('hair', opt)} /> {opt}
                             </label>
                         ))}
                         <div className="h-px bg-slate-100 my-1"></div>
                         {['Unhas fracas', 'Manchas brancas', 'Ondulações'].map(opt => (
                             <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                                 <input type="checkbox" checked={patient.clinicalSigns.nails?.includes(opt)} onChange={() => toggleMultiSelect('nails', opt)} /> {opt}
                             </label>
                         ))}
                         <div className="h-px bg-slate-100 my-1"></div>
                         {['Pele seca', 'Acne/Oleosidade', 'Hematomas fáceis'].map(opt => (
                             <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                                 <input type="checkbox" checked={patient.clinicalSigns.skin?.includes(opt)} onChange={() => toggleMultiSelect('skin', opt)} /> {opt}
                             </label>
                         ))}
                     </div>
                 </div>

                 {/* GI & Behavior */}
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                     <h5 className="font-semibold text-sm text-slate-700 mb-2">Sintomas TGI</h5>
                     <div className="space-y-1 mb-4">
                         {['Azia/Queimação', 'Refluxo', 'Empachamento', 'Gases', 'Distensão abdominal', 'Constipação', 'Diarreia', 'Náuseas'].map(opt => (
                             <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                                 <input type="checkbox" checked={patient.clinicalSigns.giSymptoms?.includes(opt)} onChange={() => toggleMultiSelect('giSymptoms', opt)} /> {opt}
                             </label>
                         ))}
                     </div>
                     <h5 className="font-semibold text-sm text-slate-700 mb-2">Comportamento Alimentar</h5>
                     <div className="space-y-1">
                         {['Come rápido', 'Fome emocional', 'Belisca o dia todo', 'Culpa ao comer', 'Pula refeições'].map(opt => (
                             <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                                 <input type="checkbox" checked={patient.clinicalSigns.eatingBehavior?.includes(opt)} onChange={() => toggleMultiSelect('eatingBehavior', opt)} /> {opt}
                             </label>
                         ))}
                     </div>
                 </div>
             </div>
          </div>
      )}
      {subTab === 'exames' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4">Registro de Resultados de Exames</h3>
            <p className="text-sm text-slate-500 mb-6">Valores de Referência Funcionais (Ótimos)</p>
            
            <div className="space-y-6">
                {/* Group exams by their Category */}
                {(Object.values(labs.reduce((acc, lab) => {
                    const group = lab.group || 'Outros';
                    if (!acc[group]) acc[group] = [];
                    acc[group].push(lab);
                    return acc;
                }, {} as Record<string, typeof labs>)) as (typeof labs)[]).map((groupLabs, groupIdx) => (
                    <div key={groupIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{groupLabs[0].group}</h4>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupLabs.map((lab, i) => {
                                const originalIndex = labs.findIndex(l => l.name === lab.name);
                                return (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-semibold text-slate-600 truncate max-w-[150px]" title={lab.name}>{lab.name}</label>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                                lab.category === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                                                lab.category === 'low' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {lab.category === 'normal' ? 'OK' : lab.category === 'low' ? 'Baixo' : 'Alto'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                value={lab.value} 
                                                onChange={e => handleLabChange(originalIndex, 'value', e.target.value)} 
                                                className={`w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-emerald-400 outline-none ${
                                                    lab.value > 0 && lab.category !== 'normal' ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                                }`}
                                            />
                                            <span className="text-xs text-slate-400 w-8">{lab.unit}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                            Ideal: {lab.min} - {lab.max}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}
      {subTab === 'resultados' && (
         <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-emerald-600"/> Resultados Calculados & Adequações</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                     {/* Basic Anthropometry Card */}
                     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                         <h4 className="font-bold text-emerald-800 mb-3 text-sm uppercase">Diagnóstico Antropométrico</h4>
                         <div className="space-y-2 text-sm">
                             <div className="flex justify-between"><span>IMC:</span> <span className="font-bold">{results.bmi} kg/m²</span></div>
                             <div className="flex justify-between"><span>Classificação:</span> <span className="font-bold text-emerald-700">{results.bmiClass}</span></div>
                             {results.bmiPercentile && <div className="flex justify-between text-xs text-blue-600"><span>Nota:</span> <span>{results.bmiPercentile}</span></div>}
                             <div className="flex justify-between"><span>Peso Ideal (estimado):</span> <span className="font-bold">{results.idealWeight} kg</span></div>
                             <div className="flex justify-between"><span>RCQ (Risco Cardíaco):</span> <span className="font-bold">{results.whrRisk} ({results.whr})</span></div>
                         </div>
                     </div>

                     {/* Body Composition Card */}
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                         <h4 className="font-bold text-blue-800 mb-3 text-sm uppercase">Composição Corporal</h4>
                         <div className="space-y-2 text-sm">
                             <div className="flex justify-between"><span>Gordura Corporal:</span> <span className="font-bold">{results.bodyFatPercent}% ({results.fatMass} kg)</span></div>
                             <div className="flex justify-between"><span>Massa Magra:</span> <span className="font-bold">{results.leanMass} kg</span></div>
                             <div className="flex justify-between"><span>Água Corporal Ideal:</span> <span className="font-bold">{results.idealWater.toFixed(1)} L</span></div>
                             <div className="flex justify-between">
                                 <span>Déficit Hídrico:</span> 
                                 <span className={`font-bold ${results.waterDifference < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                     {(results.waterDifference / 1000).toFixed(1)} L
                                 </span>
                             </div>
                         </div>
                     </div>

                     {/* Energy Card */}
                     <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                         <h4 className="font-bold text-amber-800 mb-3 text-sm uppercase">Necessidades Energéticas</h4>
                         <div className="space-y-2 text-sm">
                             <div className="flex justify-between"><span>TMB (Basal):</span> <span className="font-bold">{results.bmr} kcal</span></div>
                             <div className="flex justify-between"><span>VET (Meta Total):</span> <span className="font-bold text-lg">{results.vet} kcal</span></div>
                             <div className="flex justify-between border-t border-amber-200 pt-2">
                                 <span>Objetivo:</span> 
                                 <span className="font-bold uppercase text-xs bg-white px-2 py-0.5 rounded border border-amber-200">
                                     {patient.weightGoal === 'lose' ? 'Perder Peso' : patient.weightGoal === 'gain' ? 'Ganhar Peso' : 'Manter'}
                                 </span>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Adequacies Table */}
                 <div className="mb-8">
                     <h4 className="font-bold text-slate-700 mb-3 text-sm">Adequações Antropométricas (Frisancho)</h4>
                     <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                             <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                 <tr>
                                     <th className="px-4 py-2">Medida</th>
                                     <th className="px-4 py-2">Valor</th>
                                     <th className="px-4 py-2">Adequação (%)</th>
                                     <th className="px-4 py-2">Classificação</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                 <tr>
                                     <td className="px-4 py-2 font-medium">Circunferência Braço (CB)</td>
                                     <td className="px-4 py-2">{patient.armCirc} cm</td>
                                     <td className="px-4 py-2">{results.armCircAdequacy}%</td>
                                     <td className="px-4 py-2 text-xs text-slate-500">{results.armCircAdequacy < 90 ? 'Desnutrição' : results.armCircAdequacy > 110 ? 'Obesidade' : 'Eutrofia'}</td>
                                 </tr>
                                 <tr>
                                     <td className="px-4 py-2 font-medium">Dobra Tricipital (DCT)</td>
                                     <td className="px-4 py-2">{patient.tricepsFold} mm</td>
                                     <td className="px-4 py-2">{results.tricepsFoldAdequacy}%</td>
                                     <td className="px-4 py-2 text-xs text-slate-500">Reserva de Gordura</td>
                                 </tr>
                                 <tr>
                                     <td className="px-4 py-2 font-medium">Circ. Muscular Braço (CMB)</td>
                                     <td className="px-4 py-2">{results.armMuscleCirc} cm</td>
                                     <td className="px-4 py-2">{results.armMuscleCircAdequacy}%</td>
                                     <td className="px-4 py-2 text-xs text-slate-500">Reserva Proteica</td>
                                 </tr>
                             </tbody>
                         </table>
                     </div>
                 </div>
             </div>

             {/* Clinical Suggestions */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><Lightbulb size={20} className="text-amber-500"/> Condutas Clínicas Sugeridas</h3>
                     <p className="text-xs text-slate-400 mb-4">Baseado na Anamnese e Sintomas relatados</p>
                     
                     <div className="space-y-4">
                         {getSymptomSuggestions(patient).length > 0 ? (
                             getSymptomSuggestions(patient).map((item, idx) => (
                                 <div key={idx} className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                     <p className="font-bold text-amber-800 text-sm mb-1">{item.symptom}</p>
                                     <p className="text-xs text-amber-900">{item.suggestion}</p>
                                 </div>
                             ))
                         ) : (
                             <p className="text-sm text-slate-500 italic">Nenhuma conduta específica identificada pelos sintomas marcados.</p>
                         )}
                     </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><CheckSquare size={20} className="text-blue-500"/> Condutas Laboratoriais</h3>
                     <p className="text-xs text-slate-400 mb-4">Baseado nos Exames com alterações</p>
                     
                     <div className="space-y-3">
                         {labs.filter(l => l.category !== 'normal').length > 0 ? (
                             labs.filter(l => l.category !== 'normal').map((lab, idx) => (
                                 <div key={idx} className={`p-3 rounded-lg border text-sm ${lab.category === 'high' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'}`}>
                                     <div className="flex justify-between mb-1">
                                         <span className="font-bold text-slate-700">{lab.name}</span>
                                         <span className="text-xs font-bold uppercase">{lab.category === 'high' ? 'Alto' : 'Baixo'}</span>
                                     </div>
                                     <p className="text-slate-600 text-xs">{getLabSuggestion(lab)}</p>
                                 </div>
                             ))
                         ) : (
                             <p className="text-sm text-slate-500 italic">Nenhum exame alterado cadastrado.</p>
                         )}
                     </div>
                 </div>
             </div>
         </div>
      )}
    </div>
  );

  const renderDiet = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex gap-2 border-b border-slate-200 pb-1">
          <button onClick={() => setDietSubTab('calculada')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${dietSubTab === 'calculada' ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500 hover:text-emerald-600'}`}>Dieta Calculada</button>
          <button onClick={() => setDietSubTab('recordatorio')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${dietSubTab === 'recordatorio' ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500 hover:text-emerald-600'}`}>Recordatório 24h</button>
        </div>

        {dietSubTab === 'calculada' && (
          <div className="space-y-4">
             {/* Import Model Button */}
             <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-600">Importar Modelo:</span>
                <select onChange={(e) => {
                    const model = dietModels.find(m => m.id === e.target.value);
                    if (model) setDietPlan(JSON.parse(JSON.stringify(model.plan)));
                }} className="border rounded p-1 text-sm w-64">
                    <option value="">Selecione...</option>
                    {dietModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
             </div>

             {Object.entries(dietPlan).map(([key, value]) => {
                if (key === 'observations' || key === 'substitutionList' || key === 'name') return null;
                const meal = value as Meal;
                const mealTotal = meal.foods.reduce((acc, f) => {
                    acc.kcal += f.calculated.calories;
                    acc.prot += f.calculated.protein;
                    acc.carb += f.calculated.carbs;
                    acc.fat += f.calculated.lipids;
                    return acc;
                }, {kcal:0, prot:0, carb:0, fat:0});

                return (
                  <div key={key} className={`bg-white rounded-xl shadow-sm border transition-all ${activeMealKey === key ? 'border-emerald-400 ring-1 ring-emerald-100' : 'border-slate-100'}`}>
                    <div 
                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded-t-xl"
                        onClick={() => setActiveMealKey(activeMealKey === key ? null : key as keyof DailyPlan)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${activeMealKey === key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                <Utensils size={18} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">{meal.name}</h4>
                                <p className="text-xs text-slate-400">{meal.time} • {Math.round(mealTotal.kcal)} kcal</p>
                            </div>
                        </div>
                        <ChevronDown size={18} className={`transition-transform text-slate-400 ${activeMealKey === key ? 'rotate-180' : ''}`} />
                    </div>

                    {activeMealKey === key && (
                        <div className="p-4 border-t border-slate-50 bg-slate-50/50 rounded-b-xl">
                            <div className="space-y-2 mb-3">
                                {meal.foods.length > 0 ? meal.foods.map((food, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                        <div>
                                            <p className="font-medium text-sm text-slate-700">{food.foodName}</p>
                                            <p className="text-xs text-slate-400">{food.quantity} {food.unitLabel} ({Math.round(food.grams)}g)</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right text-xs text-slate-500">
                                                <span className="block font-bold text-emerald-600">{Math.round(food.calculated.calories)} kcal</span>
                                                <span className="block">P:{Math.round(food.calculated.protein)} C:{Math.round(food.calculated.carbs)} G:{Math.round(food.calculated.lipids)}</span>
                                            </div>
                                            <button onClick={() => removeFoodFromMeal(key as keyof DailyPlan, idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-slate-400 text-center py-2">Nenhum alimento adicionado.</p>}
                            </div>
                        </div>
                    )}
                  </div>
                );
             })}
             
             {/* Total Summary */}
             <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg mt-6">
                 <h4 className="font-bold mb-4 flex items-center gap-2"><Activity size={18}/> Resumo Nutricional do Dia</h4>
                 {(() => {
                     const total = Object.values(dietPlan).reduce<{kcal: number, prot: number, carb: number, fat: number}>((acc, val) => {
                         if (typeof val === 'object' && val !== null && 'foods' in val) {
                             (val as Meal).foods.forEach(f => {
                                 acc.kcal += f.calculated.calories;
                                 acc.prot += f.calculated.protein;
                                 acc.carb += f.calculated.carbs;
                                 acc.fat += f.calculated.lipids;
                             });
                         }
                         return acc;
                     }, {kcal:0, prot:0, carb:0, fat:0});
                     
                     const pPct = total.kcal > 0 ? (total.prot * 4 / total.kcal) * 100 : 0;
                     const cPct = total.kcal > 0 ? (total.carb * 4 / total.kcal) * 100 : 0;
                     const fPct = total.kcal > 0 ? (total.fat * 9 / total.kcal) * 100 : 0;

                     return (
                         <div className="grid grid-cols-4 gap-4 text-center">
                             <div><span className="block text-2xl font-bold">{Math.round(total.kcal)}</span><span className="text-xs text-slate-400">kcal</span></div>
                             <div><span className="block text-xl font-bold text-emerald-400">{Math.round(total.prot)}g</span><span className="text-xs text-slate-400">Prot ({Math.round(pPct)}%)</span></div>
                             <div><span className="block text-xl font-bold text-blue-400">{Math.round(total.carb)}g</span><span className="text-xs text-slate-400">Carb ({Math.round(cPct)}%)</span></div>
                             <div><span className="block text-xl font-bold text-amber-400">{Math.round(total.fat)}g</span><span className="text-xs text-slate-400">Gord ({Math.round(fPct)}%)</span></div>
                         </div>
                     );
                 })()}
             </div>

             {/* Substitution List Import */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-center mb-4">
                     <h4 className="font-bold text-slate-700">Lista de Substituição</h4>
                     <select onChange={(e) => importSubstitutionToDiet(e.target.value)} className="border rounded p-1 text-sm">
                         <option value="">Importar Lista...</option>
                         {substitutionModels.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                     </select>
                 </div>
                 <textarea 
                     value={dietPlan.substitutionList || ''} 
                     onChange={e => setDietPlan({...dietPlan, substitutionList: e.target.value})}
                     className="w-full h-32 border rounded p-2 text-sm"
                     placeholder="Orientações de substituição..."
                 />
             </div>
          </div>
        )}
        
        {dietSubTab === 'recordatorio' && (
            <div className="space-y-4">
               {/* Simplified View for Recall - Reuse Logic but map recallPlan */}
               {Object.entries(recallPlan).map(([key, value]) => {
                if (key === 'observations' || key === 'substitutionList' || key === 'name') return null;
                const meal = value as Meal;
                return (
                  <div key={key} className={`bg-white rounded-xl shadow-sm border transition-all ${activeMealKey === key ? 'border-amber-400 ring-1 ring-amber-100' : 'border-slate-100'}`}>
                    <div 
                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded-t-xl"
                        onClick={() => setActiveMealKey(activeMealKey === key ? null : key as keyof DailyPlan)}
                    >
                         <h4 className="font-bold text-slate-700">{meal.name}</h4>
                         <ChevronDown size={18} className={`transition-transform text-slate-400 ${activeMealKey === key ? 'rotate-180' : ''}`} />
                    </div>
                     {activeMealKey === key && (
                        <div className="p-4 border-t border-slate-50 bg-slate-50/50 rounded-b-xl">
                            <div className="space-y-2 mb-3">
                                {meal.foods.length > 0 ? meal.foods.map((food, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                                        <span>{food.foodName} ({food.quantity} {food.unitLabel})</span>
                                        <button onClick={() => removeFoodFromMeal(key as keyof DailyPlan, idx, true)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                                    </div>
                                )) : <p className="text-sm text-slate-400 text-center">O que o paciente comeu?</p>}
                            </div>
                        </div>
                    )}
                  </div>
                );
               })}
            </div>
        )}
      </div>
      <div className="lg:col-span-1">
         {renderFoodSearch()}
      </div>
    </div>
  );

  const renderPrescription = () => (
      <div className="space-y-6">
          <div className="flex gap-2 border-b border-slate-200 pb-1 no-print">
              <button onClick={() => setPrescriptionSubTab('recipes')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${prescriptionSubTab === 'recipes' ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500 hover:text-emerald-600'}`}>Receituário</button>
              <button onClick={() => setPrescriptionSubTab('exams')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${prescriptionSubTab === 'exams' ? 'bg-white border-x border-t border-slate-200 text-emerald-700' : 'text-slate-500 hover:text-emerald-600'}`}>Pedido de Exames</button>
          </div>

          {prescriptionSubTab === 'recipes' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-slate-700 flex items-center gap-2"><Pill size={20} className="text-emerald-600"/> Prescrição de Suplementos / Fito</h3>
                          <button onClick={handlePrint} className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2 hover:bg-slate-900"><Printer size={16}/> Imprimir Receita</button>
                      </div>
                      <textarea 
                          value={prescription}
                          onChange={e => setPrescription(e.target.value)}
                          className="w-full h-[500px] p-6 border rounded-xl text-slate-700 leading-relaxed focus:ring-2 focus:ring-emerald-100 outline-none resize-none font-mono bg-slate-50"
                          placeholder="Digite a prescrição aqui..."
                      ></textarea>
                  </div>
                  <div className="lg:col-span-1">
                      <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 sticky top-6">
                          <h4 className="font-bold text-yellow-800 mb-4 flex items-center gap-2"><Lightbulb size={18}/> Dicas de Prescrição</h4>
                          <p className="text-sm text-yellow-900 mb-4">Lembre-se de especificar:</p>
                          <ul className="space-y-2 text-sm text-yellow-800 list-disc list-inside">
                              <li>Nome do ativo/suplemento</li>
                              <li>Dosagem exata</li>
                              <li>Posologia (como tomar)</li>
                              <li>Tempo de uso</li>
                              <li>Manipulado ou Industrializado?</li>
                          </ul>
                          <div className="mt-6 pt-6 border-t border-yellow-200">
                              <p className="text-xs text-yellow-700 font-bold">Exemplo Rápido:</p>
                              <p className="text-xs text-yellow-800 mt-1 italic">"Omega 3 (33/22) - 1g<br/>Tomar 1 cápsula no almoço e 1 no jantar."</p>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {prescriptionSubTab === 'exams' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-slate-700 flex items-center gap-2"><FlaskConical size={20} className="text-emerald-600"/> Solicitação de Exames</h3>
                          <button onClick={handlePrint} className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2 hover:bg-slate-900"><Printer size={16}/> Imprimir Pedido</button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                          {EXAM_LIST.map(exam => (
                              <label key={exam} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${selectedExams.includes(exam) ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                                  <input 
                                      type="checkbox" 
                                      checked={selectedExams.includes(exam)} 
                                      onChange={() => {
                                          if (selectedExams.includes(exam)) {
                                              setSelectedExams(selectedExams.filter(e => e !== exam));
                                          } else {
                                              setSelectedExams([...selectedExams, exam]);
                                          }
                                      }}
                                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="text-sm font-medium">{exam}</span>
                              </label>
                          ))}
                      </div>
                  </div>
                  <div className="lg:col-span-1">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 sticky top-6">
                          <h4 className="font-bold text-slate-700 mb-4">Resumo do Pedido</h4>
                          <ul className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                              {selectedExams.map(e => (
                                  <li key={e} className="text-sm text-slate-600 flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {e}
                                  </li>
                              ))}
                              {selectedExams.length === 0 && <li className="text-sm text-slate-400 italic">Nenhum exame selecionado.</li>}
                          </ul>
                          <p className="text-xs text-slate-400 text-center">Selecione os exames ao lado para gerar o pedido.</p>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderHistory = () => (
      <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><Clock size={20} className="text-emerald-600"/> Finalizar Atendimento & Evolução</h3>
               
               <div className="mb-6">
                   <label className="block text-sm font-bold text-slate-600 mb-2">Notas de Evolução (Privado)</label>
                   <textarea 
                       value={evolution} 
                       onChange={e => setEvolution(e.target.value)}
                       className="w-full h-32 border rounded-xl p-4 text-sm"
                       placeholder="Registre aqui a evolução do paciente, adesão ao plano, dificuldades relatadas..."
                   ></textarea>
               </div>
               
               <div className="flex justify-end gap-3">
                   <button onClick={() => {
                       saveConsultationHistory();
                       setEvolution(''); 
                   }} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 flex items-center gap-2">
                       <Save size={18}/> Salvar Evolução e Finalizar
                   </button>
               </div>
           </div>

           {patient.history.length > 0 && (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h4 className="font-bold text-slate-700 mb-4">Histórico de Consultas</h4>
                   <div className="overflow-x-auto">
                       <table className="w-full text-sm text-left">
                           <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                               <tr>
                                   <th className="px-4 py-3">Data</th>
                                   <th className="px-4 py-3">Peso (kg)</th>
                                   <th className="px-4 py-3">% Gordura</th>
                                   <th className="px-4 py-3">M. Magra (kg)</th>
                                   <th className="px-4 py-3">Dobra Tricipital</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                               {patient.history.map((h, i) => (
                                   <tr key={i} className="hover:bg-slate-50">
                                       <td className="px-4 py-3 font-medium text-slate-700">{h.date}</td>
                                       <td className="px-4 py-3">{h.weight}</td>
                                       <td className="px-4 py-3">{h.bodyFat}</td>
                                       <td className="px-4 py-3">{h.leanMass}</td>
                                       <td className="px-4 py-3">{h.tricepsFold}</td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           )}
      </div>
  );

  const renderSettings = () => (
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><Settings size={20}/> Configurações do Profissional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Nome Profissional</label>
                      <input type="text" value={nutritionist.name} onChange={e => setNutritionist({...nutritionist, name: e.target.value})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">CRN</label>
                      <input type="text" value={nutritionist.crn} onChange={e => setNutritionist({...nutritionist, crn: e.target.value})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                      <input type="email" value={nutritionist.email} onChange={e => setNutritionist({...nutritionist, email: e.target.value})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Telefone</label>
                      <input type="tel" value={nutritionist.phone} onChange={e => setNutritionist({...nutritionist, phone: e.target.value})} className="w-full border rounded p-2" />
                  </div>
                  <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Endereço</label>
                      <input type="text" value={nutritionist.address} onChange={e => setNutritionist({...nutritionist, address: e.target.value})} className="w-full border rounded p-2" />
                  </div>
                  <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Logo URL</label>
                      <div className="flex gap-2">
                          <input type="text" value={nutritionist.logoUrl} onChange={e => setNutritionist({...nutritionist, logoUrl: e.target.value})} className="w-full border rounded p-2" />
                          <label className="px-4 py-2 bg-slate-100 border rounded cursor-pointer hover:bg-slate-200 text-sm flex items-center">
                              Upload
                              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                          </label>
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Cor Primária</label>
                      <input type="color" value={nutritionist.theme.primaryColor} onChange={e => setNutritionist({...nutritionist, theme: {...nutritionist.theme, primaryColor: e.target.value}})} className="w-full h-10 border rounded cursor-pointer" />
                  </div>
              </div>
              
              <h4 className="font-bold text-slate-700 mt-8 mb-4 flex items-center gap-2 text-sm uppercase">Redes Sociais</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Instagram size={14}/> Instagram</label>
                      <input type="text" placeholder="@seu.perfil" value={nutritionist.socialMedia?.instagram || ''} onChange={e => setNutritionist({...nutritionist, socialMedia: {...nutritionist.socialMedia, instagram: e.target.value}})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Facebook size={14}/> Facebook</label>
                      <input type="text" placeholder="/suapagina" value={nutritionist.socialMedia?.facebook || ''} onChange={e => setNutritionist({...nutritionist, socialMedia: {...nutritionist.socialMedia, facebook: e.target.value}})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Video size={14}/> TikTok</label>
                      <input type="text" placeholder="@seu.tiktok" value={nutritionist.socialMedia?.tiktok || ''} onChange={e => setNutritionist({...nutritionist, socialMedia: {...nutritionist.socialMedia, tiktok: e.target.value}})} className="w-full border rounded p-2" />
                  </div>
              </div>

              <h4 className="font-bold text-slate-700 mt-8 mb-4 flex items-center gap-2 text-sm uppercase">Mensagens Automáticas (WhatsApp)</h4>
              <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                      <p className="text-xs text-slate-500 mb-2">Use os seguintes marcadores para personalizar suas mensagens:</p>
                      <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-white border rounded text-xs font-mono">{'{PACIENTE}'}</span>
                          <span className="px-2 py-1 bg-white border rounded text-xs font-mono">{'{DATA}'}</span>
                          <span className="px-2 py-1 bg-white border rounded text-xs font-mono">{'{HORA}'}</span>
                          <span className="px-2 py-1 bg-white border rounded text-xs font-mono">{'{NUTRICIONISTA}'}</span>
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Mensagem de Agendamento</label>
                      <textarea 
                          value={nutritionist.whatsappMessages.appointment} 
                          onChange={e => setNutritionist({...nutritionist, whatsappMessages: {...nutritionist.whatsappMessages, appointment: e.target.value}})} 
                          className="w-full border rounded p-2 text-sm h-20"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Mensagem de Reagendamento</label>
                      <textarea 
                          value={nutritionist.whatsappMessages.rescheduling} 
                          onChange={e => setNutritionist({...nutritionist, whatsappMessages: {...nutritionist.whatsappMessages, rescheduling: e.target.value}})} 
                          className="w-full border rounded p-2 text-sm h-20"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Mensagem de Retorno</label>
                      <textarea 
                          value={nutritionist.whatsappMessages.return} 
                          onChange={e => setNutritionist({...nutritionist, whatsappMessages: {...nutritionist.whatsappMessages, return: e.target.value}})} 
                          className="w-full border rounded p-2 text-sm h-20"
                      />
                  </div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><Calendar size={20}/> Configuração de Agenda</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Início (Horário)</label>
                      <input type="time" value={nutritionist.schedule.startHour} onChange={e => setNutritionist({...nutritionist, schedule: {...nutritionist.schedule, startHour: e.target.value}})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Fim (Horário)</label>
                      <input type="time" value={nutritionist.schedule.endHour} onChange={e => setNutritionist({...nutritionist, schedule: {...nutritionist.schedule, endHour: e.target.value}})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Duração (min)</label>
                      <input type="number" value={nutritionist.schedule.slotDuration} onChange={e => setNutritionist({...nutritionist, schedule: {...nutritionist.schedule, slotDuration: Number(e.target.value)}})} className="w-full border rounded p-2" />
                  </div>
              </div>
              
              <div className="border-t pt-4">
                  <h4 className="font-bold text-sm text-slate-700 mb-3">Bloqueio de Horários (Padrão)</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                      {generateSettingsSlots().map(time => (
                          <button 
                              key={time} 
                              onClick={() => toggleBlockedTime(time)}
                              className={`text-xs px-2 py-1 rounded border ${nutritionist.schedule.blockedTimes.includes(time) ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                          >
                              {time}
                          </button>
                      ))}
                  </div>
                  
                  <h4 className="font-bold text-sm text-slate-700 mb-3">Bloqueio de Datas Específicas</h4>
                  <div className="flex gap-2 mb-3">
                      <input type="date" value={dateToBlock} onChange={e => setDateToBlock(e.target.value)} className="border rounded p-2 text-sm" />
                      <button onClick={addBlockedDate} className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600">Bloquear Data</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {nutritionist.schedule.blockedDates.map(date => (
                          <div key={date} className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-xs">
                              {date}
                              <button onClick={() => removeBlockedDate(date)} className="hover:text-red-900"><X size={12}/></button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  const PrintLayout = () => {
      // Only render if we are on the prescription tab (which now includes labs)
      if (activeTab !== 'prescription') return null;

      return (
          <div className="hidden print:block p-8 bg-white text-black font-sans">
              {/* Conditional Header based on SubTab */}
              {prescriptionSubTab === 'recipes' && (
                  <>
                    <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-6 mb-8">
                        <div className="flex items-center gap-6">
                            {nutritionist.logoUrl ? (
                                <img src={nutritionist.logoUrl} className="w-24 h-24 object-contain rounded-lg" alt="Logo" />
                            ) : (
                                <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-800 font-bold text-xl">LOGO</div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-emerald-800 mb-1">{nutritionist.name}</h1>
                                <p className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">{nutritionist.crn}</p>
                                <div className="text-xs text-slate-500 space-y-0.5">
                                    <p>{nutritionist.email} | {nutritionist.phone}</p>
                                    <p>{nutritionist.address}</p>
                                    <div className="flex gap-3 mt-1 font-medium text-emerald-700">
                                        {nutritionist.socialMedia?.instagram && <span>IG: {nutritionist.socialMedia.instagram}</span>}
                                        {nutritionist.socialMedia?.facebook && <span>FB: {nutritionist.socialMedia.facebook}</span>}
                                        {nutritionist.socialMedia?.tiktok && <span>TikTok: {nutritionist.socialMedia.tiktok}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                            <p>Emissão: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    {/* Patient Info Header for Recipe */}
                    <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-sm"><span className="font-bold">Paciente:</span> {patient.name}</p>
                        <p className="text-sm"><span className="font-bold">Idade:</span> {patient.age} anos</p>
                    </div>
                  </>
              )}

              {prescriptionSubTab === 'exams' && (
                  <div className="flex flex-col items-center mb-8">
                        {nutritionist.logoUrl && (
                            <img src={nutritionist.logoUrl} className="w-20 h-20 object-contain mb-2" alt="Logo" />
                        )}
                        <h1 className="text-2xl font-serif text-emerald-900 italic">{nutritionist.name}</h1>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">NUTRICIONISTA</p>
                        
                        <div className="w-full mt-8 mb-6 border-b border-slate-800 pb-1 flex justify-between items-end text-sm">
                            <div className="flex gap-2 w-3/4">
                                <span className="font-bold text-slate-700">Paciente:</span>
                                <span className="flex-1 border-b border-dotted border-slate-400 pl-2">{patient.name}</span>
                            </div>
                            <div className="flex gap-2 w-1/4 justify-end">
                                <span className="font-bold text-slate-700">Data:</span>
                                <span className="border-b border-dotted border-slate-400 pl-2 min-w-[100px]">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                  </div>
              )}

              {/* Content Body */}
              <div className="min-h-[600px] mb-8">
                  {prescriptionSubTab === 'recipes' && (
                      <div>
                          <h2 className="text-2xl font-bold text-center mb-10 uppercase tracking-widest text-emerald-800 border-b pb-2 w-1/2 mx-auto">Receituário</h2>
                          <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-800 px-4">
                              {prescription}
                          </div>
                      </div>
                  )}

                  {prescriptionSubTab === 'exams' && (
                      <div>
                          <div className="flex justify-center mb-8">
                              <span className="bg-emerald-100/50 text-emerald-900 px-6 py-1.5 rounded-full font-bold text-sm uppercase tracking-wide">
                                  Solicitação de exames laboratoriais
                              </span>
                          </div>
                          <div className="grid grid-cols-2 gap-y-3 gap-x-8 px-4 text-sm">
                              {selectedExams.map(exam => (
                                  <div key={exam} className="flex items-center gap-3">
                                      <div className="w-4 h-4 border border-slate-400 flex items-center justify-center shrink-0">
                                          {/* Checkbox simulated */}
                                          <div className="w-2.5 h-2.5 bg-slate-600"></div>
                                      </div>
                                      <span className="text-slate-700">{exam}</span>
                                  </div>
                              ))}
                          </div>
                          {selectedExams.length === 0 && <p className="text-center text-slate-400 italic mt-10">Nenhum exame selecionado.</p>}
                      </div>
                  )}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-8 border-t-2 border-slate-100 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                  {prescriptionSubTab === 'exams' && (
                      <div className="mb-4 pt-8 w-64 border-t border-slate-800">
                          <p className="font-bold text-slate-800">{nutritionist.name}</p>
                          <p className="text-[10px]">Nutricionista</p>
                      </div>
                  )}
                  
                  <p className="font-medium text-slate-600">{nutritionist.address}</p>
                  <p>{nutritionist.phone} • {nutritionist.email}</p>
                  <div className="flex gap-4 mt-2 text-emerald-600 font-bold">
                      {nutritionist.socialMedia?.instagram && <span>{nutritionist.socialMedia.instagram}</span>}
                      {nutritionist.socialMedia?.tiktok && <span>{nutritionist.socialMedia.tiktok}</span>}
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-600">
      {activeTab !== 'home' && renderSidebar()}
      <main className={`flex-1 p-8 no-print ${activeTab !== 'home' ? 'ml-64' : ''}`}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'registration' && renderRegistration()}
        {activeTab === 'assessment' && renderAssessment()}
        {activeTab === 'diet' && renderDiet()}
        {activeTab === 'focoNoPrato' && renderFocoNoPrato()}
        {activeTab === 'prescription' && renderPrescription()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'historyAnalytics' && renderHistoryAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </main>
      
      {/* Print Layout (Hidden on Screen, Visible on Print) */}
      <PrintLayout />
    </div>
  );
}
