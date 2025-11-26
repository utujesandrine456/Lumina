import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, Platform, UIManager , Linking} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomBar from "@/components/BottomBar";

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const faqs = [
    {
        question: "How do I book a truck?",
        answer: "Go to the Home screen, select 'Book Truck', choose your preferred truck, and confirm your booking details."
    },
    {
        question: "How do I change my role?",
        answer: "Go to your Profile page, tap on the menu icon, and select 'Switch Role' to toggle between Farmer and Driver modes."
    },
    {
        question: "What payment methods are accepted?",
        answer: "We currently accept Mobile Money (MTN/Airtel) and cash payments upon delivery."
    },
    {
        question: "How can I track my shipment?",
        answer: "Once a truck is booked, you can track its real-time location on the Dashboard under 'Active Shipments'."
    }
];

export default function Support() {
    const router = useRouter();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [feedback, setFeedback] = useState("");

    const toggleFaq = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const openEmail = () => {
    const email = "utujesandrine456@gmail.com";
    const subject = "Help Request";
    const body = "Hi, I need support with...";

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
        .then((supported) => {
        if (!supported) {
            Alert.alert("Email is not supported on this device");
        } else {
            return Linking.openURL(url);
        }
        })
        .catch((err) => console.error("Error opening email app:", err));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionTitle}>Contact Us</Text>
                <View style={styles.contactContainer}>
                    <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL("tel:+250788507406")}>
                        <View style={[styles.iconBox, { backgroundColor: "rgba(33, 150, 243, 0.1)" }]}>
                            <Ionicons name="call" size={24} color="#2196F3" />
                        </View>
                        <Text style={styles.contactText}>Call Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
                        <View style={[styles.iconBox, { backgroundColor: "rgba(76, 175, 80, 0.1)" }]}>
                            <Ionicons name="mail" size={24} color="#4CAF50" />
                        </View>
                        <Text style={styles.contactText}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={() => router.push({ pathname: "/chat", params: { farmerId: "farmer123", driverId: "driver567", myRole: "farmer"}})}>
                        <View style={[styles.iconBox, { backgroundColor: "rgba(255, 193, 7, 0.1)" }]}>
                            <Ionicons name="chatbubbles" size={24} color="#FFC107" />
                        </View>
                        <Text style={styles.contactText}>Chat</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                <View style={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <View key={index} style={styles.faqItem}>
                            <TouchableOpacity onPress={() => toggleFaq(index)} style={styles.faqHeader}>
                                <Text style={styles.faqQuestion}>{faq.question}</Text>
                                <Ionicons
                                    name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#757575"
                                />
                            </TouchableOpacity>
                            {expandedFaq === index && (
                                <View style={styles.faqBody}>
                                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Send Feedback</Text>
                <View style={styles.feedbackContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Tell us how we can improve..."
                        placeholderTextColor="#aaa"
                        multiline
                        numberOfLines={4}
                        value={feedback}
                        onChangeText={setFeedback}
                    />
                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit Feedback</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <BottomBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBlock: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "Poppins_600SemiBold",
        color: "#000",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#000",
        marginBottom: 16,
        marginTop: 8,
    },
    contactContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    contactItem: {
        alignItems: "center",
        width: "30%",
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    contactText: {
        color: "#333",
        fontSize: 14,
        fontFamily: "Poppins_500Medium",
    },
    faqContainer: {
        marginBottom: 32,
    },
    faqItem: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        overflow: "hidden",
    },
    faqHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    faqQuestion: {
        color: "#000",
        fontSize: 14,
        fontFamily: "Poppins_500Medium",
        flex: 1,
        marginRight: 16,
    },
    faqBody: {
        padding: 16,
        paddingTop: 0,
    },
    faqAnswer: {
        color: "#757575",
        fontSize: 14,
        lineHeight: 20,
        fontFamily: "Poppins_400Regular",
    },
    feedbackContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    input: {
        color: "#000",
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        textAlignVertical: "top",
        minHeight: 100,
    },
    submitButton: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 16,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
    },
});
