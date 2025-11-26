import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';


export default function Otp() {
    const [modalvisible, showmodalvisible] = useState(false);

    const input1 = useRef<TextInput>(null);
    const input2 = useRef<TextInput>(null);
    const input3 = useRef<TextInput>(null);
    const input4 = useRef<TextInput>(null);

    const [otp, setOtp] = useState({d1: '', d2: '', d3: '', d4: ''});

    const handleOtpChange = (key: string, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setOtp({...otp, [key]: numericValue});

        if(numericValue.length === 1){
            switch(key) {
                case 'd1' : input2.current?.focus();
                break;
                case 'd2' : input3.current?.focus();
                break;
                case 'd3' : input4.current?.focus();
                break;
                default:
                    break;
            }
        }
    }

    const handleKeyPress = (key: string, e: any) => {
        if (e.nativeEvent.key === 'Backspace' && otp[key as keyof typeof otp] === '') {
            switch(key) {
                case 'd2': input1.current?.focus();
                break;
                case 'd3': input2.current?.focus();
                break;
                case 'd4': input3.current?.focus();
                break;
                default:
                    break;
            }
        }
    }

    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff', padding: 20 }}>
                <Image source={require("@/assets/images/otp.png")} style={{ width: 300, height: 300, marginHorizontal: 'auto' }} />
                <Text style={{ fontFamily: 'Poppins_600SemiBold', textAlign: 'left', fontSize: 20, fontWeight: 'bold', marginVertical: 20 }}>OTP Verification</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular', textAlign: 'left', fontSize: 16, color: '#666', marginBottom: 20 }}>Enter Phone number to send one time password</Text>
                <View style={{ marginBottom: 30, marginTop: 10 }}>
                    <View style={{borderWidth: 1.5, borderColor: '#000', borderRadius: 15, paddingHorizontal: 15, height: 55, justifyContent: 'center'}}>
                        <TextInput placeholder="+250 781 234 567" placeholderTextColor="#999" keyboardType='number-pad' style={{fontFamily: 'Poppins_400Regular', fontSize: 16, outline: 'none' as any,color: '#333',height: '100%'}}/>
                    </View>
                    <View style={{position: 'absolute', top: -10, left: 20, backgroundColor: '#fff', paddingHorizontal: 5,}}>
                        <Text style={{
                            color: '#000',
                            fontSize: 14,
                            fontFamily: 'Poppins_500Medium'
                        }}>Phone Number</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#000', padding: 12, borderRadius: 8, alignSelf: 'center', paddingHorizontal: 20 }} onPress={() => showmodalvisible(true)}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontFamily: 'Poppins_500Medium' }}>Continue</Text>
                </TouchableOpacity>

                <Modal visible={modalvisible} transparent animationType="fade">
                    <BlurView intensity={40} tint="light" style={{ flex: 1, justifyContent: 'center'}}>
                        <View style={{backgroundColor: '#000', padding: 30 , borderRadius: 30, margin: 20 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', gap: 10, margin: 10}} onPress={() => showmodalvisible(false)}>
                                <Ionicons name="arrow-back" size={20} color="#fff" />
                                <Text style={{fontFamily: 'Poppins_500Medium', fontSize: 16, color: '#fff'}}>Back</Text>
                            </TouchableOpacity>

                            <View style={{ padding: 20 }}>
                                <Text style={{fontFamily: 'Poppins_600SemiBold', fontSize: 20, color: '#fff'}}>Verification Code</Text>
                                <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#ccc', marginTop: 10}}>We have sent an otp to your phone number verify in your SMS</Text>
                                <View style={{ flexDirection: 'row', gap: 10, marginBlock: 20 , alignItems: 'center', justifyContent: 'center'}}>
                                    <TextInput 
                                        ref={input1}
                                        value={otp.d1}
                                        onChangeText={(value) => handleOtpChange('d1', value)}
                                        onKeyPress={(e) => handleKeyPress('d1', e)}
                                        keyboardType="number-pad" 
                                        maxLength={1} 
                                        style={{borderWidth: 1, borderColor: '#fff', color: '#fff', width: 50, height: 50, borderRadius: 10, textAlign: 'center', fontFamily: 'Poppins_500Medium', fontSize: 20}} 
                                    />
                                    <TextInput 
                                        ref={input2}
                                        value={otp.d2}
                                        onChangeText={(value) => handleOtpChange('d2', value)}
                                        onKeyPress={(e) => handleKeyPress('d2', e)}
                                        keyboardType="number-pad" 
                                        maxLength={1} 
                                        style={{borderWidth: 1, borderColor: '#fff', color: '#fff', width: 50, height: 50, borderRadius: 10, textAlign: 'center', fontFamily: 'Poppins_500Medium', fontSize: 20}} 
                                    />
                                    <TextInput 
                                        ref={input3}
                                        value={otp.d3}
                                        onChangeText={(value) => handleOtpChange('d3', value)}
                                        onKeyPress={(e) => handleKeyPress('d3', e)}
                                        keyboardType="number-pad" 
                                        maxLength={1} 
                                        style={{borderWidth: 1, borderColor: '#fff', color: '#fff', width: 50, height: 50, borderRadius: 10, textAlign: 'center', fontFamily: 'Poppins_500Medium', fontSize: 20}} 
                                    />
                                    <TextInput 
                                        ref={input4}
                                        value={otp.d4}
                                        onChangeText={(value) => handleOtpChange('d4', value)}
                                        onKeyPress={(e) => handleKeyPress('d4', e)}
                                        keyboardType="number-pad" 
                                        maxLength={1} 
                                        style={{borderWidth: 1, borderColor: '#fff', color: '#fff', width: 50, height: 50, borderRadius: 10, textAlign: 'center', fontFamily: 'Poppins_500Medium', fontSize: 20}} 
                                    />
                                </View>
                                <Link href="/crops" asChild>
                                    <TouchableOpacity style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, alignSelf: 'center', paddingHorizontal: 20 }} onPress={() => showmodalvisible(false)}>
                                        <Text style={{ textAlign: 'center', fontFamily: 'Poppins_500Medium', fontSize: 18}}>Verify</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>  
                        </View>
                        
                    </BlurView>
                </Modal>
            </View>
        </>
    )
}