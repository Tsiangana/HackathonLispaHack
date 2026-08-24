import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Provider,
  ProviderLocation,
  HealthcareService,
  OperationalInterruption,
  Announcement,
  PatientRequest,
  InfrastructureTelemetry,
  TeamMember,
  User,
  OnboardingState,
  ServiceStatus,
  UserRole,
} from "../types/provider";

const initialProvider: Provider = {
  id: "prov-001",
  name: "Hospital Central SaúdeLink",
  legalName: "Instituto de Saúde e Medicina Central S.A.",
  type: "hospital",
  description:
    "Centro hospitalar de alta complexidade com atendimento de emergência 24/7, UTI de ponta, diagnóstico por imagem e consultas especializadas.",
  verificationStatus: "verified",
  plan: "professional",
  phone: "+244 923 456 789",
  emergencyPhone: "+244 911 000 999",
  email: "contato@hospitalsaudelink.co.ao",
  website: "https://hospitalsaudelink.co.ao",
  cnpj: "AO.504.992.112",
  logoUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&auto=format&fit=crop&q=80",
  rating: 4.9,
  reviewCount: 428,
  createdAt: "2024-01-15T08:00:00Z",
  updatedAt: new Date().toISOString(),
};

const initialLocations: ProviderLocation[] = [
  {
    id: "loc-001",
    providerId: "prov-001",
    name: "Campus Principal - Talatona",
    address: "Avenida Luanda Sul, Quadra 14, Via AL4",
    city: "Luanda",
    state: "Luanda",
    zipCode: "1000",
    latitude: -8.9167,
    longitude: 13.1833,
    isMain: true,
    emergencyAvailable: true,
    phone: "+244 923 456 789",
    operatingHours: [
      { day: "monday", label: "Segunda-feira", openTime: "00:00", closeTime: "23:59", is24Hours: true, isClosed: false },
      { day: "tuesday", label: "Terça-feira", openTime: "00:00", closeTime: "23:59", is24Hours: true, isClosed: false },
      { day: "wednesday", label: "Quarta-feira", openTime: "00:00", closeTime: "23:59", is24Hours: true, isClosed: false },
      { day: "thursday", label: "Quinta-feira", openTime: "00:00", closeTime: "23:59", is24Hours: true, isClosed: false },
      { day: "friday", label: "Sexta-feira", openTime: "00:00", closeTime: "23:59", is24Hours: true, isClosed: false },
      { day: "saturday", label: "Sábado", openTime: "00:00", closeTime: "23:59", is24Hours: true, isClosed: false },
      { day: "sunday", label: "Domingo", openTime: "00:00", closeTime: "23:59", is24Hours: true, isClosed: false },
    ],
  },
  {
    id: "loc-002",
    providerId: "prov-001",
    name: "Unidade Externa de Diagnóstico - Maianga",
    address: "Rua Amílcar Cabral, Nº 88",
    city: "Luanda",
    state: "Luanda",
    zipCode: "1002",
    latitude: -8.8234,
    longitude: 13.2345,
    isMain: false,
    emergencyAvailable: false,
    phone: "+244 923 456 790",
    operatingHours: [
      { day: "monday", label: "Segunda-feira", openTime: "07:00", closeTime: "19:00", is24Hours: false, isClosed: false },
      { day: "tuesday", label: "Terça-feira", openTime: "07:00", closeTime: "19:00", is24Hours: false, isClosed: false },
      { day: "wednesday", label: "Quarta-feira", openTime: "07:00", closeTime: "19:00", is24Hours: false, isClosed: false },
      { day: "thursday", label: "Quinta-feira", openTime: "07:00", closeTime: "19:00", is24Hours: false, isClosed: false },
      { day: "friday", label: "Sexta-feira", openTime: "07:00", closeTime: "19:00", is24Hours: false, isClosed: false },
      { day: "saturday", label: "Sábado", openTime: "08:00", closeTime: "14:00", is24Hours: false, isClosed: false },
      { day: "sunday", label: "Domingo", openTime: "", closeTime: "", is24Hours: false, isClosed: true },
    ],
  },
];

const initialServices: HealthcareService[] = [
  {
    id: "srv-001",
    name: "Pronto Socorro Geral 24h",
    category: "emergency",
    description: "Atendimento imediato para urgências e emergências adultas e pediátricas.",
    status: "operational",
    waitTimeMinutes: 15,
    capacityPercentage: 72,
    isEmergency: true,
    locationId: "loc-001",
    locationName: "Campus Principal - Talatona",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "srv-002",
    name: "Radiologia e Tomografia Computadorizada",
    category: "radiology",
    description: "Raios-X digital, Tomografia Multislice 128 canais e Ressonância Magnética.",
    status: "interrupted",
    waitTimeMinutes: 90,
    capacityPercentage: 95,
    isEmergency: false,
    locationId: "loc-001",
    locationName: "Campus Principal - Talatona",
    lastUpdated: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: "srv-003",
    name: "Laboratório de Análises Clínicas",
    category: "laboratory",
    description: "Exames de sangue, bioquímicos, hormônios e microbiologia com entrega expressa.",
    status: "operational",
    waitTimeMinutes: 10,
    capacityPercentage: 45,
    isEmergency: false,
    locationId: "loc-001",
    locationName: "Campus Principal - Talatona",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "srv-004",
    name: "Unidade de Terapia Intensiva (UTI Adulto)",
    category: "icu",
    description: "Leitos monitorados de alta complexidade com suporte ventilatório contínuo.",
    status: "busy",
    waitTimeMinutes: 0,
    capacityPercentage: 88,
    isEmergency: true,
    locationId: "loc-001",
    locationName: "Campus Principal - Talatona",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "srv-005",
    name: "Pediatria e Emergência Infantil",
    category: "pediatrics",
    description: "Consulta de urgência e ambulatório pediátrico especializado.",
    status: "operational",
    waitTimeMinutes: 20,
    capacityPercentage: 60,
    isEmergency: true,
    locationId: "loc-001",
    locationName: "Campus Principal - Talatona",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "srv-006",
    name: "Cardiologia & Eletrocardiograma",
    category: "cardiology",
    description: "Exames cardiológicos, Teste Ergométrico e Ecocardiograma com Doppler.",
    status: "operational",
    waitTimeMinutes: 25,
    capacityPercentage: 50,
    isEmergency: false,
    locationId: "loc-002",
    locationName: "Unidade Externa - Maianga",
    lastUpdated: new Date().toISOString(),
  },
];

const initialInterruptions: OperationalInterruption[] = [
  {
    id: "int-001",
    serviceId: "srv-002",
    serviceName: "Radiologia e Tomografia Computadorizada",
    title: "Manutenção Preventiva no Scanner Tomógrafo B",
    reason: "Atualização de calibração periódica do tubo de raios-X.",
    severity: "warning",
    estimatedResolution: "Hoje às 17:30",
    notifiedPatientsCount: 142,
    status: "active",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: "anc-001",
    title: "Campanha Urgente de Doação de Sangue O- e A+",
    content: "O Banco de Sangue do SaúdeLink Central convida a comunidade para doações neste sábado. Atendimento prioritário para doadores.",
    type: "urgent",
    targetAudience: "all",
    status: "published",
    viewsCount: 1840,
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "anc-002",
    title: "Novos Equipamentos de Ressonância 3T Operacionais",
    content: "Anunciamos a ativação do novo ressonador de alta definição com tempo de exame reduzido em 40%.",
    type: "general",
    targetAudience: "patients",
    status: "published",
    viewsCount: 920,
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const initialRequests: PatientRequest[] = [
  {
    id: "req-101",
    patientName: "Dr. Mateus Francisco",
    patientPhone: "+244 945 112 233",
    patientEmail: "mateus.f@gmail.com",
    serviceId: "srv-002",
    serviceName: "Radiologia e Tomografia Computadorizada",
    type: "exam",
    status: "pending",
    priority: "urgent",
    notes: "Paciente com requisição médica de TC de Tórax com contraste.",
    scheduledTime: "2026-08-24 10:00",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "req-102",
    patientName: "Ana Paula Silva",
    patientPhone: "+244 923 887 665",
    patientEmail: "anapaula.silva@hotmail.com",
    serviceId: "srv-006",
    serviceName: "Cardiologia & Eletrocardiograma",
    type: "appointment",
    status: "accepted",
    priority: "normal",
    notes: "Consulta de rotina com eletrocardiograma.",
    scheduledTime: "2026-08-25 14:30",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: "req-103",
    patientName: "Carlos Eduardo Mendes",
    patientPhone: "+244 912 334 556",
    serviceId: "srv-001",
    serviceName: "Pronto Socorro Geral 24h",
    type: "emergency_triage",
    status: "in_progress",
    priority: "emergency",
    notes: "Chegada em ambulância com dor torácica aguda. Encaminhado à Sala Vermelha.",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: "req-104",
    patientName: "Maria Helena Castro",
    patientPhone: "+244 928 776 554",
    serviceId: "srv-003",
    serviceName: "Laboratório de Análises Clínicas",
    type: "inquiry",
    status: "completed",
    priority: "normal",
    notes: "Dúvida sobre necessidade de jejum para exame de perfil lipídico.",
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
  },
];

const initialTelemetry: InfrastructureTelemetry[] = [
  {
    systemId: "sys-bed-01",
    systemName: "Ocupação da UTI Adulto",
    category: "beds",
    healthPercentage: 88,
    status: "warning",
    details: "22 de 25 leitos ocupados. 3 leitos de reserva cirúrgica livre.",
    lastCheck: "Agora",
    metricValue: "88%",
  },
  {
    systemId: "sys-oxy-01",
    systemName: "Usina Principal de Oxigênio Medicinal",
    category: "oxygen",
    healthPercentage: 98,
    status: "normal",
    details: "Pressão de linha em 4.2 bar (Faixa ideal: 4.0 - 4.5 bar). Tank em 94%.",
    lastCheck: "Há 2 min",
    metricValue: "4.2 bar",
  },
  {
    systemId: "sys-scn-01",
    systemName: "Tomógrafo Computadorizado Siemens 128",
    category: "scanners",
    healthPercentage: 45,
    status: "critical",
    details: "Em calibração técnica de tubo de emissão. Resolução prevista 17:30.",
    lastCheck: "Há 5 min",
    metricValue: "Offline",
  },
  {
    systemId: "sys-net-01",
    systemName: "Rede Integrada & Gateway SaúdeLink API",
    category: "network",
    healthPercentage: 100,
    status: "normal",
    details: "Latência média de sincronização: 42ms. 100% dos pacotes confirmados.",
    lastCheck: "Agora",
    metricValue: "42ms",
  },
  {
    systemId: "sys-pwr-01",
    systemName: "Gerador de Emergência & No-Break Tri-Fásico",
    category: "power",
    healthPercentage: 96,
    status: "normal",
    details: "Combustível gerador principal: 96%. Teste automático semanal OK.",
    lastCheck: "Há 1 hora",
    metricValue: "96%",
  },
];

const initialTeam: TeamMember[] = [
  {
    id: "usr-001",
    name: "Dra. Patrícia Zau",
    email: "patricia.zau@saudelink.co.ao",
    role: "owner",
    department: "Direção Médica & Operativa",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    lastActive: "Agora",
  },
  {
    id: "usr-002",
    name: "Eng. Paulo Silva",
    email: "paulo.silva@saudelink.co.ao",
    role: "admin",
    department: "Tecnologia da Informação & Infraestrutura",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    lastActive: "Há 12 min",
  },
  {
    id: "usr-003",
    name: "Enf. Carla Fernandes",
    email: "carla.fernandes@saudelink.co.ao",
    role: "operations",
    department: "Triagem & Atendimento",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1594824813571-24a6983084c8?w=150&auto=format&fit=crop&q=80",
    lastActive: "Há 1 hora",
  },
  {
    id: "usr-004",
    name: "Marcos Ribeiro",
    email: "marcos.ribeiro@saudelink.co.ao",
    role: "staff",
    department: "Recepção Central",
    status: "active",
    lastActive: "Ontem",
  },
];

const initialUser: User = {
  id: "usr-001",
  name: "Dra. Patrícia Zau",
  email: "patricia.zau@saudelink.co.ao",
  role: "owner",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
};

const initialOnboardingState: OnboardingState = {
  currentStep: 1,
  isCompleted: true,
  account: {
    email: "contato@hospitalsaudelink.co.ao",
    fullName: "Dra. Patrícia Zau",
  },
  institution: initialProvider,
  location: initialLocations[0],
  contacts: {
    phone: "+244 923 456 789",
    emergencyPhone: "+244 911 000 999",
    email: "contato@hospitalsaudelink.co.ao",
    website: "https://hospitalsaudelink.co.ao",
  },
  services: initialServices,
  operatingHours: initialLocations[0].operatingHours,
  verification: {
    licenseNumber: "MINSA-LU-2024-8842",
    documentUploaded: true,
    termsAccepted: true,
  },
};

interface ProviderState {
  isAuthenticated: boolean;
  user: User;
  provider: Provider;
  locations: ProviderLocation[];
  services: HealthcareService[];
  interruptions: OperationalInterruption[];
  announcements: Announcement[];
  requests: PatientRequest[];
  telemetry: InfrastructureTelemetry[];
  team: TeamMember[];
  onboarding: OnboardingState;
  isPatientPreviewOpen: boolean;

  // Actions
  login: (email?: string, role?: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;

  updateProvider: (updates: Partial<Provider>) => void;
  updateLocation: (id: string, updates: Partial<ProviderLocation>) => void;
  addLocation: (location: Omit<ProviderLocation, "id">) => void;

  updateServiceStatus: (serviceId: string, status: ServiceStatus, waitTimeMinutes?: number, capacityPercentage?: number) => void;
  addService: (service: Omit<HealthcareService, "id" | "lastUpdated">) => void;
  deleteService: (serviceId: string) => void;

  createInterruption: (interruption: Omit<OperationalInterruption, "id" | "createdAt" | "status">) => void;
  resolveInterruption: (id: string) => void;

  createAnnouncement: (announcement: Omit<Announcement, "id" | "viewsCount" | "publishedAt">) => void;
  deleteAnnouncement: (id: string) => void;

  updateRequestStatus: (requestId: string, status: PatientRequest["status"]) => void;

  addTeamMember: (member: Omit<TeamMember, "id" | "lastActive">) => void;
  removeTeamMember: (id: string) => void;

  togglePatientPreview: () => void;
  setPatientPreviewOpen: (isOpen: boolean) => void;

  setOnboardingStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingState>) => void;
  completeOnboarding: () => void;
  resetDemoData: () => void;
}

export const useProviderStore = create<ProviderState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      user: initialUser,
      provider: initialProvider,
      locations: initialLocations,
      services: initialServices,
      interruptions: initialInterruptions,
      announcements: initialAnnouncements,
      requests: initialRequests,
      telemetry: initialTelemetry,
      team: initialTeam,
      onboarding: initialOnboardingState,
      isPatientPreviewOpen: false,

      login: (email = "contato@hospitalsaudelink.co.ao", role = "owner") => {
        set({
          isAuthenticated: true,
          user: {
            id: "usr-001",
            name: role === "owner" ? "Dra. Patrícia Zau" : "Gestor Operativo",
            email,
            role,
            avatarUrl: initialUser.avatarUrl,
          },
        });
      },

      logout: () => set({ isAuthenticated: false }),

      setRole: (role: UserRole) => {
        set((state) => ({
          user: { ...state.user, role },
        }));
      },

      updateProvider: (updates) => {
        set((state) => ({
          provider: { ...state.provider, ...updates, updatedAt: new Date().toISOString() },
        }));
      },

      updateLocation: (id, updates) => {
        set((state) => ({
          locations: state.locations.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc)),
        }));
      },

      addLocation: (newLoc) => {
        const id = `loc-${Date.now()}`;
        set((state) => ({
          locations: [...state.locations, { ...newLoc, id }],
        }));
      },

      updateServiceStatus: (serviceId, status, waitTimeMinutes, capacityPercentage) => {
        const now = new Date().toISOString();
        set((state) => {
          const service = state.services.find((s) => s.id === serviceId);
          const updatedServices = state.services.map((s) => {
            if (s.id === serviceId) {
              return {
                ...s,
                status,
                waitTimeMinutes: waitTimeMinutes ?? s.waitTimeMinutes,
                capacityPercentage: capacityPercentage ?? s.capacityPercentage,
                lastUpdated: now,
              };
            }
            return s;
          });

          // If status changes to interrupted, auto-log an interruption if not present
          let newInterruptions = state.interruptions;
          if (status === "interrupted" && service) {
            const hasActive = state.interruptions.some(
              (i) => i.serviceId === serviceId && i.status === "active"
            );
            if (!hasActive) {
              const newInt: OperationalInterruption = {
                id: `int-${Date.now()}`,
                serviceId,
                serviceName: service.name,
                title: `Interrupção Operativa em ${service.name}`,
                reason: "Serviço temporariamente indisponível para ajustes operativos.",
                severity: "warning",
                estimatedResolution: "Em andamento",
                notifiedPatientsCount: Math.floor(Math.random() * 80) + 20,
                status: "active",
                createdAt: now,
              };
              newInterruptions = [newInt, ...state.interruptions];
            }
          } else if (status === "operational" && service) {
            // Resolve interruptions for this service
            newInterruptions = state.interruptions.map((i) =>
              i.serviceId === serviceId ? { ...i, status: "resolved" } : i
            );
          }

          return {
            services: updatedServices,
            interruptions: newInterruptions,
          };
        });
      },

      addService: (newSrv) => {
        const id = `srv-${Date.now()}`;
        set((state) => ({
          services: [
            ...state.services,
            { ...newSrv, id, lastUpdated: new Date().toISOString() },
          ],
        }));
      },

      deleteService: (serviceId) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId),
        }));
      },

      createInterruption: (interruptionData) => {
        const newInt: OperationalInterruption = {
          ...interruptionData,
          id: `int-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: "active",
        };
        set((state) => ({
          interruptions: [newInt, ...state.interruptions],
          services: state.services.map((s) =>
            s.id === interruptionData.serviceId
              ? { ...s, status: "interrupted", lastUpdated: new Date().toISOString() }
              : s
          ),
        }));
      },

      resolveInterruption: (id) => {
        set((state) => {
          const target = state.interruptions.find((i) => i.id === id);
          const updatedInts = state.interruptions.map((i) =>
            i.id === id ? ({ ...i, status: "resolved" } as OperationalInterruption) : i
          );
          let updatedServices = state.services;
          if (target) {
            updatedServices = state.services.map((s) =>
              s.id === target.serviceId
                ? { ...s, status: "operational", lastUpdated: new Date().toISOString() }
                : s
            );
          }
          return { interruptions: updatedInts, services: updatedServices };
        });
      },

      createAnnouncement: (ancData) => {
        const newAnc: Announcement = {
          ...ancData,
          id: `anc-${Date.now()}`,
          viewsCount: 0,
          publishedAt: new Date().toISOString(),
        };
        set((state) => ({
          announcements: [newAnc, ...state.announcements],
        }));
      },

      deleteAnnouncement: (id) => {
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        }));
      },

      updateRequestStatus: (requestId, status) => {
        set((state) => ({
          requests: state.requests.map((r) => (r.id === requestId ? { ...r, status } : r)),
        }));
      },

      addTeamMember: (member) => {
        const newMember: TeamMember = {
          ...member,
          id: `usr-${Date.now()}`,
          lastActive: "Recém convidado",
        };
        set((state) => ({
          team: [...state.team, newMember],
        }));
      },

      removeTeamMember: (id) => {
        set((state) => ({
          team: state.team.filter((t) => t.id !== id),
        }));
      },

      togglePatientPreview: () => {
        set((state) => ({ isPatientPreviewOpen: !state.isPatientPreviewOpen }));
      },

      setPatientPreviewOpen: (isOpen) => set({ isPatientPreviewOpen: isOpen }),

      setOnboardingStep: (step) => {
        set((state) => ({
          onboarding: { ...state.onboarding, currentStep: step },
        }));
      },

      updateOnboardingData: (data) => {
        set((state) => ({
          onboarding: { ...state.onboarding, ...data },
        }));
      },

      completeOnboarding: () => {
        set((state) => ({
          onboarding: { ...state.onboarding, isCompleted: true },
          isAuthenticated: true,
        }));
      },

      resetDemoData: () => {
        set({
          isAuthenticated: true,
          user: initialUser,
          provider: initialProvider,
          locations: initialLocations,
          services: initialServices,
          interruptions: initialInterruptions,
          announcements: initialAnnouncements,
          requests: initialRequests,
          telemetry: initialTelemetry,
          team: initialTeam,
          onboarding: initialOnboardingState,
          isPatientPreviewOpen: false,
        });
      },
    }),
    {
      name: "saudelink-provider-storage",
    }
  )
);
