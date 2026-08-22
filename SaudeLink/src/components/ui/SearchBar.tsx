import { ArrowRight, Building2 } from 'lucide-react-native';
import { TextInput, View } from 'react-native';


interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Para onde?',
}: SearchBarProps) {
  return (
    <View className="h-15 flex-row items-center justify-between rounded-2xl bg-[#EAEAEA]/60 px-4 mb-5 border border-transparent">
      <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
        <Building2 size={20} color="#2A2A2A" strokeWidth={2} />
      </View>
      <TextInput
        className="flex-1 text-base font-nunito-bold text-slate-800 ml-3 mr-2"
        placeholder={placeholder}
        placeholderTextColor="#7E8A9B"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      <View className="w-8 h-8 rounded-full bg-slate-900 items-center justify-center">
        <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.5} />
      </View>
    </View>
  );
}


