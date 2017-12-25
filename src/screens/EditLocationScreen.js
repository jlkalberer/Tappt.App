// @flow

import type {
  EntityID,
  LoadObject,
  Location,
  LocationMutator,
} from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { LocationStore } from '../stores/DAOStores';
import Container from '../common/Container';
import Header from '../common/Header';
import LoaderComponent from '../common/LoaderComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LocationForm from '../components/LocationForm';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class EditLocationScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _locationLoader(): LoadObject<Location> {
    return LocationStore.getByID(this.injectedProps.id);
  }

  _onFormSubmit = (values: LocationMutator) => {
    DAOApi.LocationDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="Edit location" />
        <LoaderComponent
          loadedComponent={LoadedComponent}
          loader={this._locationLoader}
          onFormSubmit={this._onFormSubmit}
        />
      </Container>
    );
  }
}

type LoadedComponentProps = {
  onFormSubmit: (values: LocationMutator) => void,
  value: Location,
};

const LoadedComponent = ({ onFormSubmit, value }: LoadedComponentProps) => (
  <LocationForm
    location={value}
    onSubmit={onFormSubmit}
    submitButtonLabel="Edit location"
  />
);

export default EditLocationScreen;
