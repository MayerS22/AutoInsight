/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { SendHorizontal, X, Maximize2, Minimize2 } from "lucide-react";
import ChatbotIcon from "../../assets/ChatbotResponse.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store";
import SendIcon from "../../assets/SendButton.svg";

const Chatbot = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sessionId = useRef(Date.now().toString());
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const username = useSelector((state) => state.auth.username);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:3000/api/v1/users/user-data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(authActions.addProfilePicture(response.data.body.profile_picture));
      dispatch(authActions.addUsername(response.data.body.username));
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage, { sender: "bot", text: "Generating response..." }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId: sessionId.current }),
      });

      const data = await response.json();
      setMessages((prev) => prev.slice(0, -1).concat({ sender: "bot", text: data.reply }));
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1).concat({ sender: "bot", text: "Error: Could not connect to chatbot." }));
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getInitials = (name) => {
    return name
      ? name
        .split(" ")
        .map((part) => part[0]?.toUpperCase())
        .join("")
      : "U";
  };

  return (
    <div className={`fixed md:bottom-5 pt-24 md:right-5 ${isFullscreen ? 'inset-0' : 'bottom-0 right-0'} transition-all duration-300`}>
      {open && (
        <div
          className={`
            ${isFullscreen
              ? 'w-full h-full rounded-none'
              : 'w-full md:w-96 h-[450px] md:h-[450px] rounded-xl'
            }
            bg-[#f3e8ff] shadow-lg flex flex-col border border-gray-300
            transition-all duration-300
          `}
        >
          {/* Header */}
          <div className="bg-purple-200 text-black p-3 flex justify-between items-center rounded-t-xl">
            <span className="text-lg font-bold">AI-Sight</span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="text-gray-700 p-1 hover:bg-[#d8b4fe] rounded-lg"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-700 p-[3px] border rounded-3xl bg-purple-950 hover:bg-[#d8b4fe]"
              >
                <X size={20} color="white" />
              </button>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">What can I help with?</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <img src={ChatbotIcon} alt="Bot" className="w-8 h-8 rounded-full mr-2" />
                  )}
                  <div
                    className={`
                      px-4 py-2 text-sm rounded-lg 
                      ${msg.sender === "user" ? "bg-[#d8b4fe] text-black" : "bg-white text-black"} 
                      max-w-[75%] break-words
                    `}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    profilePicture ? (
                      <img src={profilePicture} alt="User" className="ml-2 w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="ml-2 w-8 h-8 flex items-center justify-center bg-[#d8b4fe] text-white rounded-full text-sm font-bold">
                        {getInitials(username)}
                      </div>
                    )
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-3 flex items-center">
            <input
              type="text"
              className="flex-1 p-2 text-sm border border-gray-400 border-r-0 focus:outline-none bg-transparent placeholder-gray-500 rounded-l-lg"
              placeholder="Message AI-Sight..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="p-2 text-purple-900  disabled:opacity-50 disabled:cursor-not-allowed border border-gray-400 border-l-0 rounded-r-lg"
              onClick={sendMessage}
              disabled={loading}
            >
                  <img src={SendIcon} alt="send-button"  className="size-5"/>            
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Chatbot;
