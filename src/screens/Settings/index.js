import React, { Component } from 'react';
import { Alert, Linking, SafeAreaView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Header, Menu } from '../../components';
import { LOGOUT } from '../../config/actionTypes';
import { persistor } from '../../config/store';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
});

class Settings extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
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
      title: 'View private key',
      onPress: () => {
        this.props.navigation.navigate('PrivateKey');
      },
    },
    {
      title: 'ELTCOIN Website',
      onPress: () => {
        Linking.openURL('https://www.eltcoin.tech');
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

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Header
            onBackPress={() => this.props.navigation.goBack()}
            title="Settings"
          />
          <Menu options={this.menuOptions} />
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: async () => {
    dispatch({ type: LOGOUT });
    await persistor.flush();
  },
});

export default connect(null, mapDispatchToProps)(Settings);
