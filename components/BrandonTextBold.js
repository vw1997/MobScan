import * as React from 'react';
import { Text } from 'react-native';

export function BrandonTextBold(props) {
  return <Text {...props} style={[props.style, { fontFamily: 'brandon-text-bold' }]} />;
}