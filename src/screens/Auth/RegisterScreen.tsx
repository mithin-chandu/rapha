import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Color scheme - moved outside component to prevent recreation
const colors = {
  primary: '#4F46E5',
  secondary: '#059669',
  primaryLight: '#818CF8',
  background: '#F8FAFC',
  textWhite: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

// Custom Input Component - moved outside to prevent recreation
const CustomInput = memo<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  multiline?: boolean;
  required?: boolean;
  fieldKey: string;
  isSmallScreen: boolean;
}>(({ 
  label, 
  value, 
  onChangeText, 
  error, 
  secureTextEntry = false, 
  keyboardType = 'default', 
  multiline = false, 
  required = false, 
  fieldKey,
  isSmallScreen 
}) => {
  const inputRef = useRef<TextInput>(null);
  
  const handleTextChange = useCallback((text: string) => {
    onChangeText(text);
  }, [onChangeText]);

  return (
    <View style={{
      marginBottom: isSmallScreen ? 16 : 20,
    }}>
      <Text style={{
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
      }}>
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      <TextInput
        ref={inputRef}
        style={[
          {
            borderWidth: 1,
            borderColor: error ? colors.error : colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: isSmallScreen ? 12 : 16,
            fontSize: isSmallScreen ? 16 : 18,
            backgroundColor: '#FFFFFF',
            color: colors.textPrimary,
            minHeight: multiline ? 80 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          Platform.OS === 'web' && { outlineStyle: 'none' } as any
        ]}
        value={value}
        onChangeText={handleTextChange}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor={colors.textSecondary}
        autoComplete="off"
        autoCorrect={false}
        spellCheck={false}
        autoCapitalize="none"
        blurOnSubmit={false}
        selectTextOnFocus={false}
        textContentType="none"
        dataDetectorTypes="none"
        importantForAutofill="no"
        {...(Platform.OS === 'web' && {
          autoFocus: false,
          'data-lpignore': 'true',
          'data-form-type': 'other',
          'data-1p-ignore': 'true',
          'data-webkit-autofill': 'false',
        })}
      />
      {error && (
        <Text style={{
          color: colors.error,
          fontSize: 12,
          marginTop: 4,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
});

// Custom Button Component - moved outside to prevent recreation
const CustomButton = memo<{
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  isSmallScreen: boolean;
  roleColor: string;
}>(({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false, 
  isSmallScreen,
  roleColor 
}) => (
  <TouchableOpacity
    style={{
      backgroundColor: variant === 'primary' ? roleColor : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: roleColor,
      borderRadius: 12,
      paddingVertical: isSmallScreen ? 14 : 18,
      paddingHorizontal: 24,
      alignItems: 'center',
      opacity: disabled ? 0.6 : 1,
      marginVertical: 8,
    }}
    onPress={onPress}
    disabled={disabled || loading}
  >
    <Text style={{
      color: variant === 'primary' ? colors.textWhite : roleColor,
      fontSize: isSmallScreen ? 16 : 18,
      fontWeight: '600',
    }}>
      {loading ? 'Loading...' : title}
    </Text>
  </TouchableOpacity>
));

interface RegisterScreenProps {
  navigation?: any;
  userRole?: 'patient' | 'hospital' | 'diagnostic' | 'pharmacy';
  onRegister?: (userData: any) => void;
  onBackPress?: () => void;
  onLoginPress?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
  userRole = 'patient',
  onRegister,
  onBackPress,
  onLoginPress,
}) => {
  interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    age: string;
    gender: string;
    phone: string;
    address: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateFormData = useCallback((key: keyof FormData, value: string) => {
    setFormData(prev => {
      if (prev[key] === value) return prev; // Prevent unnecessary re-renders
      return { ...prev, [key]: value };
    });
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[key]) {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = userRole === 'patient' ? 'Full name is required' : 'Hospital name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (userRole === 'patient') {
      if (!formData.age) {
        newErrors.age = 'Age is required';
      } else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
        newErrors.age = 'Please enter a valid age';
      }
      
      if (!formData.gender.trim()) {
        newErrors.gender = 'Gender is required';
      }
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Mock registration - in real app, this would call an API
    setTimeout(() => {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: userRole,
        phone: formData.phone,
        address: formData.address,
        ...(userRole === 'patient' ? { 
          age: parseInt(formData.age) || 0, 
          gender: formData.gender 
        } : { 
          hospitalId: Math.floor(Math.random() * 1000) + 1 
        })
      };
      
      if (onRegister) onRegister(userData);
      setLoading(false);
    }, 1500);
  }, [formData, userRole, onRegister, validateForm]);

  const isFormValid = () => {
    const baseValid = formData.name && formData.email && formData.password && 
                     formData.confirmPassword && formData.password === formData.confirmPassword;
    
    if (userRole === 'patient') {
      return baseValid && formData.age && formData.gender;
    }
    
    return baseValid;
  };

  // Responsive breakpoints
  const isSmallScreen = screenDimensions.width < 768;
  const isMediumScreen = screenDimensions.width >= 768 && screenDimensions.width < 1024;
  const isLargeScreen = screenDimensions.width >= 1024;

  // Memoized role color
  const roleColor = userRole === 'patient' ? colors.primary : colors.secondary;
  
  // Memoized button press handlers
  const handleBackPress = useCallback(() => {
    if (onBackPress) onBackPress();
    else if (navigation) navigation.goBack();
  }, [onBackPress, navigation]);

  const handleLoginPress = useCallback(() => {
    if (onLoginPress) onLoginPress();
    else if (navigation) navigation.navigate('Login');
  }, [onLoginPress, navigation]);



  return (
    <View style={[
      {
        flex: 1,
        backgroundColor: colors.background,
      },
      Platform.OS === 'web' && ({
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      } as any)
    ]}>
      {/* Web-specific style injection */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{
          __html: `
            body, html, #root {
              margin: 0 !important;
              padding: 0 !important;
              height: 100vh !important;
              overflow: hidden !important;
            }
            .register-scroll::-webkit-scrollbar {
              display: none;
            }
            .register-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            input[data-lpignore="true"] {
              -webkit-appearance: none !important;
              -moz-appearance: none !important;
              appearance: none !important;
              background-image: none !important;
              background-color: white !important;
            }
            input[data-lpignore="true"]::-webkit-credentials-auto-fill-button {
              visibility: hidden !important;
              pointer-events: none !important;
              position: absolute !important;
              right: 0 !important;
              display: none !important;
            }
            input[data-lpignore="true"]::-webkit-textfield-decoration-container {
              visibility: hidden !important;
              display: none !important;
            }
            input[type="password"]::-ms-reveal {
              display: none !important;
            }
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px white inset !important;
              -webkit-text-fill-color: #1F2937 !important;
              transition: background-color 5000s ease-in-out 0s !important;
            }
          `
        }} />
      )}

      {/* Background Gradient */}
      <LinearGradient
        colors={[roleColor, colors.primaryLight, colors.background]}
        locations={[0, 0.3, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
        }}
      />
      
      {/* Back Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: Platform.OS === 'web' ? 20 : 40,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
        onPress={handleBackPress}
      >
        <Text style={{
          color: colors.textWhite,
          fontSize: 18,
          fontWeight: 'bold',
        }}>←</Text>
      </TouchableOpacity>
        
      <KeyboardAvoidingView 
        style={[
          {
            flex: 1,
          },
          Platform.OS === 'web' && ({
            minHeight: '100vh',
            position: 'relative',
          } as any)
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined}
      >
        <ScrollView 
          style={[
            {
              flex: 1,
            },
            Platform.OS === 'web' && ({
              height: '100vh',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
            } as any)
          ]}
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 24 : 32,
              paddingTop: isSmallScreen ? 60 : 80,
              paddingBottom: isSmallScreen ? 40 : 60,
              justifyContent: 'center',
              alignItems: 'center',
            },
            Platform.OS === 'web' && ({
              minHeight: '100vh',
            } as any)
          ]}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          bounces={Platform.OS === 'ios'}
          keyboardShouldPersistTaps="handled"
          {...(Platform.OS === 'web' && { className: 'register-scroll' })}
        >
          {/* Hero Section */}
          <Animated.View 
            style={{
              alignItems: 'center',
              marginBottom: isSmallScreen ? 30 : 40,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={{
              fontSize: isSmallScreen ? 28 : isMediumScreen ? 32 : 36,
              fontWeight: '800',
              color: colors.textWhite,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Join RAPHA
            </Text>
            <Text style={{
              fontSize: isSmallScreen ? 14 : 16,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              lineHeight: isSmallScreen ? 20 : 24,
              paddingHorizontal: isSmallScreen ? 20 : 40,
            }}>
              Create your {userRole === 'patient' ? 'patient' : 'hospital'} account and get started
            </Text>
          </Animated.View>
          
          {/* Registration Form */}
          <Animated.View 
            style={{
              width: '100%',
              maxWidth: isSmallScreen ? 400 : isMediumScreen ? 500 : 600,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: isSmallScreen ? 24 : isMediumScreen ? 32 : 40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 25,
              elevation: 10,
              ...(Platform.OS === 'web' && {
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              }),
            }}>
              <Text style={{
                fontSize: isSmallScreen ? 22 : 26,
                fontWeight: '700',
                color: colors.textPrimary,
                textAlign: 'center',
                marginBottom: isSmallScreen ? 24 : 32,
              }}>Create Account</Text>
              
              <CustomInput
                label={userRole === 'patient' ? 'Full Name' : 'Hospital Name'}
                value={formData.name}
                onChangeText={(value: string) => updateFormData('name', value)}
                error={errors.name}
                fieldKey="register-name"
                required
                isSmallScreen={isSmallScreen}
              />
              
              <CustomInput
                label="Email Address"
                value={formData.email}
                onChangeText={(value: string) => updateFormData('email', value)}
                error={errors.email}
                keyboardType="email-address"
                fieldKey="register-email"
                required
                isSmallScreen={isSmallScreen}
              />
              
              {userRole === 'patient' && (
                <View style={{
                  flexDirection: isSmallScreen ? 'column' : 'row',
                  gap: isSmallScreen ? 0 : 16,
                }}>
                  <View style={{ flex: isSmallScreen ? undefined : 1 }}>
                    <CustomInput
                      label="Age"
                      value={formData.age}
                      onChangeText={(value: string) => updateFormData('age', value)}
                      error={errors.age}
                      keyboardType="numeric"
                      fieldKey="register-age"
                      required
                      isSmallScreen={isSmallScreen}
                    />
                  </View>
                  
                  <View style={{ flex: isSmallScreen ? undefined : 1 }}>
                    <CustomInput
                      label="Gender"
                      value={formData.gender}
                      onChangeText={(value: string) => updateFormData('gender', value)}
                      error={errors.gender}
                      fieldKey="register-gender"
                      required
                      isSmallScreen={isSmallScreen}
                    />
                  </View>
                </View>
              )}
              
              <CustomInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(value: string) => updateFormData('phone', value)}
                error={errors.phone}
                keyboardType="phone-pad"
                fieldKey="register-phone"
                required
                isSmallScreen={isSmallScreen}
              />
              
              <CustomInput
                label="Address"
                value={formData.address}
                onChangeText={(value: string) => updateFormData('address', value)}
                error={errors.address}
                multiline
                fieldKey="register-address"
                isSmallScreen={isSmallScreen}
              />
              
              <CustomInput
                label="Password"
                value={formData.password}
                onChangeText={(value: string) => updateFormData('password', value)}
                error={errors.password}
                secureTextEntry
                fieldKey="register-password"
                required
                isSmallScreen={isSmallScreen}
              />
              
              <CustomInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value: string) => updateFormData('confirmPassword', value)}
                error={errors.confirmPassword}
                secureTextEntry
                fieldKey="register-confirm-password"
                required
                isSmallScreen={isSmallScreen}
              />
              
              <View style={{ marginTop: isSmallScreen ? 24 : 32 }}>
                <CustomButton
                  title="Create Account"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={!isFormValid()}
                  isSmallScreen={isSmallScreen}
                  roleColor={roleColor}
                />
                
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: isSmallScreen ? 20 : 24,
                }}>
                  <View style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: colors.border,
                  }} />
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginHorizontal: 16,
                    fontWeight: '500',
                  }}>or</Text>
                  <View style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: colors.border,
                  }} />
                </View>
                
                <CustomButton
                  title="Sign In Instead"
                  onPress={handleLoginPress}
                  variant="outline"
                  isSmallScreen={isSmallScreen}
                  roleColor={roleColor}
                />
              </View>
              
              <View style={{
                marginTop: isSmallScreen ? 20 : 24,
                paddingTop: isSmallScreen ? 16 : 20,
                borderTopWidth: 1,
                borderTopColor: colors.borderLight,
              }}>
                <Text style={{
                  fontSize: 12,
                  color: colors.textTertiary,
                  textAlign: 'center',
                  lineHeight: 16,
                }}>
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

