import uuid from 'react-native-uuid';
import {
  ADD_TOKEN,
  DELETE_TOKEN,
  LOGOUT,
  RESET_TOKENS,
  SET_CALL_TO_ACTION_DISMISSED,
  SET_DEFAULT_TOKEN,
  SET_NETWORK,
  SET_PIN_CODE,
  SET_PRIVATE_KEY,
  SET_WALLET_ADDRESS,
} from './actionTypes';
import { defaultTokens } from '../utils/constants';
import AnalyticsUtils from '../utils/analytics';

const defaultState = {
  availableTokens: defaultTokens,
  callToActionDismissed: false,
  selectedToken: defaultTokens[0],
  network: 'mainnet',
};

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TOKEN:
      AnalyticsUtils.trackEvent('Add custom token', {
        contractAddress: action.token.contractAddress,
        decimals: action.token.decimals,
        name: action.token.name,
        symbol: action.token.symbol,
      });

      return {
        ...state,
        availableTokens: state.availableTokens.concat([
          Object.assign(
            action.token,
            { id: uuid.v4() },
            action.token.name === 'ELTCOIN'
              ? {
                  symbol: 'ELT',
                }
              : {},
          ),
        ]),
      };
    case DELETE_TOKEN:
      return {
        ...state,
        availableTokens: state.availableTokens.filter(
          token => token.id !== action.token.id,
        ),
        selectedToken: state.availableTokens[0],
      };
    case RESET_TOKENS:
      return {
        ...state,
        availableTokens: state.availableTokens.filter(
          token => token.name === 'Ethereum',
        ),
        selectedToken: state.availableTokens.filter(
          token => token.name === 'Ethereum',
        )[0],
      };
    case SET_CALL_TO_ACTION_DISMISSED:
      return {
        ...state,
        callToActionDismissed: true,
      };
    case SET_DEFAULT_TOKEN:
      return {
        ...state,
        selectedToken: action.token,
      };
    case SET_NETWORK:
      AnalyticsUtils.trackEvent('Set network', {
        network: action.network,
      });

      return {
        ...state,
        network: action.network,
      };
    case SET_PIN_CODE:
      return {
        ...state,
        pinCode: action.pinCode,
      };
    case SET_PRIVATE_KEY:
      return {
        ...state,
        privateKey: action.privateKey,
      };
    case SET_WALLET_ADDRESS:
      return {
        ...state,
        walletAddress: action.walletAddress,
      };
    default:
      return state;
  }
};

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }

  return appReducer(state, action);
};

export { defaultState, rootReducer };
