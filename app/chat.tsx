import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

type Message = {
  id: string;
  text: string;
  sender: string;
  time?: any;
};

export default function ChatScreen({ route }: any) {
  const { farmerId = "farmer1", driverId = "driver1", myRole = "farmer" } =
    route?.params ?? {};

  const chatId = `${farmerId}_${driverId}`;
  const messagesRef = collection(db, "chats", chatId, "messages");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    const q = query(messagesRef, orderBy("time", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setMessages(msgs);

      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await addDoc(messagesRef, {
      text: input.trim(),
      sender: myRole,
      time: serverTimestamp(),
    });
    setInput("");
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.sender === myRole;
    return (
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.senderText}>{item.sender}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.wrapper}
      keyboardVerticalOffset={Platform.select({ ios: 90, android: 60 })}
    >
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FFFFFF" },

  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },

  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },

  sendBtn: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  messageContainer: {
    marginVertical: 6,
    flexDirection: "row",
  },

  myMessageContainer: {
    justifyContent: "flex-end",
    fontFamily: 'Poppins_40-Regular'
  },

  otherMessageContainer: {
    justifyContent: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },

  myBubble: {
    backgroundColor: "#000",
    borderTopRightRadius: 4,
  },

  otherBubble: {
    backgroundColor: "#F2F2F2",
    borderTopLeftRadius: 4,
  },

  messageText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },

  senderText: {
    fontSize: 10,
    fontFamily: "Poppins_400Regular",
    marginTop: 6,
    color: "#949494ff",
    alignSelf: "flex-end",
  },
});
