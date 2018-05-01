// @flow

import type { BeverageMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { NavigationActions } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { BeverageStore, waitForLoaded } from '../stores/DAOStores';
import { UpdateBeverageImageStore } from '../stores/ApiRequestStores/CommonApiStores';
import { flushImageCache } from '../common/CachedImage';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import BeverageForm from '../components/BeverageForm';
import SnackBarStore from '../stores/SnackBarStore';

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
class NewBeverageScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (
    values: BeverageMutator & { beverageImage?: string },
  ): Promise<void> => {
    const { navigation } = this.injectedProps;
    const { beverageImage, ...beverageMutator } = values;
    const clientID = DAOApi.BeverageDAO.post(beverageMutator);
    const { id } = await waitForLoaded(() => BeverageStore.getByID(clientID));

    if (beverageImage) {
      await waitForLoaded(() =>
        UpdateBeverageImageStore.get(id, beverageImage),
      );
      UpdateBeverageImageStore.flushCache();
      flushImageCache(`https://brewskey.com/cdn/beverages/${id.toString()}`);
    }

    const resetRouteAction = NavigationActions.reset({
      actions: [
        NavigationActions.navigate({ routeName: 'myBeverages' }),
        NavigationActions.navigate({
          params: { id },
          routeName: 'beverageDetails',
        }),
      ],
      index: 1,
    });
    navigation.dispatch(resetRouteAction);
    SnackBarStore.showMessage({ text: 'New beverage created.' });
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="New beverage" />
        <BeverageForm
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Create beverage"
        />
      </Container>
    );
  }
}

export default NewBeverageScreen;
