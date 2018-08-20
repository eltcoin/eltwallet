import React, { Component } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StackActions, NavigationActions } from 'react-navigation';
import { GradientBackground, Header, Menu } from '../../components';
import { RESET_TOKENS, SET_NETWORK } from '../../config/actionTypes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
});

class NetworkPicker extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    onNetworkChange: PropTypes.func.isRequired,
    resetTokens: PropTypes.func.isRequired,
  };

  menuOptions = [
    {
      title: 'ETH Mainnet',
      onPress: () => this.setNetwork('mainnet'),
    },
    {
      title: 'ETH Ropsten',
      onPress: () => this.setNetwork('ropsten'),
    },
    {
      title: 'ETH Kovan',
      onPress: () => this.setNetwork('kovan'),
    },
    {
      title: 'ETH Rinkeby',
      onPress: () => this.setNetwork('rinkeby'),
    },
  ];

  setNetwork = network => {
    Alert.alert(
      'Change network',
      'Switching to another ETH network will reset your list of custom tokens, are you sure you want to continue?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            this.props.resetTokens();
            this.props.onNetworkChange(network);

            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'WalletHome' }),
              ],
            });

            this.props.navigation.dispatch(resetAction);
          },
        },
      ],
      { cancelable: false },
    );
  };

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Header
            onBackPress={() => this.props.navigation.goBack()}
            title="Change network"
          />
          <Menu options={this.menuOptions} />
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onNetworkChange: network => dispatch({ type: SET_NETWORK, network }),
  resetTokens: () => dispatch({ type: RESET_TOKENS }),
});

export default connect(
  null,
  mapDispatchToProps,
)(NetworkPicker);
