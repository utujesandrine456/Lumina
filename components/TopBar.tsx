import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useRouter, Link} from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
    title: string;
}
export default function TopBar({title}: Props){
    const router = useRouter();

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.leftGroup}>
                    <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: 'black', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="chevron-back" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                </View>

                <View style={styles.rightGroup}>
                    <Link href="/farmerprofile" asChild>
                        <TouchableOpacity >
                            <Ionicons name="person-circle-outline" size={28} color="white" />
                        </TouchableOpacity>
                    </Link>
                    
                    <TouchableOpacity>
                    <MaterialIcons
                            name="notifications-active"
                            size={28}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#000",
        paddingBottom: 5,
        paddingTop: 10,
        width: "100%"
    },
    statusBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        alignItems: "center",
        marginBottom: 6,
        fontFamily: 'Poppins_500Medium',
    },
    statusText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: 'Poppins_500Medium',
    },
    statusIcons: {
        flexDirection: "row",
        gap: 8
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    leftGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    rightGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    title: {
        color: "#fff",
        fontSize: 22,
        fontFamily: 'Poppins_600SemiBold',
    }
    
})