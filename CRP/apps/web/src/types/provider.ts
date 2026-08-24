export type InstitutionType =
  | "hospital"
  | "clinic"
  | "laboratory"
  | "diagnostic_center"
  | "maternity"
  | "medical_center"
  | "other";

export type VerificationStatus =
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "requires_changes";

export type SubscriptionPlan = "free" | "professional" | "enterprise";

export type UserRole = "owner" | "admin" | "operations" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Provider {
  id: string;
  name: string;
  legalName?: string;
  type: InstitutionType;
  description?: string;
  verificationStatus: VerificationStatus;
  plan: SubscriptionPlan;
  phone?: string;
  emergencyPhone?: string;
  email?: string;
  website?: string;
  cnpj?: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHourDay {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  label: string;
  openTime: string;
  closeTime: string;
  is24Hours: boolean;
  isClosed: boolean;
}

export interface ProviderLocation {
  id: string;
  providerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  isMain: boolean;
  emergencyAvailable: boolean;
  phone?: string;
  operatingHours: OperatingHourDay[];
}

export type ServiceCategory =
  | "emergency"
  | "radiology"
  | "laboratory"
  | "icu"
  | "outpatient"
  | "pediatrics"
  | "cardiology"
  | "surgery"
  | "maternity"
  | "other";

export type ServiceStatus = "operational" | "busy" | "interrupted" | "closed";

export interface HealthcareService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  status: ServiceStatus;
  waitTimeMinutes: number;
  capacityPercentage: number;
  isEmergency: boolean;
  locationId: string;
  locationName?: string;
  lastUpdated: string;
}

export interface OperationalInterruption {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  reason: string;
  severity: "info" | "warning" | "critical";
  estimatedResolution: string;
  notifiedPatientsCount: number;
  status: "active" | "resolved";
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "general" | "urgent" | "maintenance" | "event";
  targetAudience: "all" | "patients" | "emergency_only";
  status: "published" | "draft" | "scheduled";
  viewsCount: number;
  publishedAt: string;
  expiresAt?: string;
}

export interface PatientRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  serviceId: string;
  serviceName: string;
  type: "appointment" | "exam" | "emergency_triage" | "inquiry";
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  priority: "normal" | "urgent" | "emergency";
  notes?: string;
  scheduledTime?: string;
  createdAt: string;
}

export interface InfrastructureTelemetry {
  systemId: string;
  systemName: string;
  category: "beds" | "oxygen" | "scanners" | "network" | "power";
  healthPercentage: number;
  status: "normal" | "warning" | "critical";
  details: string;
  lastCheck: string;
  metricValue: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: "active" | "invited";
  avatarUrl?: string;
  lastActive: string;
}

export interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;
  account: {
    email: string;
    fullName: string;
  };
  institution: Partial<Provider>;
  location: Partial<ProviderLocation>;
  contacts: {
    phone: string;
    emergencyPhone: string;
    email: string;
    website: string;
  };
  services: Partial<HealthcareService>[];
  operatingHours: OperatingHourDay[];
  verification: {
    licenseNumber: string;
    documentUploaded: boolean;
    termsAccepted: boolean;
  };
}
