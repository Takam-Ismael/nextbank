import Constants from 'expo-constants';

export const getHostIp = () => {
  // Expo automatically knows the IP of the computer running the bundler!
  // It's stored in Constants.expoConfig.hostUri
  const hostUri = Constants.expoConfig?.hostUri;
  
  if (hostUri) {
    // hostUri usually looks like: "10.97.5.72:8082"
    // We just want the IP part before the colon
    return hostUri.split(':')[0];
  }
  
  // Fallback to Production VPS IP
  return '51.254.134.173';
};
