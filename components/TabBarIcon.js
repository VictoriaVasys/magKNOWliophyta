import React from 'react';
import {Icon} from 'react-native-elements'

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  render() {
    const {name, focused} = this.props
    const iconProps = {
      color: this.props.focused ? Colors.tabSelected : Colors.tabDefault,
      iconStyle: {marginTop: 3, marginBottom: -3},
      name,
      size: 30,
      type: 'material',
    }
    return (
      <Icon {...iconProps}/>
    );
  }
}