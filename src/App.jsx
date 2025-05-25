import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className="justify-center items-center flex flex-col h-screen">
        <Button className="bg-blue-500 text-white py-2 px-4 rounded">
          Welcome to KSM Multimedia
        </Button>
      </div>
    </>
  );
}

export default App;
