import React from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
     const { setAuthUser } = useAuthContext();
     const navigate = useNavigate();

     const handleLogout = () => {
          localStorage.removeItem("chat-user"); // ✅ updated
          setAuthUser(null);
          navigate("/login");
     };


     return (
          <div className='flex flex-col gap-4 items-center sm:h-[550px]'>
               {/* Logout Button */}
               <div className='w-full flex justify-end px-4'>
                    <button
                         onClick={handleLogout}
                         className='px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-300 shadow-md'
                    >
                         Logout
                    </button>
               </div>

               {/* Main Chat UI */}
               <div className='flex flex-1 w-full rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                    <Sidebar />
                    <MessageContainer />
               </div>
          </div>
     );
};

export default Home;
