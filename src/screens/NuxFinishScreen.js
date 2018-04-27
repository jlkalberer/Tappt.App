// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Button from '../common/buttons/Button';
import InjectedComponent from '../common/InjectedComponent';
import Header from '../common/Header';
import Container from '../common/Container';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  descriptionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
    paddingVertical: 30,
    textAlign: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
  },
});

type InjectedProps = {|
  onContinuePress: () => void | Promise<void>,
|};

@flatNavigationParamsAndScreenProps
class NuxFinishPress extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <Header title="Setup completed" />
        <View style={styles.container}>
          <Text style={styles.descriptionText}>
            Whooray! You successfully made all the necessary preparation and can
            start pouring from you tap!
          </Text>
          <Button
            onPress={this.injectedProps.onContinuePress}
            secondary
            title="Finish"
          />
        </View>
      </Container>
    );
  }
}

export default NuxFinishPress;