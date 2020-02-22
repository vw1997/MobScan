import * as React from 'react';
import { Text } from 'react-native';

export function BrandonText(props) {
  return <Text {...props} style={[props.style, { fontFamily: 'brandon-text' }]} />;
}