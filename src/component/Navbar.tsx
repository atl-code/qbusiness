
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPlay } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';


function Navbar() {
  const [username, setUsername] = useState('');
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = await getCurrentUser();
        setUsername(user.username);
      } catch (error) {
        console.log('error fetching user', error);
      }
    };

    fetchUsername();
  }, []);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  return (
    <div className='px-4 mx-auto   shadow-sm p-1 flex items-center justify-between'>
        <div className='flex items-center gap-2 font-bold'>
        <div className='bg-gray-800 w-[2.5rem] h-[2.5rem] rounded-full flex items-center justify-center '>
        <GiHamburgerMenu className='text-white ' />
        </div>
        <h2 >{username}</h2>
        </div>
        <div className='flex items-center gap-2 hover:-translate-y-1 duration-300 transition-all' onClick = {handleSignOut} style={{ cursor: 'pointer' }} >
        <FaPlay />

            <h1 className='font-bold'>Sign Out</h1>
        </div>

    </div>
  )
}

export default Navbar