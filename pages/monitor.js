 import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/core';
export default ({navigation}) => {

  const route = useRoute();
  const {tambo} = route.params;
  
  const host = tambo.host
  console.log('HOST', host)
  const ip=host.slice(0,-4)
  console.log('IP', ip)
  console.log('TAMBO', tambo )
  return (
      <WebView
        source={{ uri: `http://${ip}8080/react-responsive/` }}
      />
  );
}
