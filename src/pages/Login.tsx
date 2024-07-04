import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut,updateProfile,getAuth} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import "./globals.css";

interface User {
    id: string;
    name: string;
    email: string;
  }
  
  const LoginPage: React.FC = () => {
    const [logEmail, setLogEmail] = useState('');
    const [logPassword, setLogPassword] = useState('');
    const [resEmail, setResEmail] = useState('');
    const [resPassword, setResPassword] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
  
    const [user, setUser] = useState<User | null>(null);
  
    const router = useRouter();
    const auth = getAuth();
  
    const handleUserStateChange = async (firebaseUser: any) => {
      if (firebaseUser) {
        const mappedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
    };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, handleUserStateChange);
      return () => unsubscribe();
    }, [auth]);
  
    useEffect(() => {
      if (user) {
        router.push('/');
      }
    }, [user, router]);
  
    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, resEmail, resPassword);
        console.log(userCredential);
      } catch (error: any) {
        console.log(error.message);
      }
    };
  
    const registerAndUpdateDisplayName = async () => {
      try {
        await register();
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateProfile(currentUser, { displayName: newDisplayName });
        }
        setNewDisplayName('');
      } catch (error) {
        console.error('Error registering user:', error);
      }
    };
  
    const login = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, logEmail, logPassword);
        console.log(userCredential);
      } catch (error: any) {
        console.log(error.message);
      }
    };
  
    const logout = async () => {
      try {
        await signOut(auth);
        setUser(null);
      } catch (error: any) {
        console.log(error.message);
      }
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Register</h2>
              <input
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
                type="text"
                value={newDisplayName}
                placeholder="Name"
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
              <input
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
                type="text"
                placeholder="Email"
                value={resEmail}
                onChange={(e) => setResEmail(e.target.value)}
              />
              <input
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
                type="password"
                placeholder="Password"
                value={resPassword}
                onChange={(e) => setResPassword(e.target.value)}
              />
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
                onClick={registerAndUpdateDisplayName}
              >
                Register
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Login</h2>
              <input
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
                type="text"
                placeholder="Email"
                value={logEmail}
                onChange={(e) => setLogEmail(e.target.value)}
              />
              <input
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
                type="password"
                placeholder="Password"
                value={logPassword}
                onChange={(e) => setLogPassword(e.target.value)}
              />
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
                onClick={login}
              >
                Login
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <div className="mt-6 flex justify-between">
            <Link href="/" className="text-blue-500 hover:underline">
              Main Page
            </Link>
            <Link href="/Settings" className="text-blue-500 hover:underline">
              Settings Page
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  export default LoginPage;




