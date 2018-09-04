import React, { Component } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  AppRegistry,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import {
  GradientBackground,
  Header,
  SecondaryButton,
  Text,
} from '../../components';
import ApproveTransaction from './components/ApproveTransaction';
import AnalyticsUtils from '../../utils/analytics';
import WalletUtils from '../../utils/wallet';
import units, { convert } from 'ethereum-units';
import WS from 'react-native-websocket';
import Cam from './components/cam';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.25,
    marginTop: 25,
  },
  formContainer: {
    flex: 0.25,
    marginTop: 15,
    alignItems: 'flex-start',
    marginLeft: 15,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  formItem: {
    // backgroundColor:'#fff',
    minHeight: 30,
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'stretch',
    marginBottom: 15,
  },
  formDetail: {
    flex: 2.2,
    fontSize: 12,
    color: '#fff',
    maxWidth: 350,
    fontFamily: 'Courier',
    overflow: 'hidden',
  },
  formLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  preview: {
    flex: 1,
    marginTop: 15,
  },
});

class WalletSign extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    tx: { to: 'noTxHere', gas: 0 },
    isLoading: false,
    chatID: '',
  };

  componentWillUnmount = () => {
    console.warn('will unmount');
  };

  onBarCodeRead = async _tx => {
    // AnalyticsUtils.trackEvent('Read unsigned TX QR code');

    if (_tx.match(/eltbotCallback\:/)) {
      let txObjStr = _tx.replace('eltbotCallback:', '');
      let tx = JSON.parse(txObjStr);

      await this.setState({
        tx: tx.ethereumURI,
        chatID: tx.chatID,
      });

      this.ws.send(_tx);
    }
  };

  goBack = () => {
    console.warn('going back');
    const backAction = NavigationActions.back({
      key: null,
    });

    this.props.navigation.dispatch(backAction);
  };

  sendTransaction = async () => {
    try {
      this.setState({
        isLoading: true,
      });

      WalletUtils.sendIDEXContractTransaction(this.state.tx);
      this.setState(
        {
          isLoading: false,
        },
        () => {
          console.warn('Working');
        },
      );
    } catch (error) {
      console.warn(error);
      this.setState(
        {
          isLoading: false,
        },
        () => {
          Alert.alert(
            `An error happened during the transaction, please try again later`,
          );
        },
      );
    }
  };

  onOpenWs = (a, b, c) => {
    console.warn('opened websocket session', a, b, c);
    console.warn(this.ws);
    this.ws.send('test2');
  };

  onMessage = theMessage => {
    console.warn('got message: ' + theMessage);
  };

  render() {
    let weiToEth = wei => {
      return wei / Math.pow(10, 18);
    };
    let tx = this.state['tx'];

    let openScanner = () => {
      this.props.navigation.navigate('Camera', {
        onBarCodeRead: this.onBarCodeRead,
      });
    };

    let ethValue = weiToEth(parseInt(tx.value));

    const gasWei = parseInt(tx.gas);

    const gasPrice = convert(gasWei, 'wei', 'shannon');

    let functionSignature = tx.functionSignature || '';
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <WS
            ref={ref => {
              this.ws = ref;
            }}
            url="ws://192.168.1.112:8080"
            onOpen={this.onOpenWs}
            onMessage={this.onMessage}
            onError={console.error}
            onClose={console.warn}
            reconnect
          />
          <Header onBackPress={() => this.goBack()} title="Sign" />
          <View style={styles.buttonContainer}>
            <SecondaryButton
              disabled={this.state.disabled}
              isLoading={this.state.isLoading}
              onPress={openScanner}
              text="Scan"
            />
          </View>
          <View style={styles.formContainer}>
            <View style={styles.formItem}>
              <Text style={styles.formLabel}>To:</Text>
              <Text style={styles.formDetail}>{tx.to}</Text>
            </View>
            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Kind:</Text>
              <Text style={styles.formDetail}>{tx.mode}</Text>
            </View>
            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Value ETH:</Text>
              <Text style={styles.formDetail}>{ethValue}</Text>
            </View>
            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Function:</Text>
              <Text style={styles.formDetail}>
                {functionSignature.name}
                ()
              </Text>
            </View>
            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Gas Price:</Text>
              <Text style={styles.formDetail}>
                {parseFloat(gasPrice.toString())
                  .toFixed(2)
                  .toString()}{' '}
                mwei / shannon
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <SecondaryButton
              disabled={this.state.disabled}
              onPress={this.sendTransaction}
              text="Sign & Send"
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  tx: state.tx,
});
export default connect(mapStateToProps)(WalletSign);
