/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { X, Maximize2, Minimize2, Image as ImageIcon } from "lucide-react";
import ChatbotIcon from "../../assets/ChatbotResponse.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store";
import SendIcon from "../../assets/SendButton.svg";

const Chatbot = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([]);
  const email = localStorage.getItem("email");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const sessionId = useRef(Date.now().toString());
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const username = useSelector((state) => state.auth.username);

  useEffect(() => {
    console.log("Retrieved email from localStorage:", email);
  
    if (email) {
      const storedMessages = localStorage.getItem(`chatMessages_${email}`);
      console.log("Retrieved messages:", storedMessages);
  
      setMessages(storedMessages ? JSON.parse(storedMessages) : []);
    }
  }, [open]); // Ensure messages load when chatbot opens

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever they change, for the specific user
  useEffect(() => {
    if (email && messages.length > 0) {
      localStorage.setItem(`chatMessages_${email}`, JSON.stringify(messages));
    }
  }, [messages, email]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return; // Prevent sending empty messages or without an image
  
    // Prepare message data
    let newMessage;
    if (selectedImage) {
      newMessage = { 
        sender: "user", 
        text: input.trim() ? input : "Image sent",
        image: imagePreview
      };
    } else {
      newMessage = { sender: "user", text: input };
    }
  
    setMessages((prev) => [...prev, newMessage, { sender: "bot", text: "Generating response..." }]);
    setInput("");
    setLoading(true);
  
    try {
      // Create FormData for file upload
      const formData = new FormData();
  
      // Ensure that 'message' is never empty
      const messageToSend = input.trim() || "No message";  // Default message if input is empty
      formData.append('message', messageToSend);
      formData.append('sessionId', sessionId.current);
  
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
  
      // Log the payload to check what is being sent
      console.log('Request Payload:', {
        message: messageToSend,
        sessionId: sessionId.current,
        image: selectedImage ? selectedImage.name : 'No image',
      });
  
      // Send the request
      const response = await fetch("http://localhost:3000/api/v1/chatbot/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Chatbot Response:", data.reply);
  
      // Handle response with possible image
      const botResponse = {
        sender: "bot",
        text: data.response.text,
      };
  
      if (data.response.imageUrl) {
        botResponse.image = data.response.imageUrl;
      }
  
      setMessages((prev) => prev.slice(0, -1).concat(botResponse));
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1).concat({ 
        sender: "bot", 
        text: "Error: Could not connect to chatbot." 
      }));
    } finally {
      setLoading(false);
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    <div className="fixed bottom-0 right-0 z-[9999]">
      {open && (
        <div
          className={`
            ${isFullscreen ? "fixed inset-0" : "w-full md:w-96 h-[450px] md:h-[450px] bottom-0 right-0"}
            bg-[#f3e8ff] shadow-lg flex flex-col border border-gray-300
            transition-all duration-300 ${isFullscreen ? "rounded-none" : "rounded-xl"}
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
                  className={`flex items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <img src={ChatbotIcon} alt="Bot" className="w-8 h-8 rounded-full mr-2 mt-2" />
                  )}
                  <div
                    className={`
                      px-4 py-2 text-sm rounded-lg 
                      ${msg.sender === "user" ? "bg-[#d8b4fe] text-black" : "bg-white text-black"} 
                      max-w-[75%] break-words
                    `}
                  >
                    {msg.text}
                    {msg.image && (
                      <div className="mt-2">
                        <img 
                          src={msg.image} 
                          alt="Shared image" 
                          className="rounded-lg max-w-full max-h-40 object-contain"
                          onClick={() => window.open(msg.image, '_blank')}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    )}
                  </div>
                  {msg.sender === "user" && (
                    profilePicture ? (
                      <img src={profilePicture} alt="User" className="ml-2 w-8 h-8 rounded-full object-cover mt-2" />
                    ) : (
                      <div className="ml-2 w-8 h-8 flex items-center justify-center bg-[#d8b4fe] text-white rounded-full text-sm font-bold mt-2">
                        {getInitials(username)}
                      </div>
                    )
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="px-3 pb-1">
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Selected image" 
                  className="h-16 rounded-lg object-contain" 
                />
                <button 
                  onClick={removeSelectedImage}
                  className="absolute -top-2 -right-2 bg-purple-900 text-white rounded-full p-[1px] hover:bg-purple-700"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="p-3 flex flex-col">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 p-2 text-sm border border-gray-400 border-r-0 focus:outline-none bg-transparent placeholder-gray-500 rounded-l-lg"
                placeholder="Message AI-Sight..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <div className="flex border border-gray-400 rounded-r-lg overflow-hidden">
                <label htmlFor="image-upload" className="p-2 cursor-pointer text-purple-900 hover:bg-purple-100">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                  />
                  <ImageIcon size={20} />
                </label>
                <button
                  className="p-2 text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  <img src={SendIcon} alt="send-button" className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;