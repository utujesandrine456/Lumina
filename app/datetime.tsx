import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Calendar } from 'react-native-calendars';
import Icon from "react-native-vector-icons/Ionicons";
import TopBar from '@/components/TopBar';

interface MarkedDate {
  selected: boolean;
  selectedColor: string;
  textColor: string;
}

interface DateObject {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

export default function DateTime() {
  const [selectedDates, setSelectedDates] = useState<Record<string, MarkedDate>>({});
  const [showDetails, setShowDetails] = useState(false);

  const onDayPress = (day: DateObject) => {
    const newSelected = { ...selectedDates };
    if (newSelected[day.dateString]) {
      delete newSelected[day.dateString];
    } else {
      newSelected[day.dateString] = {
        selected: true,
        selectedColor: "#000",
        textColor: "#fff",
      };
    }
    setSelectedDates(newSelected);
  };

  const userdetails = [
    {
      id: 1,
      userIcon: "person-circle-outline",
      name: "Sandrine",
      locationIcon: "location-outline",
      location: "Kigali, Rwanda",
      telIcon: "call-outline",
      tel: "+250 788 123 456",
    },
  ];

  const distance = 120;
  const kilogram = 1000;

  const transactiondetails = [
    {id: 1, frperkm:62 , frperkg: 20, totalprice: 27440}
  ];

  return (
    <>
      <TopBar title="Date & Time" />
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ marginVertical: 30 }}>
          <Text style={styles.headerTitle}>Choose Date & Time</Text>
          <View style={styles.headerUnderline} />
        </View>

        <Calendar
          onDayPress={onDayPress}
          markedDates={selectedDates}
          theme={{
            monthTextColor: '#000',
            arrowColor: "black",
            todayTextColor: "#000",
            textMonthFontFamily: 'Poppins_600SemiBold',
            textDayFontFamily: 'Poppins_400Regular',
            textDayHeaderFontFamily: 'Poppins_500Medium',
            textSectionTitleColor: "black",
          }}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.button}>
            <Icon name="location-outline" size={22} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.buttonTextcontainer}>Add pickup location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="time-outline" size={22} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.buttonTextcontainer}>Time</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={styles.bookButton}>
            <Text style={styles.bookText}>Book A Ride</Text>
            <Icon
              name={showDetails ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color="white"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>

          {showDetails && (
            <View style={{flexDirection: 'column', marginHorizontal: 'auto'}}>
                <View style={{flexDirection: 'row',alignItems: 'center', justifyContent:'center', gap: 40, marginBlock: 15}}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.detailsHeader}>Contact Info</Text>
                        <View style={{width:100, height: 4, backgroundColor: 'black', alignSelf: 'center', borderRadius: 10}}></View>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.detailsHeader}>Transaction</Text>
                        <View style={{width:100, height: 4, backgroundColor: 'black', alignSelf: 'center', borderRadius: 10}}></View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row'}}>
                    {userdetails.map((user) => (
                        <View key={user.id} style={styles.userCard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name={user.userIcon} size={28} color="#000" style={{ marginRight: 10 }} />
                                <Text style={styles.userName}>{user.name}</Text>
                            </View>
                            <View style={styles.userRow}>
                                <Icon name={user.locationIcon} size={20} color="#000" style={{ marginRight: 8 }} />
                                <Text style={styles.userInfo}>{user.location}</Text>
                            </View>
                            <View style={styles.userRow}>
                                <Icon name={user.telIcon} size={20} color="#000" style={{ marginRight: 8 }} />
                                <Text style={styles.userInfo}>{user.tel}</Text>
                            </View>
                        </View>
                    ))}

                    {transactiondetails.map((user) => (
                        <View key={user.id} style={styles.userCard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.transaction}>{user.frperkm}Frw/Km * 120Km = 7440Frw</Text>
                            </View>
                            <View style={styles.userRow}>
                                <Text style={styles.transaction}>{user.frperkg}Frw/Kg * 1000Kg = 20,000Frw</Text>
                            </View>
                            <View style={{marginBlock: 20}}>
                                <View style={{width:180, height: 0.5, backgroundColor: 'gray', alignSelf: 'center'}}></View>
                                <Text style={{ fontSize: 16, fontFamily: 'Poppins_600SemiBold'}}>Total Price: 27,400Frw</Text>
                            </View>
                        </View>
                    ))}
                </View>
                
            </View>
            )}
        
      </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 30,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  headerUnderline: {
    width: 100,
    height: 8,
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 2, height: 2 },
    paddingVertical: 10,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  buttonTextcontainer: {
    color: "#676767",
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  bookButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
  },
  bookText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: 'white',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
  },
  detailsHeader: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginBottom: 10,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userInfo: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  transaction: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  }
});
