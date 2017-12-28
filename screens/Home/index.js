import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Image, StyleSheet, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { PrimaryButton, SecondaryButton } from '../../components';
import logo from './images/logo.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0B0C',
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: '65%',
  },
  buttonsContainer: {
    width: '100%',
  },
});

export default class Home extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  async componentDidMount() {
    const walletAddress = await AsyncStorage.getItem('@ELTWALLET:address');

    if (walletAddress) {
      this.props.navigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'WalletHome',
            }),
          ],
        }),
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.buttonsContainer}>
          <PrimaryButton
            onPress={() => this.props.navigation.navigate('CreateWallet')}
            text="Create wallet"
          />
          <SecondaryButton onPress={() => {}} text="Recover wallet" />
        </View>
      </View>
    );
  }
}
