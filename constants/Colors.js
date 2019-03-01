const tintColor = '#2f95dc'
const brown = '#49281F'
const brownLight = '#564334'
const coral = '#e6562e'
const coralLight = '#FDA17C'
const green = '#918a55'
const greenDark = '#676b29'
const greenLight = '#a4b15e'
const tan = '#CFB590'
const white = '#f6e5c7'
const gray = '#ccc'

export default {
  white,
  coral,
  green,
  greenDark,
  buttonDefault: brown,
  tintColor,
  tabDefault: brown,
  tabSelected: white,
  navBackground: coral,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
};

export function getButtonBackground(opacity) { return `rgba(246, 229, 199, ${opacity})` } // color is tan, but need rgba for opacity
