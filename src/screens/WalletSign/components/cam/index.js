import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
import cameraIcon from '../ApproveTransaction/images/camera.png';

const styles = StyleSheet.create({
  cameraIcon: {
    height: 23,
    width: 30,
  },
});

class Cam extends Component {
  static propTypes = {
    onCameraPress: PropTypes.func.isRequired,
  };

  render() {
    const { onCameraPress } = this.props;

    const ScrollContainer =
      Platform.OS === 'ios' ? KeyboardAwareScrollView : ScrollView;

    return (
      <View>
        <TouchableOpacity onPress={onCameraPress}>
          <Text>Cam</Text>
          <Image source={cameraIcon} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Cam);
