import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const ai = new GoogleGenerativeAI("AIzaSyAtVlEWYnSDKLdilvO9w80WojYidsen1aM"); // 🔑 तुझा API key

  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`
        You are an experienced programmer with expertise in web development and UI/UX design. 
        Create a modern, responsive component.

        Component: ${prompt}  
        Framework: ${frameWork.value}  

        Requirements:
        - Code must be clean and well-structured.
        - Only return the code in one full HTML file.
        - Use proper animations, responsive design, hover effects, etc.
      `);

      const responseText = await result.response.text();
      setCode(extractCode(responseText));
      setOutputScreen(true);

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const cardStyle = `w-full rounded-xl p-5 text-black dark:text-white shadow-md
    bg-gradient-to-br from-white to-gray-100 dark:from-[#141319] dark:to-[#1A1A1F] 
    transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`;

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16 min-h-screen
        bg-gray-100 dark:bg-[#0B0B0F] transition-colors duration-300">

        {/* Left Section */}
        <div className={`${cardStyle} mt-5 flex flex-col h-full`}>
          <h3 className='text-[25px] font-semibold sp-text transition-colors duration-300'>AI Component Generator</h3>
          <p className='text-gray-600 dark:text-gray-400 mt-2 text-[16px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            styles={{
              control: (base) => ({ ...base, backgroundColor: "transparent", borderColor: "#333", color: "#fff", boxShadow: "none", "&:hover": { borderColor: "#555" } }),
              menu: (base) => ({ ...base, backgroundColor: "#1E1E1E", color: "#fff" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "#333" : state.isFocused ? "#222" : "#1E1E1E",
                color: "#fff",
                "&:active": { backgroundColor: "#444" }
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              input: (base) => ({ ...base, color: "#fff" })
            }}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[200px] rounded-xl mt-3 p-3 placeholder-gray-500 dark:placeholder-gray-400 outline-none
              bg-gray-200 dark:bg-[#09090B] text-black dark:text-white focus:ring-2 focus:ring-purple-500 resize-none
              transition-all duration-300 hover:scale-[1.01]'
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className='text-gray-600 dark:text-gray-400 text-sm'>Click on generate button to get your code</p>
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 
                transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 text-white shadow-md hover:shadow-lg">
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className={`${cardStyle} flex flex-col h-full relative overflow-hidden`}>
          {!outputScreen ? (
            <div className="w-full h-full flex items-center flex-col justify-center">
              <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full
                bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:scale-110 transition-all duration-300">
                <HiOutlineCode />
              </div>
              <p className='text-[16px] text-gray-600 dark:text-gray-400 mt-3'>Your component & code will appear here.</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="bg-gray-200 dark:bg-[#17171C] w-full h-[50px] flex items-center gap-3 px-3 transition-colors duration-300">
                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-purple-600 text-white" : "bg-gray-300 dark:bg-zinc-800 text-black dark:text-gray-300"}`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-purple-600 text-white" : "bg-gray-300 dark:bg-zinc-800 text-black dark:text-gray-300"}`}
                >
                  Preview
                </button>
              </div>

              {/* Toolbar */}
              <div className="bg-gray-200 dark:bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4 transition-colors duration-300">
                <p className='font-bold text-gray-700 dark:text-gray-200'>Code Editor</p>
                <div className="flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button onClick={copyCode} className="w-10 h-10 rounded-xl border border-gray-300 dark:border-zinc-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#333] hover:scale-105 transition-all duration-300"><IoCopy /></button>
                      <button onClick={downloadFile} className="w-10 h-10 rounded-xl border border-gray-300 dark:border-zinc-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#333] hover:scale-105 transition-all duration-300"><PiExportBold /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsNewTabOpen(true)} className="w-10 h-10 rounded-xl border border-gray-300 dark:border-zinc-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#333] hover:scale-105 transition-all duration-300"><ImNewTab /></button>
                      <button onClick={() => setRefreshKey(prev => prev + 1)} className="w-10 h-10 rounded-xl border border-gray-300 dark:border-zinc-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#333] hover:scale-105 transition-all duration-300"><FiRefreshCcw /></button>
                    </>
                  )}
                </div>
              </div>

              {/* Editor / Preview */}
              <div className="h-full">
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme='vs-dark' language="html" />
                ) : (
                  <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black dark:bg-[#09090B] dark:text-white transition-colors duration-300"></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Overlay */}
      {isNewTabOpen && (
        <div className="absolute inset-0 w-screen h-screen overflow-auto text-black dark:text-white bg-white dark:bg-[#09090B] transition-colors duration-300">
          <div className="w-full h-[60px] flex items-center justify-between px-5 bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-gray-400 dark:border-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)] bg-white dark:bg-[#09090B] transition-colors duration-300"></iframe>
        </div>
      )}
    </>
  )
}

export default Home;
