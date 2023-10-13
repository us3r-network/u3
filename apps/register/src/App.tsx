import { Toaster } from "sonner";
import { FarcasterProvider } from "./providers/FarcasterProvider";
import Web3Provider from "./providers/Web3Provider";
import Header from "./components/Header";
import Register from "./components/Register";

function App() {
  return (
    <Web3Provider>
      <FarcasterProvider>
        <Toaster richColors expand={true} />
        <Header />
        <Register />
      </FarcasterProvider>
    </Web3Provider>
  );
}

export default App;
