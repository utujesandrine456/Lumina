import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';


export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const FaqItem = ({ question, answer, delay }: { question: string, answer: string, delay: number }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.faqHeader}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.faqQuestion}>{question}</Text>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#757575" />
        </TouchableOpacity>
        {expanded && (
          <Animated.View entering={FadeInUp.duration(200)} style={styles.faqBody}>
            <Text style={styles.faqAnswer}>{answer}</Text>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const HelpCategory = ({ icon, label, bg, color }: any) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={[styles.categoryIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.searchSection}>
            <Text style={styles.greeting}>How can we help you?</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#757575" />
              <TextInput
                style={styles.input}
                placeholder="Search help articles..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.categoriesGrid}>
            <HelpCategory icon="car-sport" label="Trip Issues" bg="#E3F2FD" color="#2196F3" />
            <HelpCategory icon="wallet" label="Payments" bg="#E8F5E9" color="#4CAF50" />
            <HelpCategory icon="person" label="Account" bg="#FFF3E0" color="#FF9800" />
            <HelpCategory icon="shield-checkmark" label="Safety" bg="#FFEBEE" color="#F44336" />
          </Animated.View>

          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            <FaqItem
              delay={300}
              question="How do I change my vehicle details?"
              answer="You can update your vehicle information by navigating to Settings > Edit Profile > Vehicle Information. Note that changing vehicle type requires re-verification."
            />
            <FaqItem
              delay={400}
              question="When do I get paid?"
              answer="Payments are processed every Tuesday for the previous week's completed trips. Funds are deposited directly to your registered mobile money account."
            />
            <FaqItem
              delay={500}
              question="What if a farmer is not at the pickup location?"
              answer="Please wait for at least 15 minutes and try calling the farmer through the app. If they are unreachable, you can cancel the trip with reason 'Farmer unavailable'."
            />
          </View>

          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Still need help?</Text>
              <Text style={styles.contactSub}>Our support team is available 24/7</Text>
            </View>
            <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('tel:0785805869')}>
              <Ionicons name="call" size={20} color="#FFF" />
              <Text style={styles.contactButtonText}>Call Us</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  searchSection: {
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#1A1A1A',
    height: '100%',
    outlineColor: 'transparent',
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  categoryCard: {
    alignItems: 'center',
    width: '23%',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 16,
    marginLeft: 4,
  },
  faqList: {
    gap: 16,
    marginBottom: 32,
  },
  faqItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
    paddingRight: 16,
  },
  faqBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswer: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#757575',
    lineHeight: 22,
  },
  contactCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 4,
  },
  contactSub: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#AAAAAA',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#FFF',
  }
});