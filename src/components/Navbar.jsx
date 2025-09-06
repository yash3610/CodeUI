import React, { useState, useEffect } from 'react'
import { FaUser } from 'react-icons/fa'
import { HiSun } from 'react-icons/hi'
import { BsMoonStarsFill } from 'react-icons/bs'
import { RiSettings3Fill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true); // Default dark mode
  const navigate = useNavigate();

  // Page load var dark class add/remove
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`nav flex items-center justify-between px-[100px] h-[90px] border-b transition-colors duration-300
      ${darkMode 
        ? 'bg-gray-900 text-white border-gray-800' 
        : 'bg-white text-black border-gray-300'}`}>
      
      {/* Logo */}
      <div className="logo">
        <h3 className={`text-[25px] font-[700] ${darkMode ? 'text-white' : 'text-black'}`}>CodeUI</h3>
      </div>

      {/* Icons */}
      <div className="icons flex items-center gap-[15px] text-[22px]">
        {/* Theme Toggle */}
        <button 
          className={`${darkMode ? 'text-white' : 'text-black'} hover:text-yellow-500 transition`}
          onClick={handleThemeToggle}
        >
          {darkMode ? <BsMoonStarsFill /> : <HiSun />}
        </button>

        {/* Login */}
        <button 
          className={`${darkMode ? 'text-white' : 'text-black'} hover:text-green-500 transition`}
          onClick={() => navigate("/login")}
        >
          <FaUser />
        </button>

        {/* Settings */}
        <button 
          className={`${darkMode ? 'text-white' : 'text-black'} hover:text-red-500 transition`}
          onClick={() => navigate("/settings")}
        >
          <RiSettings3Fill />
        </button>
      </div>
    </div>
  )
}

export default Navbar
