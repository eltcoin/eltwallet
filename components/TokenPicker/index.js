import React, { Component } from 'react';
import { Picker, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import StorageUtils from '../../utils/storage';

const styles = StyleSheet.create({
  tokenPicker: {
    position: 'absolute',
    top: 0,
    width: 1000,
    height: 1000,
  },
});

export default class TokenPicker extends Component {
  static propTypes = {
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
    onAddNewToken: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
  };

  state = {
    availableTokens: [],
  };

  componentDidMount() {
    this.fetchAvailableTokens();
  }

  componentDidUpdate() {
    this.fetchAvailableTokens();
  }

  onTokenChange = tokenName => {
    if (tokenName === 'newToken') {
      this.props.onAddNewToken();
      return;
    }

    const selectedToken = this.state.availableTokens.find(
      token => token.name === tokenName,
    );

    this.props.onTokenChange(selectedToken);

    StorageUtils.setDefaultToken(selectedToken);
  };

  async fetchAvailableTokens() {
    const availableTokens = await StorageUtils.getAvailableTokens();

    this.setState({
      availableTokens,
    });
  }

  render() {
    return (
      <Picker
        onValueChange={this.onTokenChange}
        selectedValue={this.props.selectedToken.name}
        style={styles.tokenPicker}
      >
        {this.state.availableTokens.map(token => (
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
