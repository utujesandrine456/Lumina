import React, { useState, useRef } from "react";
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Animated, {useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation, FadeInDown,type SharedValue } from "react-native-reanimated";
import { useRouter, useLocalSearchParams, Link } from "expo-router";

const { width, height } = Dimensions.get("window");

const trucks = [
  {
    name: "Daihatsu",
    image: require("@/assets/images/DaihatsuRB.png"),
    drivername: "Kamali",
    phonenumber: +2507976567,
    capacity: "3 Seats",
    plate: "RAD246F",
    rating: "4.9",
    reviews: "39",
    status: 'green',
    price: 21 
  },
  {
    name: "Volvo",
    image: require("@/assets/images/Howo.jpg"),
    drivername: "Kalisa",
    phonenumber: +2507976567,
    capacity: "5 Seats",
    plate: "RAC123G",
    rating: "4.8",
    reviews: "42",
    status: 'yellow',
    price: 27 
  },
  {
    name: "Shashi",
    image: require("@/assets/images/Camion.jpg"),
    drivername: "Jane",
    phonenumber: +2507976567,
    capacity: "4 Seats",
    plate: "RAB789P",
    rating: "4.7",
    reviews: "28",
    status: 'red',
    price: 18 
  },
  {
    name: "Toyota",
    image: require("@/assets/images/Isuzu.jpg"),
    drivername: "Winner",
    phonenumber: +2507976567,
    capacity: "3 Seats",
    plate: "RAC352G",
    rating: "4.8",
    reviews: "37",
    status: 'green',
    price: 12 
  },
  {
    name: "Cruiser",
    image: require("@/assets/images/shashi.jpeg"),
    drivername: "Gold",
    phonenumber: +2507976567,
    capacity: "1 Seat",
    plate: "RAD101A",
    rating: "4.9",
    reviews: "15",
    status: 'green',
    price: 23 
  },
  {
    name: "Suzuki",
    image: require("@/assets/images/Closed.webp"),
    drivername: "Sonia",
    phonenumber: +2507976567,
    capacity: "3 Seats",
    plate: "RAB202B",
    rating: "4.6",
    reviews: "22",
    status: 'red',
    price: 32 
  }
];


const TruckSlideItem = ({ truck, index, scrollX }: { truck: any, index: number, scrollX: SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [1.2, 1, 1.2],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Animated.View style={{ flex: 1, ...animatedStyle }}>
        <Image
          source={truck.image}
          style={{ width: width, height: height }}
          resizeMode="cover"
        />
      </Animated.View>
      <View style={styles.overlay} />
    </View>
  );
};

export default function TruckProfile() {
  const { initialIndex } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(initialIndex ? Number(initialIndex) : 0);
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const router = useRouter();


  React.useEffect(() => {
    if (initialIndex && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Number(initialIndex) * width, animated: false });
        scrollX.value = Number(initialIndex) * width;
      }, 100);
    }
  }, [initialIndex]);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const handleScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    if (currentIndex < trucks.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      scrollRef.current?.scrollTo({ x: (currentIndex - 1) * width, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        bounces={false}
      >
        {trucks.map((truck, index) => (
          <TruckSlideItem key={index} truck={truck} index={index} scrollX={scrollX} />
        ))}
      </Animated.ScrollView>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <View style={{ ...styles.infoCard, backgroundColor: 'rgba(20,20,20,0.9)' }}>
          <View style={styles.pagination}>
            {trucks.map((_, i) => (
              <View
                key={i}
                style={{
                  ...styles.dot,
                  ...(i === currentIndex ? styles.activeDot : {})
                }}
              />
            ))}
          </View>

          <Animated.View
            key={currentIndex}
            entering={FadeInDown.duration(400)}
            style={styles.textContainer}
          >
            <Text style={styles.truckName}>{trucks[currentIndex].name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{trucks[currentIndex].rating} ({trucks[currentIndex].reviews} Reviews)</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={{flexDirection: 'row', gap: 30, marginBlock: 5}}>
                <View style={styles.statItem}>
                  <Ionicons name="person" size={20} color="#fff" />
                  <Text style={styles.statValue}>{trucks[currentIndex].drivername}</Text>
                  <Text style={styles.statLabel}>DriverName</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Ionicons name="call" size={20} color="#1140eaff" />
                  <Text style={styles.statValue}>{trucks[currentIndex].phonenumber}</Text>
                  <Text style={styles.statLabel}>PhoneNumber</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 30, marginBlock: 5}}>
                <View style={styles.statItem}>
                  <Ionicons name="people-outline" size={20} color="#2196F3" />
                  <Text style={styles.statValue}>{trucks[currentIndex].capacity}</Text>
                  <Text style={styles.statLabel}>Capacity</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Ionicons name="pricetag-outline" size={20} color="#4CAF50" />
                  <Text style={styles.statValue}>{trucks[currentIndex].price}Frw/Km</Text>
                  <Text style={styles.statLabel}>Price</Text>
                </View>
              </View>
            </View>

            <Link href="/datetime" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Book {trucks[currentIndex].name}</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </View>

      <View style={styles.navigationArrows}>
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={prevSlide}>
            <Ionicons name="chevron-back" size={32} color="#FFF" />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }} />
        {currentIndex < trucks.length - 1 && (
          <TouchableOpacity style={styles.navButton} onPress={nextSlide}>
            <Ionicons name="chevron-forward" size={32} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  infoCard: {
    borderRadius: 30,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#FFF',
  },
  textContainer: {
    alignItems: 'center',
  },
  truckName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#FFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  ratingText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#FFF',
    marginTop: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  actionButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#000',
  },
  navigationArrows: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  navButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});