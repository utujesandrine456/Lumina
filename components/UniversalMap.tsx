import React from "react";
import { Platform, View, StyleSheet, Text } from "react-native";

type UniversalMapType = React.FC<any> & {
  Marker: React.FC<any>;
};

const UniversalMap: UniversalMapType = (props: any) => {
  const { children, style, initialRegion, ...mapProps } = props;

  if (Platform.OS === "web") {
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
  }

  // Only require react-native-maps on native platforms
  const NativeMap = require("react-native-maps");
  const MapView = NativeMap.default;
  const Marker = NativeMap.Marker;

  return (
    <MapView style={style} initialRegion={initialRegion} {...mapProps}>
      {children && React.Children.map(children, (child: any) => {
        if (!child) return null;
        // Check if the child is a Marker by comparing types or just passing it through if it looks like a marker
        // Since we are using a custom Marker static, strict equality check might fail if not careful, 
        // but here we just want to pass props to the Native Marker.
        if (React.isValidElement(child) && (child.type === UniversalMap.Marker || (child.type as any).displayName === 'Marker')) {
          const markerProps = child.props || {};
          return <Marker {...markerProps} />;
        }
        return child;
      })}
    </MapView>
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