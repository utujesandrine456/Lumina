import React from "react";
import { View, StyleSheet } from "react-native";

type UniversalMapType = React.FC<any> & {
    Marker: React.FC<any>;
};

const UniversalMap: UniversalMapType = (props: any) => {
    const { children, style, initialRegion } = props;

    const lat = initialRegion?.latitude || 0;
    const lon = initialRegion?.longitude || 0;

    return (
        <View style={[styles.webMapContainer, style]}>
            <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                    display: 'block'
                }}
                allowFullScreen
                loading="lazy"
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    webMapContainer: {
        overflow: 'hidden',
        position: 'relative',
    },
});

UniversalMap.Marker = (props: any) => null;

export default UniversalMap;
