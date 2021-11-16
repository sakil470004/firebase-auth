import logo from './logo.svg';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


import firebaseConfig from './firebase.config'
import { useState } from 'react';

const app = initializeApp(firebaseConfig);


function App() {
  const provider = new GoogleAuthProvider();
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    complect: ''
  })
  const handleSingIn = () => {

    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        //  console.log(result)
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const { displayName, photoURL, email } = result.user;
        //create new object
        const singedInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL

        }
        setUser(singedInUser);

        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log('error in singInPop')
      });
  }

  const handleSingOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      const singedOutUser = {
        isSignIn: false,
        name: '',
        email: '',
        photo: '',

      }
      setUser(singedOutUser);
      console.log("singOUted")
    }).catch((error) => {
      // An error happened.
    });
  }
  const handleBlur = (event) => {
    // console.log(event.target.name, event.target.value)
    let isFildValid = true;
    if (event.target.name === 'email') {
      isFildValid = /\S+@\S+\.\S+/.test(event.target.value)

    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6
      const isPasswordContainNumber = /\d{1}/.test(event.target.value)
      isFildValid = isPasswordValid && isPasswordContainNumber;
      user.password=event.target.value
    }
    if (isFildValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    if (user.name && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          // ...
          const newUserInfo = { ...user };
          newUserInfo.complect = "Successfully Created";
          newUserInfo.error = '';
          setUser(newUserInfo);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          const newUserInfo = { ...user };
          newUserInfo.error = errorCode;
          newUserInfo.complect = '';
          setUser(newUserInfo);
          console.log(errorCode)
        });
      // console.log(user.email,user.password)
    }
    if (!newUser && user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const newUserInfo = { ...user };
          newUserInfo.complect = "Successfully LogIn";
          newUserInfo.error = '';
          setUser(newUserInfo);
          // console.log ('okkk')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const newUserInfo = { ...user };
          newUserInfo.error = errorCode;
          newUserInfo.complect = '';
          setUser(newUserInfo);
          console.log(errorCode)
        });
        
    }
    console.log ('okkk', user.email, newUser,user.password, 'sakil')
    e.preventDefault();
  }

  return (
    <div className="App">

      {user.isSignIn ?
        <button onClick={handleSingOut} >Sing Out</button>
        : <button onClick={handleSingIn}>Sing In</button>

      }
      {
        user.isSignIn &&
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email ,{user.email}</p>
          <img src={user.photo} alt=''></img>
        </div>
      }

      <h1>Our own Authentication</h1>

      <input type='checkbox' onChange={() => setNewUser(!newUser)} name='newUser' id='' />
      <label htmlFor="newUser">New User Sign</label>
      <form onSubmit={handleSubmit}>

        {newUser && <input type='text' name='name' onBlur={handleBlur} placeholder='Enter your name' />}
        <br />
        <input type='text' onBlur={handleBlur} placeholder='Your Email address' required name='email' />
        <br />
        <input type='password' onBlur={handleBlur} placeholder='your password' name='password' required />
        <br />
        <input type='submit' value='Submit' />
        <p style={{ color: 'red' }}>{user.error}</p>
        <p style={{ color: 'green' }}>{user.complect}</p>

      </form>
    </div>
  );
}

export default App;
