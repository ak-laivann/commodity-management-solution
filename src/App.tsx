import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootContainer } from "./container/RootContainer";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RootContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
