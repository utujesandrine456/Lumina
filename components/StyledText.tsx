import { Text, TextProps } from './Themed';
import { Platform } from 'react-native';

export function MonoText(props: TextProps) {
  const webStyle = Platform.OS === 'web' ? { 
    fontFamily: 'Poppins_400Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: props.style?.color || '#000000'
  } : { fontFamily: 'Poppins_400Regular' };
  
  return <Text {...props} style={[webStyle, props.style]} />;
}
