import { Ambulance, Baby, FlaskConical, LucideIcon, Pill, ScanHeart, Stethoscope } from 'lucide-react-native';

import { HospitalNeed } from '@/types/hospital';

export interface Category {
  id: HospitalNeed;
  label: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  { id: 'emergency', label: 'Emergency', icon: Ambulance },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'maternity', label: 'Maternity', icon: Baby },
  { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
  { id: 'pediatrics', label: 'Pediatrics', icon: Stethoscope },
  { id: 'imaging', label: 'Imaging', icon: ScanHeart },
];
