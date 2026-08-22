import { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { colors } from '@/constants/colors';
import { cn } from '@/lib/cn';

interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  color?: string;
  className?: string;
}

export function IconButton({ icon: Icon, onPress, color = colors.blue700, className }: IconButtonProps) {
  return (
    <Pressable className={cn('h-11 w-11 items-center justify-center rounded-xl bg-white', className)} onPress={onPress}>
      <Icon color={color} size={21} />
    </Pressable>
  );
}
