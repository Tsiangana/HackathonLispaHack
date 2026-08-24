import { router } from 'expo-router';
import {
  ArrowLeft,
  Edit3,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { sendOtpCode, verifyOtpCode } from '@/services/otpService';

export default function EmailLoginScreen() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);

  // OTP 6 digits state
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpFocusedIndex, setOtpFocusedIndex] = useState<number | null>(null);
  const [otpError, setOtpError] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [step, resendTimer]);

  const animateTransition = (nextStep: 1 | 2) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: nextStep === 2 ? -20 : 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(nextStep === 2 ? 20 : -20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleContinueEmail = async () => {
    let hasError = false;

    if (!email || !email.includes('@')) {
      setEmailError('Por favor insere um endereço de email válido.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('Por favor introduz a tua palavra-passe.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setLoadingEmail(true);

    try {
      const result = await sendOtpCode(email);

      if (!result.success) {
        setEmailError(result.message || 'Erro ao enviar código. Tenta novamente.');
        return;
      }

      setOtp(Array(OTP_LENGTH).fill(''));
      setOtpError('');
      setResendTimer(30);
      setCanResend(false);

      animateTransition(2);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      // User pasted full code
      const pasted = cleaned.slice(0, OTP_LENGTH).split('');
      for (let i = 0; i < OTP_LENGTH; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    newOtp[index] = cleaned;
    setOtp(newOtp);
    setOtpError('');

    // Advance focus automatically
    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!canResend || loadingResend) return;

    setLoadingResend(true);
    setOtpError('');

    try {
      const result = await sendOtpCode(email);

      if (!result.success) {
        setOtpError(result.message || 'Erro ao reenviar código.');
        return;
      }

      setOtp(Array(OTP_LENGTH).fill(''));
      setResendTimer(30);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } finally {
      setLoadingResend(false);
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');

    if (fullOtp.length < OTP_LENGTH) {
      setOtpError('Por favor preenche todos os 6 dígitos do código.');
      return;
    }

    setOtpError('');
    setLoadingVerify(true);

    try {
      const result = await verifyOtpCode(email, fullOtp);

      if (!result.success) {
        setOtpError(result.message || 'Código inválido ou expirado.');
        return;
      }

      router.replace('/(app)/(tabs)');
    } finally {
      setLoadingVerify(false);
    }
  };

  const isOtpComplete = otp.join('').length === OTP_LENGTH;

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF8]">
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 px-7 pt-4 pb-8 justify-between">
          {/* Header navigation bar */}
          <View className="flex-row items-center justify-between h-12 mb-4">
            <TouchableOpacity
              onPress={() => {
                if (step === 2) {
                  animateTransition(1);
                } else {
                  router.replace('/(auth)/intro');
                }
              }}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 items-center justify-center active:bg-slate-100"
            >
              <ArrowLeft size={20} color={colors.textDark} strokeWidth={2} />
            </TouchableOpacity>

            <View className="flex-row items-center gap-1.5">
              <View
                className={`h-2 rounded-full ${step === 1 ? 'w-6 bg-brand-red' : 'w-2 bg-slate-300'
                  }`}
              />
              <View
                className={`h-2 rounded-full ${step === 2 ? 'w-6 bg-brand-red' : 'w-2 bg-slate-300'
                  }`}
              />
            </View>
          </View>

          {/* Dynamic Step Content */}
          <Animated.View
            className="flex-1 pt-3"
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
          >
            {step === 1 ? (
              /* STEP 1: Enter Email */
              <View className="py-2">
                {/* Header Icon Badge */}
                <View className="mb-6">

                  <Text className="text-3xl font-nunito-extrabold text-healthcare-900 text-center leading-[38px] mb-2">
                    Introduz o teu Email
                  </Text>
                  <Text className="text-base font-nunito text-slate-500 text-center leading-6 px-2 pb-4">
                    Enviaremos um código de 6 dígitos para o email {'\n'}para acederes à tua conta.
                  </Text>
                </View>

                {/* Email + Password Form */}
                <View className="gap-4 mb-6">
                  {/* Email Field */}
                  <View>
                    <Text className="text-xs font-nunito-bold text-slate-500 mb-2 tracking-wider uppercase">
                      Endereço de Email
                    </Text>
                    <View
                      className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-4 h-14 ${emailError
                        ? 'border-red-500'
                        : emailFocused
                          ? 'border-brand-red'
                          : 'border-slate-200'
                        }`}
                    >
                      <Mail
                        size={20}
                        color={emailFocused ? colors.primaryRed : colors.textMuted}
                        strokeWidth={2}
                      />
                      <TextInput
                        value={email}
                        onChangeText={(v) => {
                          setEmail(v);
                          if (emailError) setEmailError('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        placeholder="o.teu@email.com"
                        placeholderTextColor={colors.textMuted}
                        className="flex-1 ml-3 text-base font-nunito text-slate-900"
                      />
                    </View>
                    {emailError ? (
                      <Text className="text-xs font-nunito-semibold text-red-500 mt-2 ml-1">
                        {emailError}
                      </Text>
                    ) : null}
                  </View>

                  {/* Password Field */}
                  <View>
                    <Text className="text-xs font-nunito-bold text-slate-500 mb-2 tracking-wider uppercase">
                      Palavra-passe
                    </Text>
                    <View
                      className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-4 h-14 ${passwordError
                        ? 'border-red-500'
                        : passwordFocused
                          ? 'border-brand-red'
                          : 'border-slate-200'
                        }`}
                    >
                      <Lock
                        size={20}
                        color={passwordFocused ? colors.primaryRed : colors.textMuted}
                        strokeWidth={2}
                      />
                      <TextInput
                        value={password}
                        onChangeText={(v) => {
                          setPassword(v);
                          if (passwordError) setPasswordError('');
                        }}
                        secureTextEntry={!showPassword}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        placeholder="••••••••"
                        placeholderTextColor={colors.textMuted}
                        className="flex-1 ml-3 text-base font-nunito text-slate-900"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((v) => !v)}
                        className="p-1"
                      >
                        {showPassword ? (
                          <EyeOff size={20} color={colors.textMuted} strokeWidth={2} />
                        ) : (
                          <Eye size={20} color={colors.textMuted} strokeWidth={2} />
                        )}
                      </TouchableOpacity>
                    </View>
                    {passwordError ? (
                      <Text className="text-xs font-nunito-semibold text-red-500 mt-2 ml-1">
                        {passwordError}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Submit Email Button */}
                <Pressable
                  disabled={loadingEmail}
                  onPress={handleContinueEmail}
                  className="bg-brand-red rounded-full py-4 items-center flex-row justify-center gap-2 active:opacity-90 disabled:opacity-60"
                >
                  {loadingEmail ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : null}
                  <Text className="text-base font-nunito-bold text-white tracking-wide">
                    {loadingEmail ? 'A enviar código...' : 'Continuar'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              /* STEP 2: Enter 6-digit OTP */
              <View className="py-2">
                {/* Header Icon Badge */}
                <View className="items-center mb-6">

                  <Text className="text-3xl font-nunito-extrabold text-healthcare-900 text-center leading-[38px] mb-2">
                    Código de Verificação
                  </Text>
                  <Text className="text-base font-nunito text-slate-500 text-center leading-6 px-2">
                    Enviaremos um código de 6 dígitos para o email abaixo.
                  </Text>

                  {/* Displayed Email pill with edit option */}
                  <TouchableOpacity
                    disabled={loadingVerify || loadingResend}
                    onPress={() => animateTransition(1)}
                    className="flex-row items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-3.5 py-1.5 mt-3 active:bg-slate-200"
                  >
                    <Text className="text-sm font-nunito-bold text-slate-800">
                      {email}
                    </Text>
                    <Edit3 size={14} color={colors.primaryRed} strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                {/* 6-Digit OTP Boxes */}
                <View className="mb-6">
                  <View className="flex-row justify-between gap-2 mb-2">
                    {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                      const isFocused = otpFocusedIndex === index;
                      const hasValue = Boolean(otp[index]);

                      return (
                        <View
                          key={index}
                          className={`flex-1 h-14 rounded-2xl bg-white border-[1.5px] items-center justify-center ${isFocused
                            ? 'border-brand-red bg-red-50/20'
                            : hasValue
                              ? 'border-slate-400'
                              : 'border-slate-200'
                            }`}
                        >
                          <TextInput
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            value={otp[index]}
                            onChangeText={(val) => handleOtpChange(val, index)}
                            onKeyPress={(e) => handleOtpKeyPress(e, index)}
                            onFocus={() => setOtpFocusedIndex(index)}
                            onBlur={() => setOtpFocusedIndex(null)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                            editable={!loadingVerify}
                            className="text-2xl font-nunito-extrabold text-healthcare-900 text-center w-full h-full"
                          />
                        </View>
                      );
                    })}
                  </View>

                  {otpError ? (
                    <Text className="text-xs font-nunito-semibold text-red-500 text-center mt-2">
                      {otpError}
                    </Text>
                  ) : (
                    <Text className="text-xs font-nunito text-slate-400 text-center mt-2">
                      Insira o código numérico recebido na sua caixa de entrada.
                    </Text>
                  )}
                </View>

                {/* Resend code option */}
                <View className="items-center mb-8">
                  {canResend ? (
                    <TouchableOpacity
                      disabled={loadingResend}
                      onPress={handleResendCode}
                      className="active:opacity-75 flex-row items-center gap-2"
                    >
                      {loadingResend ? (
                        <ActivityIndicator size="small" color={colors.primaryRed} />
                      ) : null}
                      <Text className="text-sm font-nunito-bold text-brand-red">
                        {loadingResend ? 'A reenviar...' : 'Reenviar novo código'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text className="text-sm font-nunito text-slate-400">
                      Reenviar código em{' '}
                      <Text className="font-nunito-bold text-slate-600">
                        00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                      </Text>
                    </Text>
                  )}
                </View>

                {/* Verify & Enter Button */}
                <Pressable
                  disabled={loadingVerify}
                  onPress={handleVerifyOtp}
                  className={`rounded-full py-4 items-center flex-row justify-center gap-2 active:opacity-90 disabled:opacity-60 ${isOtpComplete ? 'bg-brand-red' : 'bg-brand-red/80'
                    }`}
                >
                  {loadingVerify ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : null}
                  <Text className="text-base font-nunito-bold text-white tracking-wide">
                    {loadingVerify ? 'A verificar...' : 'Confirmar e Entrar'}
                  </Text>
                </Pressable>
              </View>
            )}
          </Animated.View>

          {/* Bottom link: back to full login choices */}
          <View className="flex-row justify-center items-center gap-1.5 py-2">
            <Text className="text-sm font-nunito text-slate-500">
              Preferes outro método?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-sm font-nunito-extrabold text-brand-red underline">
                Opções de Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}