/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { X, Maximize2, Minimize2, Image as ImageIcon, XCircle } from "lucide-react";
import ChatbotResponse from "../../assets/ChatbotResponse.svg";
import ChatbotIcon from "../../assets/cute robot.svg";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store";
import SendIcon from "../../assets/SendButton.svg";
import { sendChatbotMessage, getUserData } from "../../services/Api_Services";

const Chatbot = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [typingDots, setTypingDots] = useState("");
  const [expandedImage, setExpandedImage] = useState(null);

  const email = localStorage.getItem("email");
  const sessionId = useRef(Date.now().toString());
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const username = useSelector((state) => state.auth.username);

  useEffect(() => {
    if (email) {
      const storedMessages = localStorage.getItem(`chatMessages_${email}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }
  }, [open, email]);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await getUserData(token);
      dispatch(authActions.addUsername(response.data.body.username));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setTypingDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    fetchUser();
  }, [email]);

  useEffect(() => {
    if (email && messages.length > 0) {
      localStorage.setItem(`chatMessages_${email}`, JSON.stringify(messages));
    }
  }, [messages, email]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages([file]);
      setImagePreviews([URL.createObjectURL(file)]);
    }
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!input.trim() && images.length === 0) return;

    const newMessage = {
      sender: "user",
      text: input,
      images: [...imagePreviews],
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setImages([]);
    setImagePreviews([]);
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Typing...", isTyping: true, timestamp: new Date().toISOString() }
    ]);

    try {
      const formData = new FormData();
      formData.append("message", input);
      formData.append("sessionId", sessionId.current);

      if (images.length > 0) {
        formData.append("image", images[0]);
      }

      const response = await sendChatbotMessage(formData);

      setMessages((prev) =>
        prev
          .slice(0, -1)
          .concat({ 
            sender: "bot", 
            text: response.data.response.text,
            timestamp: new Date().toISOString()
          })
      );
    } catch (error) {
      console.error("Error sending request:", error);
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          sender: "bot",
          text: "Error: Could not connect to chatbot.",
          timestamp: new Date().toISOString()
        })
      );
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const getInitials = (username) => {
    if (!username) return "U";
    const nameParts = username.trim().split(/\s+/);
    if (nameParts.length === 0 || (nameParts.length === 1 && nameParts[0] === "")) {
      return "U";
    }
    const initials = nameParts
      .filter((part) => part.length > 0)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials || "U";
  };

  const openImage = (imageSrc) => {
    setExpandedImage(imageSrc);
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  return (
    <>
      {/* Expanded Image Modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-[10001] bg-black bg-opacity-90 flex items-center justify-center p-4">
          <button 
            onClick={closeExpandedImage}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <X size={24} />
          </button>
          <img 
            src={expandedImage} 
            alt="Expanded preview" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Animated robot appears only when chat is closed */}
      {!open && (
        <div className="fixed bottom-0 right-0 z-0">
          <img
            src={ChatbotIcon}
            alt="Animated Robot"
            className="w-16 h-16 animate-bounce cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      )}

      {/* Chat window and static robot appear only when open */}
      {open && (
        <div className="fixed bottom-3 right-4 z-[10000] flex flex-col items-end">
          {/* Chat window container */}
          <div
            className={`${isFullscreen ? "fixed inset-0" : "w-full md:w-[490px] h-[550px]"
              } bg-chatbot-bg-color shadow-lg flex flex-col border border-gray-300 transition-all duration-300 ${isFullscreen ? "rounded-none" : "rounded-xl"
              }`}
          >
            {/* Header */}
            <div className="bg-chatbot-bg-color text-black p-3 flex justify-between items-center rounded-t-xl">
              <span className="text-lg font-bold">AI-Sight</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-700 p-1 hover:bg-[#d8b4fe] rounded-lg"
                >
                  {isFullscreen ? (
                    <Minimize2 size={20} />
                  ) : (
                    <Maximize2 size={20} />
                  )}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-700 p-[3px] border rounded-3xl bg-purple-950 hover:bg-[#d8b4fe]"
                >
                  <X size={20} color="white" />
                </button>
              </div>
            </div>
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-44">
                  What can I help with?
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={`${msg.timestamp || index}-${msg.sender}`}
                    className={`flex ${msg.sender === "user"
                      ? "justify-end items-end"
                      : "justify-start items-start"
                      }`}
                  >
                    {/* Bot avatar aligned at the top */}
                    {msg.sender === "bot" && (
                      <div className="w-10 h-10 rounded-full mr-2 flex-shrink-0 flex items-start justify-center bg-transparent shadow-l">
                        <img
                          src={ChatbotResponse}
                          alt="Bot"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                    )}
                    <div
                      className={`flex flex-col ${msg.sender === "user"
                          ? "items-end"
                          : "items-start"
                        } max-w-[75%]`}
                    >
                      {/* Images above the message */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="mb-1 grid gap-2">
                          {msg.images.map((imgSrc, imgIndex) => (
                            <div 
                              key={imgIndex} 
                              className="relative cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => openImage(imgSrc)}
                            >
                              <img
                                src={imgSrc}
                                alt={`Uploaded ${imgIndex + 1}`}
                                className="rounded-lg max-w-[280px] max-h-[280px] object-contain border border-gray-200"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Message text */}
                      <div
                        className={`text-sm rounded-lg ${msg.sender === "user"
                            ? "bg-purple-200 text-purple-950 shadow-lg"
                            : "bg-transparent text-purple-950 shadow-xl"
                          } break-words px-4 py-2`}
                      >
                        {msg.isTyping ? (
                          <span>Typing{typingDots}</span>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-full ml-2 flex-shrink-0 flex items-center justify-center bg-purple-900 text-white font-bold">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt="User"
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          <span>{getInitials(username)}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input area */}
            <div className="p-3 flex flex-col">
              {/* Image preview area */}
              {imagePreviews.length > 0 && (
                <div className="mb-2 p-2 border rounded-lg bg-gray-100 flex flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                        onClick={() => openImage(preview)}
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5"
                      >
                        <XCircle size={16} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 border border-gray-400 rounded-lg bg-transparent overflow-hidden">
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex items-center justify-center pl-2"
                >
                  <ImageIcon size={24} className="text-purple-900" />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="imageUpload"
                  onChange={handleImageUpload}
                />
                <input
                  type="text"
                  className="flex-1 p-3 text-sm focus:outline-none bg-transparent placeholder-gray-500"
                  placeholder="Message AI-Sight..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="p-3 text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  <img src={SendIcon} alt="send-button" className="size-5" />
                </button>
              </div>
            </div>
          </div>
          {/* Static robot image at the bottom of the open chat */}
          <div className="bg-purple-100 rounded-full shadow-md">
            <img src={ChatbotIcon} alt="Cute Robot" className="size-16" />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;