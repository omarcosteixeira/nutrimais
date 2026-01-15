import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Activity, Utensils, FileText, Settings, 
  Printer, Save, Plus, Trash2, Search,
  ChevronRight, ChevronDown, User, Activity as ActivityIcon,
  ClipboardList, FlaskConical, Pill, Menu, X,
  Baby, Flower2, CalendarHeart, Clock,
  UserPlus, BarChart2, MessageCircle, RefreshCw,
  AlertCircle, CalendarX, Trophy, Zap,
  Lightbulb, CheckSquare, TrendingUp, Brain,
  Instagram, Facebook, Video, Sparkles, Loader2,
  Coins, Briefcase, ChefHat, Apple, FileDown, FileUp, 
  Rocket, LayoutDashboard, Camera, LogOut, Key, UserCircle,
  ArrowRight
} from 'lucide-react';
import { BodyVisualizer } from './components/BodyVisualizer';
import { PatientData, Appointment, LabResult, Food, FoodEntry, Meal, DailyPlan, DietModel, NutritionistProfile, HistoryRecord, SubstitutionListModel, AiRecipe } from './types';
import { calculateResults, FOOD_DATABASE, calculateNutrients, getLabSuggestion, getSymptomSuggestions, EXAM_LIST, calculateAge, generateChartPath, FUNCTIONAL_LABS_DATABASE, GENDER_SPECIFIC_LABS } from './utils';
import { GoogleGenAI } from "@google/genai";

// Firebase Imports
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  addDoc
} from 'firebase/firestore';

// --- INITIAL STATES ---

const initialNutritionist: NutritionistProfile = {
  name: '',
  crn: 'CRN 0000',
  email: '',
  phone: '(00) 00000-0000',
  address: '',
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
    instagram: '',
    facebook: '',
    tiktok: ''
  },
  whatsappMessages: {
    appointment: 'Olá {PACIENTE}, confirmamos sua consulta com {NUTRICIONISTA} para o dia {DATA} às {HORA}. Por favor, confirme sua presença.',
    rescheduling: 'Olá {PACIENTE}, sua consulta com {NUTRICIONISTA} foi reagendada com sucesso para o dia {DATA} às {HORA}.',
    return: 'Olá {PACIENTE}, já está na hora de agendarmos seu retorno com {NUTRICIONISTA} para continuarmos sua evolução. Vamos marcar?'
  }
};

const initialPatient: PatientData = {
  id: '',
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
  goalKcalPerKg: 30,
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

export default function App() {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- APP STATES ---
  const [activeTab, setActiveTab] = useState('home');
  const [patient, setPatient] = useState<PatientData>(initialPatient);
  const [savedPatients, setSavedPatients] = useState<PatientData[]>([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [nutritionist, setNutritionist] = useState<NutritionistProfile>(initialNutritionist);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPatientName, setBookingPatientName] = useState('');
  const [dietModels, setDietModels] = useState<DietModel[]>([]);

  // --- FIREBASE SYNC ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Sincronizar Pacientes do Usuário
    const qPatients = query(collection(db, "patients"), where("userId", "==", currentUser.uid));
    const unsubPatients = onSnapshot(qPatients, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PatientData));
      setSavedPatients(list);
    });

    // Sincronizar Agendamentos do Usuário
    const qAppointments = query(collection(db, "appointments"), where("userId", "==", currentUser.uid));
    const unsubAppointments = onSnapshot(qAppointments, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(list);
    });

    // Sincronizar Perfil do Nutricionista
    const unsubProfile = onSnapshot(doc(db, "profiles", currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setNutritionist(docSnap.data() as NutritionistProfile);
      }
    });

    // Sincronizar Modelos de Dieta
    const qDietModels = query(collection(db, "dietModels"), where("userId", "==", currentUser.uid));
    const unsubDietModels = onSnapshot(qDietModels, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DietModel));
      setDietModels(list);
    });

    return () => {
      unsubPatients();
      unsubAppointments();
      unsubProfile();
      unsubDietModels();
    };
  }, [currentUser]);

  // --- AUTH ACTIONS ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
    } catch (err: any) {
      setAuthError('Falha no login. Verifique seu e-mail e senha.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName) return setAuthError('O nome é obrigatório para o cadastro.');
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      const user = userCredential.user;
      
      // Criar documento inicial de perfil
      await setDoc(doc(db, "profiles", user.uid), {
        ...initialNutritionist,
        name: authName,
        email: authEmail,
        userId: user.uid
      });
      
      alert('Cadastro realizado com sucesso!');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setAuthError('Este e-mail já está em uso.');
      else if (err.code === 'auth/weak-password') setAuthError('A senha deve ter pelo menos 6 caracteres.');
      else setAuthError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  // --- LOGIC ACTIONS ---

  const handleSavePatient = async () => {
    if (!currentUser) return;
    try {
      const patientData = { 
        ...patient, 
        userId: currentUser.uid, 
        age: calculateAge(patient.birthDate),
        updatedAt: new Date().toISOString()
      };

      if (patient.id) {
        await setDoc(doc(db, "patients", patient.id), patientData);
      } else {
        await addDoc(collection(db, "patients"), patientData);
      }

      alert('Paciente salvo no sistema!');
      setPatient(initialPatient);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar paciente.');
    }
  };

  const confirmBooking = async () => {
    if (!currentUser || !selectedDate || !selectedTimeSlot || !bookingPatientName) return;
    const patientObj = savedPatients.find(p => p.name.toLowerCase() === bookingPatientName.toLowerCase());
    if (!patientObj) return alert('Paciente não encontrado no sistema.');

    try {
      await addDoc(collection(db, "appointments"), {
        userId: currentUser.uid,
        date: selectedDate,
        time: selectedTimeSlot,
        patientName: bookingPatientName,
        patientPhone: patientObj.phone,
        patientEmail: patientObj.email,
        patientAge: patientObj.age,
        status: 'scheduled'
      });
      setIsBookingModalOpen(false);
      setBookingPatientName('');
    } catch (err) {
      alert('Erro ao agendar consulta.');
    }
  };

  // --- UI COMPONENTS ---

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-white/20 transform transition-all">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <ActivityIcon className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">NUTRI+ <span className="text-emerald-400">PRO</span></h1>
            <p className="text-slate-400 text-sm mt-2">
              {isSignupMode ? 'Crie seu perfil profissional' : 'Acesse sua plataforma profissional'}
            </p>
          </div>

          <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="space-y-5">
            {isSignupMode && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1 mb-2 block">Seu Nome Profissional</label>
                <div className="relative">
                  <UserCircle size={18} className="absolute left-4 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={authName} 
                    onChange={e => setAuthName(e.target.value)} 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                    placeholder="Ex: Nutri Maria Silva"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1 mb-2 block">E-mail</label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-3.5 text-slate-500" />
                <input 
                  type="email" 
                  value={authEmail} 
                  onChange={e => setAuthEmail(e.target.value)} 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1 mb-2 block">Senha</label>
              <div className="relative">
                <Key size={18} className="absolute left-4 top-3.5 text-slate-500" />
                <input 
                  type="password" 
                  value={authPassword} 
                  onChange={e => setAuthPassword(e.target.value)} 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2 animate-pulse">
                <AlertCircle size={14} /> {authError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <Loader2 size={24} className="animate-spin" /> : (
                <>
                  {isSignupMode ? <UserPlus size={20} /> : <Rocket size={20} />}
                  {isSignupMode ? 'Cadastrar' : 'Entrar no Sistema'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button 
              onClick={() => { setIsSignupMode(!isSignupMode); setAuthError(''); }}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-bold"
            >
              {isSignupMode ? 'Já tenho conta. Fazer Login' : 'Ainda não tem conta? Criar agora'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderSidebar = () => (
    <aside className="w-64 text-white min-h-screen fixed left-0 top-0 overflow-y-auto no-print z-10" style={{backgroundColor: nutritionist.theme.primaryColor}}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {nutritionist.logoUrl ? <img src={nutritionist.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <ActivityIcon className="text-emerald-700" />}
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg leading-tight truncate">NUTRI+</h1>
              <span className="text-emerald-400 text-xs font-normal">Pro System</span>
            </div>
        </div>
        
        <nav className="space-y-2">
          {[
            {id: 'home', icon: LayoutDashboard, label: 'Início'},
            {id: 'schedule', icon: Calendar, label: 'Agenda'},
            {id: 'registration', icon: UserPlus, label: 'Pacientes'},
            {id: 'assessment', icon: Activity, label: 'Avaliação'},
            {id: 'diet', icon: Utensils, label: 'Dieta'},
            {id: 'settings', icon: Settings, label: 'Ajustes'}
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10 text-slate-100'}`}>
                <item.icon size={20} /> {item.label}
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-300 mt-10">
            <LogOut size={20} /> Sair
          </button>
        </nav>
      </div>
    </aside>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-600">
      {activeTab !== 'home' && renderSidebar()}
      <main className={`flex-1 p-8 no-print ${activeTab !== 'home' ? 'ml-64' : ''}`}>
        <div className="animate-in fade-in duration-500">
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-6 inline-block">Sincronizado via Firebase</span>
                  <h1 className="text-6xl font-black mb-6 leading-tight">Olá, <span className="text-emerald-400">{nutritionist.name || 'Nutricionista'}</span></h1>
                  <p className="text-slate-400 text-lg mb-8">Gerencie seus pacientes e planos alimentares com dados seguros na nuvem.</p>
                  <button onClick={() => setActiveTab('schedule')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-bold flex items-center gap-3 shadow-lg transition-all">Ver Agenda <ArrowRight size={20}/></button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <Users className="text-blue-500 mb-4" size={32}/>
                  <div className="text-2xl font-black">{savedPatients.length}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold">Pacientes Ativos</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <Calendar className="text-emerald-500 mb-4" size={32}/>
                  <div className="text-2xl font-black">{appointments.filter(a => a.status === 'scheduled').length}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold">Consultas Hoje</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                   <LayoutDashboard className="text-purple-500 mb-4" size={32}/>
                   <div className="text-2xl font-black">Online</div>
                   <div className="text-xs text-slate-400 uppercase font-bold">Status Sistema</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                   <Key className="text-amber-500 mb-4" size={32}/>
                   <div className="text-lg font-bold truncate">{currentUser.email}</div>
                   <div className="text-xs text-slate-400 uppercase font-bold">Usuário Logado</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-slate-800">Agendamentos em Nuvem</h2>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"/>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(time => {
                  const app = appointments.find(a => a.date === selectedDate && a.time === time);
                  return (
                    <button 
                      key={time} 
                      onClick={() => {
                        if (app) return;
                        setSelectedTimeSlot(time);
                        setIsBookingModalOpen(true);
                      }} 
                      className={`p-6 rounded-2xl border transition-all text-center ${app ? 'bg-emerald-50 border-emerald-200 cursor-default' : 'bg-white border-slate-100 hover:bg-emerald-50'}`}
                    >
                      <div className="text-xl font-bold">{time}</div>
                      <div className="text-xs font-medium mt-1">{app ? app.patientName : 'Livre'}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'registration' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black mb-8">Cadastro de Pacientes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input placeholder="Nome Completo" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} className="border rounded-xl p-4 focus:ring-2 focus:ring-emerald-200 outline-none"/>
                <input type="date" value={patient.birthDate} onChange={e => setPatient({...patient, birthDate: e.target.value})} className="border rounded-xl p-4 focus:ring-2 focus:ring-emerald-200 outline-none"/>
                <input placeholder="WhatsApp" value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})} className="border rounded-xl p-4 focus:ring-2 focus:ring-emerald-200 outline-none"/>
                <input placeholder="E-mail" value={patient.email} onChange={e => setPatient({...patient, email: e.target.value})} className="border rounded-xl p-4 focus:ring-2 focus:ring-emerald-200 outline-none"/>
              </div>
              <button onClick={handleSavePatient} className="mt-8 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700">
                <Save size={20}/> Salvar no Firebase
              </button>
              
              <div className="mt-12">
                 <h3 className="text-lg font-bold mb-4">Pacientes Cadastrados</h3>
                 <div className="grid grid-cols-1 gap-4">
                    {savedPatients.map(p => (
                       <div key={p.id} className="flex justify-between items-center p-4 border rounded-2xl hover:bg-slate-50">
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.email} • {p.phone}</p>
                          </div>
                          <button onClick={() => setPatient(p)} className="text-emerald-600 font-bold hover:underline">Editar</button>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {['assessment', 'diet', 'settings'].includes(activeTab) && (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings size={40} className="text-slate-300 animate-spin-slow"/>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Interface em Expansão</h3>
              <p className="text-slate-500 mt-2">Esta funcionalidade está integrada ao Firebase e salvando dados em tempo real.</p>
              <button onClick={() => setActiveTab('home')} className="mt-6 text-emerald-600 font-bold hover:underline">Voltar ao Início</button>
            </div>
          )}
        </div>
      </main>
      
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-6">Agendar Consulta</h3>
            <p className="text-slate-500 mb-6">Horário selecionado: <span className="font-bold text-emerald-600">{selectedTimeSlot}</span></p>
            <div className="space-y-4">
              <select 
                value={bookingPatientName} 
                onChange={e => setBookingPatientName(e.target.value)}
                className="w-full border rounded-2xl p-4 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione o paciente...</option>
                {savedPatients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <button onClick={confirmBooking} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700">Confirmar no Banco de Dados</button>
              <button onClick={() => setIsBookingModalOpen(false)} className="w-full py-4 text-slate-400 hover:text-slate-600 font-bold">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
