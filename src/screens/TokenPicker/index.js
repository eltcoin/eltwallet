import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Header, Menu } from '../../components';
import { DELETE_TOKEN, SET_DEFAULT_TOKEN } from '../../config/actionTypes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
});

class TokenPicker extends Component {
  static propTypes = {
    availableTokens: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired,
      }),
    ).isRequired,
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
    onDeleteToken: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#181724',
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
  };

  render() {
    const menuOptions = [
      ...this.props.availableTokens.map(token => ({
        onDeletePress: () => {
          this.props.onDeleteToken(token);
        },
        onPress: () => {
          this.props.onTokenChange(token);
          this.props.navigator.pop();
        },
        swipeToDelete: !['ELT', 'ETH'].includes(token.symbol),
        title: token.name,
      })),
      {
        onPress: () => {
          this.props.navigator.push({
            screen: 'AddToken',
            animationType: 'slide-horizontal',
          });
        },
        title: 'Add new token',
      },
    ];

    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigator.pop()}
            title="Select coin"
          />
          <Menu options={menuOptions} />
        </View>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  availableTokens: state.availableTokens,
});

const mapDispatchToProps = dispatch => ({
  onDeleteToken: token => dispatch({ type: DELETE_TOKEN, token }),
  onTokenChange: token => dispatch({ type: SET_DEFAULT_TOKEN, token }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenPicker);
