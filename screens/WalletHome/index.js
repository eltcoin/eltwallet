import React, { Component } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import logo from './images/logo.png';
import settings from './images/settings.png';

const transactions = [
  {
    key: 0,
    title: 'Received ELT',
    status: 'Pending',
    amount: 54000,
    timestamp: '3 hours ago',
  },
  {
    key: 1,
    title: 'Sent ELT',
    status: 'Completed',
    amount: 54000,
    timestamp: '2 days ago',
  },
  {
    key: 2,
    title: 'Sent ELT',
    status: 'Completed',
    amount: 54000,
    timestamp: '1 month ago',
  },
];

export default class WalletHome extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
          alignItems: 'center',
          paddingTop: 40,
        }}
      >
        <Image source={logo} style={{ width: '50%' }} resizeMode="contain" />
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
            paddingHorizontal: 15,
            width: '100%',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 30, letterSpacing: 3 }}>
              1500
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                letterSpacing: 3,
                fontWeight: '200',
                alignSelf: 'flex-end',
                paddingBottom: 3,
              }}
            >
              ELT
            </Text>
          </View>
          <Image source={settings} style={{ width: 24, height: 24 }} />
        </View>
        <View style={{ paddingTop: 50, width: '100%' }}>
          <FlatList
            style={{
              borderColor: '#372F49',
              borderTopWidth: 1,
            }}
            data={transactions}
            renderItem={({ item }) => (
              <View
                style={{
                  borderColor: '#372F49',
                  borderBottomWidth: 1,
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'column' }}>
                  <Text
                    style={{ color: '#fff', fontSize: 20, textAlign: 'left' }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: '#aaa',
                      fontSize: 15,
                      textAlign: 'left',
                      paddingTop: 5,
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text
                    style={{ color: '#fff', fontSize: 20, textAlign: 'right' }}
                  >
                    {item.amount} ELT
                  </Text>
                  <Text
                    style={{
                      color: '#aaa',
                      fontSize: 15,
                      textAlign: 'right',
                      paddingTop: 5,
                    }}
                  >
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}
