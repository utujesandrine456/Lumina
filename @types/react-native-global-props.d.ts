declare module 'react-native-global-props' {
  import { TextProps, TextInputProps } from 'react-native';

  export function setCustomText(customProps: { style?: TextProps['style'] }): void;
  export function setCustomTextInput(customProps: { style?: TextInputProps['style'] }): void;
}
