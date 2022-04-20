import "../styles/globals.css";
import { OverallContextProvider } from "../Context/overall-context";


function MyApp({ Component, pageProps }) {
  return (
    <OverallContextProvider>
      <Component {...pageProps} />
    </OverallContextProvider>
  );
}

export default MyApp;
