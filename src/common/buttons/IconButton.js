// @flow

// the component fixes touchable feedback for react-native-elements Icon
// the current version works only for raised=false icon.

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableItem from './TouchableItem';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

type Props = {
  onPress?: () => void,
  // react-native-elements icon props
};

const IconButton = ({ onPress, ...rest }: Props) => (
  <TouchableItem borderless onPress={onPress}>
    <Icon {...rest} containerStyle={styles.container} />
  </TouchableItem>
);

export default IconButton;