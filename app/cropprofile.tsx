import React, { useState } from "react";
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useRouter, Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");

const crops = [
  {
    id: 3,
    image: require("@/assets/images/potato.jpeg"),
    name: "Potato",
    price: '23 Frw/Kg',
    distance: '50 Frw/Km',
    description: "High quality potatoes suitable for frying and boiling."
  },
  {
    id: 2,
    image: require("@/assets/images/beans.jpg"),
    name: "Beans",
    price: '23 Frw/Kg',
    distance: '50 Frw/Km',
    description: "Fresh beans rich in protein and nutrients."
  },
  {
    id: 1,
    image: require("@/assets/images/maize.jpeg"),
    name: "Maize",
    price: '23 Frw/Kg',
    distance: '50 Frw/Km',
    description: "Sweet and tender maize, perfect for roasting."
  },
  {
    id: 4,
    image: require("@/assets/images/sweet-potatoes.jpg"),
    name: "Sweet Potato",
    price: '23 Frw/Kg',
    distance: '50 Frw/Km',
    description: "Nutritious sweet potatoes with rich flavor."
  },
  {
    id: 5,
    image: require("@/assets/images/rice.jpeg"),
    name: "Rice",
    price: '23 Frw/Kg',
    distance: '50 Frw/Km',
    description: "Premium aromatic rice for your daily meals."
  },
  {
    id: 6,
    image: require("@/assets/images/casava.jpeg"),
    name: "Casava",
    price: '23 Frw/Kg',
    distance: '50 Frw/Km',
    description: "Fresh cassava roots, great for flour or boiling."
  },
];

export default function CropProfile() {
  const { initialIndex, selected } = useLocalSearchParams();
  const router = useRouter();

  const selectedIds = selected && selected !== ""
    ? (selected as string).split(',').map(Number).filter(n => n !== 0)
    : [];

  const filteredCrops = selectedIds.length > 0
    ? crops.filter((crop) => selectedIds.includes(crop.id))
    : crops;

  const initialFilteredIndex = initialIndex
    ? filteredCrops.findIndex(c => c.id === Number(initialIndex))
    : 0;

  const [currentIndex, setCurrentIndex] = useState(
    initialFilteredIndex >= 0 ? initialFilteredIndex : 0
  );

  const nextSlide = () => {
    if (currentIndex < filteredCrops.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentCrop = filteredCrops[currentIndex];

  if (!currentCrop) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        key={`image-${currentIndex}`}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Image
          source={currentCrop.image}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </Animated.View>


      <View style={styles.headerActions} pointerEvents="box-none">
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer} pointerEvents="box-none">
        <View style={styles.infoCard}>
          {filteredCrops.length > 1 && (
            <View style={styles.pagination}>
              {filteredCrops.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setCurrentIndex(i)}
                  style={[
                    styles.dot,
                    i === currentIndex && styles.activeDot
                  ]}
                />
              ))}
            </View>
          )}

          <Animated.View
            key={`content-${currentIndex}`}
            entering={FadeIn.duration(400).delay(200)}
            exiting={FadeOut.duration(200)}
            style={styles.textContainer}
          >
            <Text style={styles.cropName}>{currentCrop.name}</Text>
            <Text style={styles.description}>{currentCrop.description}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="pricetag-outline" size={20} color="#4CAF50" />
                <Text style={styles.statValue}>{currentCrop.price}</Text>
                <Text style={styles.statLabel}>Market Price</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Ionicons name="location-outline" size={20} color="#2196F3" />
                <Text style={styles.statValue}>{currentCrop.distance}</Text>
                <Text style={styles.statLabel}>Transport</Text>
              </View>
            </View>

            <Link href="/trucks" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>
                  Select {currentCrop.name}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            </Link>

            <Link href="/trucks" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>
                  Select All
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </View>

      {filteredCrops.length > 1 && (
        <View style={styles.navigationArrows} pointerEvents="box-none">
          {currentIndex > 0 ? (
            <TouchableOpacity style={styles.navButton} onPress={prevSlide}>
              <Ionicons name="chevron-back" size={20} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 50 }} />
          )}

          <View style={{ flex: 1 }} />

          {currentIndex < filteredCrops.length - 1 ? (
            <TouchableOpacity style={styles.navButton} onPress={nextSlide}>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 50 }} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    elevation: 10,
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
    elevation: 10,
  },
  infoCard: {
    borderRadius: 30,
    padding: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,20,0.9)',
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FFF',
  },
  textContainer: {
    alignItems: 'center',
  },
  cropName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
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
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFF',
    marginTop: 4,
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  actionButton: {
    width: '75%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBlock: 8,
    gap: 8,
  },
  actionButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#000',
  },
  selectionCounter: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBlock: 10,
    textAlign: 'center',
  },
  navigationArrows: {
    position: 'absolute',
    top: '44%',
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20, 
    elevation: 20,
    transform: [{ translateY: -25 }],
    marginHorizontal: 10
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});