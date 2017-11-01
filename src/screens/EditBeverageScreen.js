// @flow

import type { Beverage } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import BeverageForm from '../components/BeverageForm';

type Props = {|
  beverageStore: DAOEntityStore<Beverage, Beverage>,
  id: string,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@inject('beverageStore')
class EditBeverageScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Edit beverage',
  };

  _onFormSubmit = async (values: Beverage): Promise<void> => {
    await this.props.beverageStore.put(values.id, values);
    this.props.navigation.goBack(null);
  };

  render(): React.Element<*> {
    return (
      <BeverageForm
        beverage={this.props.beverageStore.getByID(this.props.id)}
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Edit beverage"
      />
    );
  }
}

export default EditBeverageScreen;
