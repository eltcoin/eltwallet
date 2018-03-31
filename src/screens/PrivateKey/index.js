import React, { Component } from 'react';
import { SafeAreaView, Share, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  GradientBackground,
  Header,
  SecondaryButton,
  Text,
} from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  privateKeyTitle: {
    paddingHorizontal: 15,
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 18,
  },
  privateKey: {
    paddingHorizontal: 15,
    color: '#9d9d9d',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

class PrivateKey extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    privateKey: PropTypes.string.isRequired,
  };

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Header
            onBackPress={() => this.props.navigation.goBack()}
            title="Private key"
          />
          <View>
            <Text style={styles.privateKeyTitle}>Private key</Text>
            <Text style={styles.privateKey}>{this.props.privateKey}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={() => {
                Share.share({
                  message: this.props.privateKey,
                  title: 'My Eltwallet private key',
                });
              }}
              text="Export"
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  privateKey: state.privateKey,
});

export default connect(mapStateToProps)(PrivateKey);
