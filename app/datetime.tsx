import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Calendar } from 'react-native-calendars';
import Icon from "react-native-vector-icons/Ionicons";
import TopBar from '@/components/TopBar';
import { Link} from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import BottomBar from '@/components/BottomBar';


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

  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedTime?:Date ) => {
    setOpen(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const userdetails = [
    {
      id: 1,
      userIcon: "person-circle-outline",
      name: "John Doe",
      locationIcon: "location-outline",
      location: "Musanze, Ruhengeri ",
      telIcon: "call-outline",
      tel: "+250 768 098 798",
    },
  ];

  const transactiondetails = [
    {id: 1, frperkm:62 , frperkg: 20, totalprice: 27440}
  ];

  return (
    <>
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
            textDayFontFamily: 'Poppins_500Medium',
            textDayHeaderFontFamily: 'Poppins_500Medium',
            textSectionTitleColor: "black",
            dayTextColor: '#000'
          }}
        />

        <View style={styles.actionRow}>
          <Link href="/location" asChild>
            <TouchableOpacity style={styles.button}>
              <Icon name="location-outline" size={22} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.buttonTextcontainer}>Add pickup</Text>
            </TouchableOpacity>
          </Link>
          <View>
            <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
              <Icon name="time-outline" size={22} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.buttonTextcontainer}>
                {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {open && (
              <DateTimePicker value={time} mode="time" is24Hour={true} display="default" onChange={onChange}/>
            )}
          </View>
        </View>

        {/* <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={styles.bookButton}>
            <Text style={styles.bookText}>Booking Info</Text>
            <Icon
              name={showDetails ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color="white"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View> */}

        {/* {showDetails && (
            <View style={{flexDirection: 'column', marginHorizontal: 'auto'}}>
                <View style={{flexDirection: 'row',alignItems: 'center', justifyContent:'center', gap: 40, marginBlock: 15}}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.detailsHeader}>Contact Info</Text>
                        <View style={{width:60, height: 4, backgroundColor: 'black', alignSelf: 'center', borderRadius: 10}}></View>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.detailsHeader}>Transaction</Text>
                        <View style={{width:60, height: 4, backgroundColor: 'black', alignSelf: 'center', borderRadius: 10}}></View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                    {userdetails.map((user) => (
                        <View key={user.id} style={styles.userCard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name={user.userIcon} size={28} color="#000" style={{ marginRight: 8 }} />
                                <Text style={styles.userName}>{user.name}</Text>
                            </View>
                            <View style={styles.userRow}>
                                <Icon name={user.locationIcon} size={20} color="#000" style={{ marginRight: 6 }} />
                                <Text style={styles.userInfo}>{user.location}</Text>
                            </View>
                            <View style={styles.userRow}>
                                <Icon name={user.telIcon} size={20} color="#000" style={{ marginRight: 6 }} />
                                <Text style={styles.userInfo}>{user.tel}</Text>
                            </View>
                        </View>
                    ))}

                    {transactiondetails.map((user) => (
                        <View key={user.id} style={styles.userCard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBlock: 3}}>
                                <Text style={styles.transaction}>{user.frperkm}Frw/Km * 120Km = 7440Frw</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBlock: 3}}>
                                <Text style={styles.transaction}>{user.frperkg}Frw/Kg * 1000Kg = 20,000Frw</Text>
                            </View>
                            <View style={{marginBlock: 10}}>
                                <View style={{width:180, height: 0.5, backgroundColor: 'gray', alignSelf: 'center'}}></View>
                                <Text style={{ fontSize: 13, fontFamily: 'Poppins_600SemiBold', textAlign: 'center'}}>Total Price: 27,400Frw</Text>
                            </View>
                        </View>
                    ))}
                </View>
                
            </View>
        )} */}


        <View style={{ alignItems: 'center', marginBlock: 15 }}>
          <Link href="/payment" asChild>
              <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={{backgroundColor: 'black', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10}}>
                <Text style={{ color: 'white', fontFamily: 'Poppins_500Medium', fontSize: 18}}>Confirm</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
      </ScrollView>
      <BottomBar />
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
    marginVertical: 30,
    marginBottom: 5
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
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  buttonTextcontainer: {
    color: "#000000",
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
    padding: 5,
    elevation: 2,
    alignItems: 'center',
    marginInline: 5
  },
  userName: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#333'
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userInfo: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  transaction: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  }
});
