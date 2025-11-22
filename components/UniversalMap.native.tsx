import React from "react";
import MapView, { Marker } from "react-native-maps";

type UniversalMapType = React.FC<any> & {
    Marker: typeof Marker;
};

const UniversalMap: UniversalMapType = (props: any) => {
    const { children, style, initialRegion, ...mapProps } = props;

    return (
        <MapView style={style} initialRegion={initialRegion} {...mapProps}>
            {children}
        </MapView>
    );
};

UniversalMap.Marker = Marker;

export default UniversalMap;
