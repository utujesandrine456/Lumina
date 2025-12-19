import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { MonoText } from '@/components/StyledText';

const { width } = Dimensions.get('window');

// Sample notification data
const notificationsData = [
  {
    id: '1',
    title: 'Order Confirmed!',
    message: 'Your crop transport order #TRX-789 has been confirmed by driver Rajesh Kumar',
    time: '2 minutes ago',
    type: 'order',
    read: false,
    icon: 'checkmark-circle',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Driver Arriving Soon',
    message: 'Driver Sunil Verma will arrive at your farm in approximately 30 minutes',
    time: '1 hour ago',
    type: 'delivery',
    read: false,
    icon: 'car',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Payment Received',
    message: '₹15,800 has been credited to your account for tomato harvest',
    time: '3 hours ago',
    type: 'payment',
    read: true,
    icon: 'cash',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Weather Alert',
    message: 'Heavy rain predicted tomorrow. Consider rescheduling your crop transport',
    time: '5 hours ago',
    type: 'alert',
    read: true,
    icon: 'rainy',
    color: '#F44336',
  },
  {
    id: '5',
    title: 'New Driver Available',
    message: '5 verified drivers are now available in your area for immediate booking',
    time: '1 day ago',
    type: 'info',
    read: true,
    icon: 'people',
    color: '#9C27B0',
  },
  {
    id: '6',
    title: 'Market Price Update',
    message: 'Tomato prices have increased by 12% in your local mandi this week',
    time: '2 days ago',
    type: 'market',
    read: true,
    icon: 'trending-up',
    color: '#009688',
  },
  {
    id: '7',
    title: 'Cooperative Meeting',
    message: 'Monthly farmers cooperative meeting scheduled for Friday, 10 AM',
    time: '3 days ago',
    type: 'event',
    read: true,
    icon: 'calendar',
    color: '#3F51B5',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      // Add a new notification
      const newNotification = {
        id: Date.now().toString(),
        title: 'Refreshed!',
        message: 'Your notifications have been updated',
        time: 'Just now',
        type: 'info',
        read: false,
        icon: 'refresh',
        color: '#00BCD4',
      };
      setNotifications([newNotification, ...notifications]);
      setUnreadCount(prev => prev + 1);
    }, 1500);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
    
    // Animation feedback
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const deleteNotification = (id: string) => {
    const deletedNotification = notifications.find(n => n.id === id);
    if (deletedNotification && !deletedNotification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const NotificationItem = ({ item, index }: { item: any; index: number }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.notificationCard,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
            borderLeftWidth: 4,
            borderLeftColor: item.color,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => markAsRead(item.id)}
          style={styles.notificationContent}
        >
          <View style={styles.notificationHeader}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
                {item.title}
              </Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
            {!item.read && (
              <View style={styles.unreadBadge}>
                <View style={[styles.unreadDot, { backgroundColor: item.color }]} />
              </View>
            )}
          </View>
          
          <Text style={styles.notificationMessage}>{item.message}</Text>
          
          <View style={styles.notificationActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => markAsRead(item.id)}
            >
              <Ionicons name="checkmark-done" size={20} color="#4CAF50" />
              <Text style={styles.actionText}>Mark Read</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => deleteNotification(item.id)}
            >
              <Ionicons name="trash" size={20} color="#F44336" />
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerRight}>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, styles.unreadStat]}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
              <Ionicons name="checkmark" size={20} color="#2196F3" />
              <Text style={styles.markAllText}>Mark All Read</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50', '#2196F3', '#FF9800']}
            tintColor="#4CAF50"
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={80} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <MonoText style={styles.emptyText}>
              You're all caught up! New alerts will appear here.
            </MonoText>
          </View>
        ) : (
          notifications.map((item, index) => (
            <NotificationItem key={item.id} item={item} index={index} />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fab,
          {
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabButton}
          onPress={onRefresh}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    color: '#1A1A1A',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#333',
  },
  unreadStat: {
    color: '#FF3B30',
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
  },
  markAllText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#2196F3',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 100,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
        shadowColor: '#000',
      },
    }),
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#1A1A1A',
  },
  notificationTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#888',
  },
  unreadBadge: {
    paddingLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  actionText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#FFF5F5',
  },
  deleteText: {
    color: '#F44336',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#AAA',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
});