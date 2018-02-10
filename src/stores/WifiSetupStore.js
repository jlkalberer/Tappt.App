// @flow

import { action, computed, observable, reaction, runInAction } from 'mobx';
import {
  WifiConfigureStore,
  WifiConnectStore,
} from './ApiRequestStores/SoftApApiStores';
import SoftApService from '../SoftApService';
import { LoadObject } from 'brewskey.js-api';
import { waitForLoaded } from './DAOStores';

type WifiSetupStep = 1 | 2 | 3 | 4;

class WifiSetupStore {
  @observable wifiSetupStep: WifiSetupStep = 1;
  @observable _wifiSetupLoaderID = null;

  constructor(navigation) {
    reaction(
      () => this.wifiSetupStep,
      (wifiSetupStep: WifiSetupStep, currentReaction: Object) => {
        // todo make replace instead navigate to prevent using hardware back button
        navigation.navigate(`wifiSetupStep${wifiSetupStep}`);
        if (wifiSetupStep === 4) {
          currentReaction.dispose();
        }
      },
    );
  }

  @computed
  get wifiSetupLoader() {
    return this._wifiSetupLoaderID
      ? WifiConfigureStore.getFromCache(this._wifiSetupLoaderID).map(() =>
          WifiConnectStore.get(),
        )
      : LoadObject.empty();
  }

  @action
  onStep1Ready = () => {
    this.setWifiSetupStep(2);
    this._queryParticleID();
  };

  @action
  setWifiSetupStep = (step: WifiSetupStep) => {
    this.wifiSetupStep = step;
  };

  @action
  setupWifi = async (wifiNetwork: WifiNetwork): Promise<void> => {
    this._wifiSetupLoaderID = WifiConfigureStore.fetch(wifiNetwork);
    await waitForLoaded(() => this.wifiSetupLoader, 15000);
    this.setWifiSetupStep(4);
  };

  @action
  _queryParticleID = async () => {
    try {
      const particleID = await SoftApService.getParticleID();
      runInAction(() => {
        this._particleID = particleID;
        this.setWifiSetupStep(3);
      });
    } catch (error) {
      this._queryParticleID();
    }
  };
}

export default WifiSetupStore;