import { useState } from "react";
import "./App.css";
import Zoom from "./Zoom";

const App = () => {
  const [joinMeeting, setJoinMeeting] = useState(false);

  const handleJoinMeeting = () => {};

  return (
    <div className="App">
      {joinMeeting ? (
        <Zoom />
      ) : (
        <button onClick={()=> setJoinMeeting(true)}>Join meeting</button>
      )}
    </div>
  );
};

export default App;
