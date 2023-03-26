import "./App.css";
import Layout from "./components/layout/Layout";
import ReactGA from "react-ga4";
import { useEffect } from "react";
function App() {

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_REACTGA_INITIALIZE);
    // ReactGA.pageview(window.location.pathname + window.location.search)
    ReactGA.send({ hitType: "pageview", page: window.location.pathname});

   
    
  }, []);

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
