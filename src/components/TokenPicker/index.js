import React, { Component } from 'react';
import { Picker, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SET_DEFAULT_TOKEN } from '../../config/actionTypes';

const styles = StyleSheet.create({
  tokenPicker: {
    position: 'absolute',
    top: 0,
    width: 1000,
    height: 1000,
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
    onAddNewToken: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  };

  onTokenChange = tokenName => {
    if (tokenName === 'newToken') {
      this.props.onAddNewToken();
      return;
    }

    const selectedToken = this.props.availableTokens.find(
      token => token.name === tokenName,
    );

    this.props.onTokenChange(selectedToken);
  };

  render() {
    return (
      <Picker
        onValueChange={this.onTokenChange}
        selectedValue={this.props.selectedToken.name}
        style={styles.tokenPicker}
      >
        {this.props.availableTokens.map(token => (
          <Picker.Item
            label={token.name}
            value={token.name}
            key={token.symbol}
          />
        ))}
        <Picker.Item label="Add custom token" value="newToken" />
      </Picker>
    );
  }
}

const mapStateToProps = state => ({
  availableTokens: state.availableTokens,
});

const mapDispatchToProps = dispatch => ({
  onTokenChange: token => dispatch({ type: SET_DEFAULT_TOKEN, token }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenPicker);
