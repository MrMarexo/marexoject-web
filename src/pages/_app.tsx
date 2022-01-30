import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import "@fontsource/anonymous-pro";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {/* <ColorModeProvider
          options={{ 
            useSystemColorMode: true,
          }}
        > */}
      <Component {...pageProps} />
      {/* </ColorModeProvider> */}
    </ChakraProvider>
  );
}

export default MyApp;
