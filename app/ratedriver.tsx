import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';

export default function RateDriver() {
    const router = useRouter();
    const { tripId } = useLocalSearchParams();
    const { requests, rateDriver } = useDriverStore();

    const trip = (requests || []).find(t => t.id === tripId);
    const [rating, setRating] = useState<'good' | 'average' | 'bad' | null>(null);
    const [comment, setComment] = useState('');

    if (!trip || !trip.driver) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Trip Not Found</Text>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>
        );
    }

    const handleSubmit = () => {
        if (!rating) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        const ratingValue = rating === 'good' ? 5 : rating === 'average' ? 3 : 1;
        rateDriver(tripId as string, ratingValue, comment);

        if (rating === 'bad') {
            Alert.alert(
                'Rating Submitted',
                'Poor rating noted. Driver may be suspended after multiple poor ratings.',
                [{ text: 'OK', onPress: () => router.push('/trips') }]
            );
        } else {
            Alert.alert('Success', 'Rating submitted successfully!', [
                { text: 'OK', onPress: () => router.push('/trips') }
            ]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Rate Driver</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.driverCard}>
                    <Ionicons name="person-circle" size={64} color="#000" />
                    <Text style={styles.driverName}>{trip.driver.name}</Text>
                    <Text style={styles.plateNumber}>{trip.driver.plateNumber}</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>How was your experience?</Text>
                    <View style={styles.ratingOptions}>
                        <TouchableOpacity
                            style={[styles.ratingOption, rating === 'good' && styles.ratingOptionSelected]}
                            onPress={() => setRating('good')}
                        >
                            <Ionicons name="happy-outline" size={32} color={rating === 'good' ? '#FFF' : '#000'} />
                            <Text style={[styles.ratingText, rating === 'good' && styles.ratingTextSelected]}>
                                Good
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.ratingOption, rating === 'average' && styles.ratingOptionSelected]}
                            onPress={() => setRating('average')}
                        >
                            <Ionicons name="remove-circle-outline" size={32} color={rating === 'average' ? '#FFF' : '#000'} />
                            <Text style={[styles.ratingText, rating === 'average' && styles.ratingTextSelected]}>
                                Average
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.ratingOption, rating === 'bad' && styles.ratingOptionSelected]}
                            onPress={() => setRating('bad')}
                        >
                            <Ionicons name="sad-outline" size={32} color={rating === 'bad' ? '#FFF' : '#000'} />
                            <Text style={[styles.ratingText, rating === 'bad' && styles.ratingTextSelected]}>
                                Bad
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Comment (Optional)</Text>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment about your experience..."
                        multiline
                        numberOfLines={4}
                        value={comment}
                        onChangeText={setComment}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit Rating</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
    },
    driverCard: {
        alignItems: 'center',
        padding: 24,
        margin: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
        marginTop: 12,
        marginBottom: 4,
    },
    plateNumber: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    form: {
        paddingHorizontal: 20,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#000',
        marginBottom: 16,
    },
    ratingOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
    },
    ratingOption: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        minWidth: 100,
    },
    ratingOptionSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    ratingText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
        marginTop: 8,
    },
    ratingTextSelected: {
        color: '#FFF',
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#B5B5B5',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        backgroundColor: '#FFF',
        color: '#000',
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 24,
    },
    submitButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

