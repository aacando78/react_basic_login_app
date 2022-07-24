import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [text, setText] = useState(null)
  const [list,setList] = useState([])
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      console.log(data)
      setName(data.name);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = () =>{
      const getRequestOptionPost = {
        method:"POST",
        headers:{
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({text:text})
      }
      fetch(`http://localhost:5000/getdata`,getRequestOptionPost)
      .then(async Response =>{
          if(Response.ok)
          {
            const json = await Response.json()
            setList(json)
          }
      })
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    handleChange()
  }, [user,loading]);
  return (
    <div className="dashboard">
       <div className="dashboard__container">
                    <Container>
                
                <Row style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: '3rem',
                        fontWeight: 'bolder',
                      }}
                      >TODO LIST
                  </Row>

                <hr/>
                <Row>
                <Col md={{ span: 5, offset: 4 }}>

                <InputGroup className="mb-3">
                <FormControl
                  placeholder="add item . . . "
                  size="lg"
                  value = {text}
                  onChange = {item => setText(item.target.value)}
                  aria-label="add something"
                  aria-describedby="basic-addon2"
                />
                    <InputGroup>
                      <Button
                        variant="dark"
                        size="lg"
                        onClick = {()=>handleChange()}
                        >
                        ADD
                      </Button>
                    </InputGroup>
                  </InputGroup>

              </Col>
              </Row>
              <Row>
              <Col md={{ span: 5, offset: 4 }}>
              <ListGroup>
              
              {list&&Object.keys(list).map(item => {return(

                  <ListGroup.Item variant="dark">
                    {list[item]["text"]}
                  </ListGroup.Item>

              )})}
              </ListGroup>
              </Col>
              </Row>
              </Container>
            Logged in as
            <div>{name}</div>
            <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
       
     </div>
  );
}
export default Dashboard;