import React from "react";
import { Platform, View, StyleSheet } from "react-native";

type UniversalMapType = React.FC<any> & {
  Marker: React.FC<any>;
  Callout: React.FC<any>;
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
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
          }}
          allowFullScreen
          loading="lazy"
        />
      </View>
    );
  }

  const NativeMap = require("react-native-maps");
  const MapView = NativeMap.default;
  const Marker = NativeMap.Marker;
  const Callout = NativeMap.Callout;

  return (
    <MapView style={style} initialRegion={initialRegion} {...mapProps}>
      {children &&
        React.Children.map(children, (child: any) => {
          if (!child) return null;
          if (child.type === UniversalMap.Marker) {
            const markerProps = child.props;
            return (
              <Marker {...markerProps}>
                {markerProps.children}
              </Marker>
            );
          }

          return child;
        })}
    </MapView>
  );
};

UniversalMap.Marker = (props: any) => <>{props.children}</>;
UniversalMap.Callout = (props: any) => <>{props.children}</>;

const styles = StyleSheet.create({
  webMapContainer: {
    overflow: "hidden",
    position: "relative",
  },
});

export default UniversalMap;
