import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import ProtectedRoute from '@/components/ProtectedRoute';



const initialMessagesMock = [
  { id: '1', text: 'Hello, are you available today?', sender: 'adminfarmer', time: '10:28 AM' },
  { id: '2', text: 'Yes, I am available. What quantity?', sender: 'driver', time: '10:30 AM' },
  { id: '3', text: '2 tons of maize. Pickup at 3PM.', sender: 'adminfarmer', time: '10:31 AM' },
  { id: '4', text: "Perfect, I'll be there at 3 PM sharp.", sender: 'driver', time: '10:32 AM' },
  { id: '5', text: 'Great! Please bring the necessary documentation.', sender: 'adminfarmer', time: '10:33 AM' },
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessagesMock);
  const flatListRef = useRef<FlatList>(null);


  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: generateId(),
        text: message.trim(),
        sender: 'adminfarmer',
        time: getCurrentTime(),
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');

      setTimeout(() => {
        const driverReply = {
          id: generateId(),
          text: 'Got it! Will bring all required documents.',
          sender: 'driver',
          time: getCurrentTime(),
        };
        setMessages(prevMessages => [...prevMessages, driverReply]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const isMine = item.sender === 'adminfarmer';

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50)}
        style={[
          styles.messageContainer,
          isMine ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {!isMine && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DJ</Text>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isMine ? styles.myMessage : styles.otherMessage,
        ]}>
          <Text style={[
            styles.messageText,
            isMine ? styles.myMessageText : styles.otherMessageText,
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isMine ? styles.myMessageTime : styles.otherMessageTime,
          ]}>
            {item.time}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const makeCall = () => {
    const phoneNumber = 'tel:0785805869';
    Linking.openURL(phoneNumber);
  };


  return (
    <ProtectedRoute>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <View>
              <Text style={styles.name}>Driver Jean</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusIndicator} />
                <Text style={styles.status}>Active now</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={makeCall}>
            <Ionicons name="call-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.daySeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.dayText}>Today</Text>
          <View style={styles.separatorLine} />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatArea}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach-outline" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type your message..."
              placeholderTextColor="#666"
              value={message}
              onChangeText={setMessage}
              style={styles.input}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              underlineColorAndroid="transparent"
              selectionColor="#000"
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={22} color="#000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#000',
    letterSpacing: -0.3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  status: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  dayText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
    marginHorizontal: 12,
    letterSpacing: 0.5,
  },
  chatArea: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    maxWidth: '100%',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  myMessage: {
    backgroundColor: '#000',
    borderBottomRightRadius: 8,
  },
  otherMessage: {
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  myMessageTime: {
    color: '#fff',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#666',
  },
  inputArea: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  attachButton: {
    marginRight: 12,
    padding: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#000',
    maxHeight: 100,
    paddingVertical: 4,
    paddingRight: 8,
    outlineColor: 'transparent',
    outlineWidth: 0,
  },
  emojiButton: {
    padding: 4,
  },
  sendBtn: {
    backgroundColor: '#000',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
});