import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
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
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    onDeleteToken: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
  };

  render() {
    const menuOptions = [
      ...this.props.availableTokens.map(token => ({
        onDeletePress: () => {
          this.props.onDeleteToken(token);
        },
        onPress: () => {
          this.props.onTokenChange(token);
          this.props.navigation.goBack();
        },
        swipeToDelete: !['ELT', 'ETH'].includes(token.symbol),
        title: token.name,
      })),
      {
        onPress: () => {
          this.props.navigation.navigate('AddToken');
        },
        title: 'Add new token',
      },
    ];

    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Header
            onBackPress={() => this.props.navigation.goBack()}
            title="Select coin"
          />
          <Menu options={menuOptions} />
        </SafeAreaView>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TokenPicker);
