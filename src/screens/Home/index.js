import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  GradientBackground,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import logo from './images/logo.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingBottom: 20,
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
    paddingHorizontal: 15,
    width: '100%',
  },
});

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.buttonsContainer}>
            <PrimaryButton
              onPress={() => this.props.navigation.navigate('CreateWallet')}
              text="Create wallet"
            />
            <SecondaryButton
              onPress={() =>
                this.props.navigation.navigate('CreateWallet', {
                  recoverMode: true,
                })
              }
              text="Recover wallet"
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  walletAddress: state.walletAddress,
});

export default connect(mapStateToProps)(Home);
