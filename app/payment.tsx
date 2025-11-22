import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Image} from "react-native";
import TopBar from '@/components/TopBar';
import Icon from "react-native-vector-icons/FontAwesome5";
import {BlurView} from 'expo-blur';
import { Link } from 'expo-router';


export default function Payment(){
    const [selected, setSelected ] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState("");
    const [succes, setsuccess] = useState(false);

    
    return (
        <> 
            <TopBar title="Payment"></TopBar>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 30, textAlign: 'center', marginBlock: 50}}>Select Payment Method</Text>
            <View style={{ width: 340, borderRadius:20, position: 'absolute', top: '38%', marginHorizontal: 10}}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 20, columnGap: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => setSelected("paypal")}>
                        <View style={[styles.card, selected == "paypal" && styles.selectedCard]}>
                            <View style={{ flexDirection: "row", marginBlock: 2, gap:8}}>
                                <Icon name="paypal" size={22} color="#003087" />
                                <Text style={styles.label}>Paypal</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("mastercard")}>
                        <View style={[styles.card, selected == "mastercard" && styles.selectedCard]}>
                            <View style={{ flexDirection: "row", gap:8}}>
                                <Icon name="cc-mastercard" size={22} color="#EB001B" />
                                <Text style={styles.label}>MasterCard</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("momo")}>
                        <View style={[styles.card, selected == "momo" && styles.selectedCard]}>
                            <View style={{ flexDirection: "row", gap:8}}>                                
                                <Icon name="mobile-alt" size={22} color="#FF8C00" />
                                <Text style={styles.label}>Momo</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("cash")}>
                        <View style={[styles.card, selected == "cash" && styles.selectedCard]}>
                            <View style={{ flexDirection: "row", gap:8}}>                                
                                <Icon name="wallet" size={22} color="#000" />
                                <Text style={styles.label}>Cash</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{backgroundColor: 'black', alignSelf: 'center', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 10, marginVertical: 30}} onPress={() => { if(!selected){setError("Please select a payment method !!!."); return } setError("");  setOpenModal(true)}}>
                    <Text style={{color: 'white', fontFamily: 'Poppins_500Medium', fontSize: 18}}>Confirm</Text>
                </TouchableOpacity>
            </View>

            <Modal transparent visible={openModal} animationType="fade">
                <BlurView intensity={50} tint="dark" style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Enter Amount to Pay</Text>

                        <TextInput 
                            placeholder="Amount in Frw"
                            keyboardType="numeric"
                            style={styles.modalInput}
                        />

                        <TouchableOpacity 
                            style={styles.payBtn}
                            onPress={() =>{ if(!succes){setOpenModal(false); setsuccess(true)}}}
                        >
                            <Text style={{color: 'white', fontFamily: 'Poppins_600SemiBold'}}>Pay</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.cancelBtn}
                            onPress={() => setOpenModal(false)}
                        >
                            <Text style={{color: 'black', fontFamily: 'Poppins_500Medium'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Modal>

            <Modal transparent visible={succes} animationType="fade">
                <BlurView intensity={50} tint="dark" style={styles.modalBackground}>
                    
                    <View style={styles.modalBox}>
                        <Image source={require('@/assets/images/Success.png')} alt="Success" width={100} height={100} style={{marginHorizontal:'auto', marginBlock: 30}} />
                        <Text style={{fontSize: 26, fontFamily: "Poppins_600SemiBold", textAlign: 'center'}}>Payment Success</Text>
                        <Text style={{fontSize: 14, fontFamily: "Poppins_500Medium", textAlign: 'center',marginBlock: 15, color: '#9c9c9cff'}}>Your money has been successfully sent to Elias Kamana</Text>
                        <Text style={{fontSize: 16, fontFamily: "Poppins_500Medium", textAlign: 'center', marginBlock: 10}}>Amount</Text>
                        <Text style={{fontSize: 26, fontFamily: "Poppins_600SemiBold", textAlign: 'center'}}>23,000Frw</Text>
                        <Link href="/landing" asChild><TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', marginBlock: 20, backgroundColor: 'black', alignSelf: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8}} onPress={()=> setsuccess(!succes)}><Text style={{fontSize: 18, fontFamily: 'Poppins_500Medium', color: 'white'}}>Close</Text></TouchableOpacity></Link>
                    </View>
                </BlurView>
            </Modal>

            {error != "" && (
                <Text style={{ color: "red", textAlign: "center", marginTop: -35, fontFamily: 'Poppins_500Medium', fontSize: 16  }}>
                    {error}
                </Text>
            )}
        </>
    )
}



const styles = StyleSheet.create({
    selectedCard: {
        borderColor: "#1E90FF",
        borderWidth: 2,
        backgroundColor: "#E8F2FF",
        transform: [{ scale: 1.05 }],
    },
    card: {
        width: 200,
        height: 60,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 12,
        alignItems: 'center',
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'center', 
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#363636ff',
        textAlign: 'center',
        marginTop: 4,
    },
    value: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 2,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 10,
        shadowColor: "#000",
    },
    modalTitle: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: "Poppins_600SemiBold",
        marginBottom: 15,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        fontFamily: "Poppins_400Regular",
        marginBottom: 20,
    },
    payBtn: {
        backgroundColor: "black",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    cancelBtn: {
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    }
})

