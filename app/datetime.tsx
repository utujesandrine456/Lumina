import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Calendar } from 'react-native-calendars';
import Icon from "react-native-vector-icons/Ionicons";
import { Link } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import BottomBar from '@/components/BottomBar';
import DriverBottomBar from '@/components/DriverBottomBar';
import { useDriverStore } from '@/constants/store';


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
  const { userRole, unavailableDates, toggleDateAvailability, trip, setTripDetails } = useDriverStore();
  const isDriver = userRole === 'driver';

  const [bookingDates, setBookingDates] = useState<{ [date: string]: boolean }>({});

  const onDayPress = (day: DateObject) => {
    if (isDriver) {
      toggleDateAvailability(day.dateString);
    } else {
      if (unavailableDates[day.dateString]) {
        alert("This date is unavailable.");
        return;
      }

      setBookingDates(prev => {
        const newDates = { ...prev };
        if (newDates[day.dateString]) {
          delete newDates[day.dateString];
        } else {
          newDates[day.dateString] = true;
        }
        return newDates;
      });
    }
  };

  const getMarkedDates = () => {
    if (isDriver) {
      return unavailableDates;
    } else {
      const marks: any = { ...unavailableDates };

      Object.keys(bookingDates).forEach(date => {
        marks[date] = {
          selected: true,
          selectedColor: "#4CAF50",
          textColor: "#fff",
        };
      });

      return marks;
    }
  };

  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setOpen(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };



  return (
    <>
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ marginVertical: 30 }}>
          <Text style={styles.headerTitle}>{isDriver ? "Manage Availability" : "Choose Date & Time"}</Text>
          <View style={styles.headerUnderline} />
        </View>

        <Calendar
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          minDate={new Date().toISOString().split('T')[0]}
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
            <TouchableOpacity style={styles.button} disabled>
              <Icon name="location-outline" size={20} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.buttonTextcontainer}>
                {trip.pickupLocation || "Pickup Location"}
              </Text>
            </TouchableOpacity>
          </Link>

          <View>
            <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
              <Icon name="time-outline" size={20} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.buttonTextcontainer}>
                {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {open && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  setOpen(false);
                  if (selectedTime) {
                    setTime(selectedTime);
                    setTripDetails({ bookingTime: selectedTime.toISOString() });
                  }
                }}
              />
            )}
          </View>
        </View>

        <View style={{ alignItems: 'center', marginBlock: 15 }}>
          {!isDriver && (
            <Link href="/bookinginfo" asChild disabled={Object.keys(bookingDates).length === 0}>
              <TouchableOpacity style={{ backgroundColor: Object.keys(bookingDates).length === 0 ? '#ccc' : 'black', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginBlock: 10 }}>
                <Text style={{ color: 'white', fontFamily: 'Poppins_500Medium', fontSize: 14 }}>
                  Booking Info
                </Text>
              </TouchableOpacity>
            </Link>
          )}

          {isDriver && (
            <Text style={{ color: '#757575', fontFamily: 'Poppins_400Regular', marginTop: 10 }}>
              Tap dates to mark them as unavailable (Red).
            </Text>
          )}
        </View>

      </ScrollView>
      {isDriver ? <DriverBottomBar /> : <BottomBar />}
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
    fontSize: 14,
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
