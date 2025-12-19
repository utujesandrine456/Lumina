import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Animated,
} from 'react-native';
import { useAppStore } from '@/constants/store';

export default function ChatScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const [text, setText] = useState('');
  const addMessage = useAppStore((s) => s.addMessage);
  const messages = useAppStore((s) => s.messages);
  const currentRole = useAppStore((s) => s.currentRole);
  const drivers = useAppStore((s) => s.drivers);
  const requests = useAppStore((s) => s.requests);

  const request = useMemo(
    () => requests.find((r) => r.id === requestId),
    [requests, requestId]
  );

  const driver = useMemo(
    () => (request ? drivers.find((d) => d.id === request.driverId) : undefined),
    [drivers, request]
  );

  const isDriverAvailable = driver?.available;

  const chatMessages = useMemo(
    () => messages.filter((m) => m.tripId === requestId).sort((a, b) => a.createdAt - b.createdAt),
    [messages, requestId]
  );

  const animation = useRef(new Animated.Value(0)).current;

  const triggerAnimation = () => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const send = () => {
    if (!text || !requestId || !currentRole || !isDriverAvailable) return;
    addMessage({
      id: Date.now().toString(),
      tripId: requestId,
      sender: currentRole === 'driver' ? 'driver' : 'c-farmer',
      text: text.trim(),
      createdAt: Date.now(),
    });
    setText('');
    triggerAnimation();
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={{
          flex: 1,
          paddingTop: 60,
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 20,
            marginBottom: 4,
          }}
        >
          Chat
        </Text>
        <Text style={{ color: '#FFFFFF', opacity: 0.7, marginBottom: 12 }}>
          Coordinate price, pickup time, and delivery.
        </Text>

        {!isDriverAvailable && (
          <Text
            style={{
              color: '#FFFFFF',
              opacity: 0.8,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#FFFFFF',
              borderRadius: 8,
              padding: 8,
            }}
          >
            Driver is not available. Chat is read-only.
          </Text>
        )}

        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY }],
          }}
        >
          <FlatList
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isMe =
                (currentRole === 'driver' && item.sender === 'driver') ||
                (currentRole !== 'driver' && item.sender === 'c-farmer');
              return (
                <View
                  style={{
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                    marginVertical: 2,
                  }}
                >
                  <View
                    style={{
                      maxWidth: '80%',
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: '#FFFFFF',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: isMe ? '#FFFFFF' : '#000000',
                    }}
                  >
                    <Text
                      style={{
                        color: isMe ? '#000000' : '#FFFFFF',
                        fontSize: 14,
                      }}
                    >
                      {item.text}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </Animated.View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#FFFFFF',
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 8,
              color: '#FFFFFF',
              marginRight: 8,
            }}
            placeholder="Type a message"
            placeholderTextColor="#777777"
            value={text}
            onChangeText={setText}
            editable={!!isDriverAvailable}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={send}
            disabled={!isDriverAvailable}
            style={{
              backgroundColor: isDriverAvailable ? '#FFFFFF' : '#222222',
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                color: isDriverAvailable ? '#000000' : '#777777',
                fontSize: 14,
              }}
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


