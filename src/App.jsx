import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chat from "./Chat"

function App() {
  const [count, setCount] = useState(0)
  const [username, setUsername] = useState("jomel");
  const [password,serPassword] = useState("Josue2307");
  const [enter,setEnter] = useState(true);

  return (
    <>
      <div>
        <h1>Login</h1>
        <div className='flex flex-col p-2 gap-2'>
          <input value={username} placeholder='Usuario' onChange={(e) => setUsername(e.target.value)}/> 
          <input value={password} type="password" placeholder='Contraseña' onChange={(e) => serPassword(e.target.value)}/>
        </div>
        <button onClick={() =>{setEnter(true)}}>Iniciar</button>
        <button onClick={()=> {setEnter(false)}}> Quitar</button>
      </div>
      <div>
        <Chat username={username} password={password} tryEnter={enter} exit={() => setEnter(false)}/>
      </div>
    </>
  )
}

export default App
