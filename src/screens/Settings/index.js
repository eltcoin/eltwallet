import React, { Component } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Header, Menu, Text } from '../../components';
import { LOGOUT } from '../../config/actionTypes';
import { persistor } from '../../config/store';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  networkNameContainer: {
    alignItems: 'center',
  },
  networkName: {
    color: '#fff',
    fontSize: 16,
  },
});

class Settings extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    network: PropTypes.string.isRequired,
  };

  menuOptions = [
    {
      title: 'Change PIN',
      onPress: () => {
        this.props.navigation.navigate('CreateWallet', {
          editMode: true,
        });
      },
    },
    {
      title: 'Change network',
      onPress: () => {
        this.props.navigation.navigate('NetworkPicker');
      },
    },
    {
      title: 'View private key',
      onPress: () => {
        this.props.navigation.navigate('PrivateKey');
      },
    },
    {
      title: 'Logout',
      onPress: () => {
        Alert.alert(
          'Logout',
          'Your wallet will be erased from your device. Make sure to backup your private key before going further.',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                await this.props.logout();

                this.props.navigation.navigate('Welcome');
              },
            },
          ],
          { cancelable: false },
        );
      },
    },
  ];

  getNetworkName = () => {
    switch (this.props.network) {
      case 'ropsten':
        return 'ETH Ropsten';
      case 'kovan':
        return 'ETH Kovan';
      case 'rinkeby':
        return 'ETH Rinkeby';
      default:
        return 'ETH Mainnet';
    }
  };

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Header
            onBackPress={() => this.props.navigation.goBack()}
            title="Settings"
          />
          <Menu options={this.menuOptions} />
          <View style={styles.networkNameContainer}>
            <Text style={styles.networkName}>
              Connected to {this.getNetworkName()}
            </Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  network: state.network,
});

const mapDispatchToProps = dispatch => ({
  logout: async () => {
    dispatch({ type: LOGOUT });
    await persistor.flush();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
