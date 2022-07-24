import {Route,Routes} from "react-router-dom"
import Login from "./Components/Login";
import Main from "./Components/Main";
import Register from "./Components/Register";
import Reset from "./Components/Reset";
function App() {

  return (
      <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/home" element={<Main authed={true}/>} />
          <Route exact path="/register" element={<Register authed={true}/>} />
          <Route exact path="/reset" element={<Reset authed={true}/>} />
      </Routes>
  );
}

export default App;
