import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';

export default function ChatScreen() {
    const router = useRouter();
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const { trips, addChatMessage, currentUser } = useDriverStore();
    const trip = trips.find(t => t.id === tripId);
    const [message, setMessage] = useState('');
    const listRef = useRef<FlatList>(null);

    if (!trip) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Chat</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Trip not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const sender: 'driver' | 'cooperative' = currentUser?.role === 'driver' ? 'driver' : 'cooperative';
    const chatDisabled = !trip.chatOpen || trip.status === 'delivered';

    const handleSend = () => {
        if (chatDisabled) {
            Alert.alert('Chat Closed', 'Chat is available only after acceptance and before delivery.');
            return;
        }
        const trimmed = message.trim();
        if (!trimmed) return;

        addChatMessage(trip.id, {
            id: `${Date.now()}`,
            sender,
            text: trimmed,
            timestamp: new Date().toISOString(),
        });
        setMessage('');
        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: true });
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Chat</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.tripMeta}>
                <Text style={styles.tripRoute}>{trip.pickupLocation} → {trip.destination}</Text>
                <Text style={styles.tripStatus}>
                    {chatDisabled ? 'Chat closed after delivery' : 'Chat open for coordination'}
                </Text>
            </View>

            <FlatList
                ref={listRef}
                data={trip.chat || []}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messages}
                renderItem={({ item }) => {
                    const isMine = item.sender === sender;
                    return (
                        <View style={[styles.messageBubble, isMine ? styles.mine : styles.theirs]}>
                            <Text style={[styles.messageText, isMine ? styles.mineText : styles.theirsText]}>
                                {item.text}
                            </Text>
                            <Text style={[styles.timestamp, isMine ? styles.mineText : styles.theirsText]}>
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    );
                }}
            />

            <View style={[styles.inputRow, chatDisabled && styles.inputDisabled]}>
                <TextInput
                    style={styles.input}
                    placeholder={chatDisabled ? 'Chat closed' : 'Type a message'}
                    placeholderTextColor="#757575"
                    value={message}
                    editable={!chatDisabled}
                    onChangeText={setMessage}
                />
                <TouchableOpacity
                    style={[styles.sendButton, chatDisabled && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={chatDisabled}
                >
                    <Ionicons name="send" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    tripMeta: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tripRoute: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    tripStatus: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
        marginTop: 4,
    },
    messages: {
        padding: 20,
        gap: 12,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 12,
    },
    mine: {
        alignSelf: 'flex-end',
        backgroundColor: '#000',
    },
    theirs: {
        alignSelf: 'flex-start',
        backgroundColor: '#F5F5F5',
    },
    messageText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
    },
    mineText: {
        color: '#FFF',
    },
    theirsText: {
        color: '#000',
    },
    timestamp: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 10,
        marginTop: 6,
        opacity: 0.7,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#B5B5B5',
        borderRadius: 12,
        padding: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#000',
    },
    sendButton: {
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 12,
    },
    sendButtonDisabled: {
        backgroundColor: '#B5B5B5',
    },
    inputDisabled: {
        opacity: 0.6,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#757575',
    },
});

