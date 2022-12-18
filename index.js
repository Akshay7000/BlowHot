import { registerRootComponent, AppRegistry } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
// AppRegistry.registerComponent("main", () => App);

// get ColorPropType(): $FlowFixMe {
//     console.warn('');
//     return require('deprecated-react-native-prop-types').ColorPropType;
//   },

//   get EdgeInsetsPropType(): $FlowFixMe {
//     console.warn('');
//     return require('deprecated-react-native-prop-types').EdgeInsetsPropType;
//   },

//   get PointPropType(): $FlowFixMe {
//     console.warn('');
//     return require('deprecated-react-native-prop-types').PointPropType;
//   },

//   get ViewPropTypes(): $FlowFixMe {
//     console.warn('');
//     return require('deprecated-react-native-prop-types').ViewPropTypes;
//   }
