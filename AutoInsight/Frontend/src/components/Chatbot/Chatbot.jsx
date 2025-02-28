/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { X, Maximize2, Minimize2, Image as ImageIcon } from "lucide-react";
import ChatbotResponse from "../..//assets/ChatbotResponse.svg";
import ChatbotIcon from "../../assets/cute robot.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store";
import SendIcon from "../../assets/SendButton.svg";

const Chatbot = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const email = localStorage.getItem("email");
  const sessionId = useRef(Date.now().toString());
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const username = useSelector((state) => state.auth.username);

  useEffect(() => {
    if (email) {
      const storedMessages = localStorage.getItem(`chatMessages_${email}`);
      setMessages(storedMessages ? JSON.parse(storedMessages) : []);
      console.log("username: " + username);
    }
  }, [open]);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/users/user-data",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(authActions.addUsername(response.data.body.username));
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

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
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !image) return;
    const imageCopy = imagePreview;

    const newMessage = {
      sender: "user",
      text: input,
      image: imageCopy,
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
      { sender: "bot", text: "Generating response..." },
    ]);
    setInput("");
    setImage(null);
    setImagePreview(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", input);
      formData.append("sessionId", sessionId.current);
      if (image instanceof File) {
        formData.append("image", image);
      }
      console.log("Sending request with:", {
        message: input,
        image: image instanceof File ? image.name : "No Image",
      });
      const response = await axios.post(
        "http://localhost:3000/api/v1/chatbot/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessages((prev) =>
        prev
          .slice(0, -1)
          .concat({ sender: "bot", text: response.data.response.text })
      );
    } catch (error) {
      console.error("Error sending request:", error);
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          sender: "bot",
          text: "Error: Could not connect to chatbot.",
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
    if (
      nameParts.length === 0 ||
      (nameParts.length === 1 && nameParts[0] === "")
    ) {
      return "U";
    }
    const initials = nameParts
      .filter((part) => part.length > 0)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials || "U";
  };

  return (
    <>
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
        <div className="fixed bottom-0 right-0 z-[10000] flex flex-col items-end">
          {/* Chat window container */}
          <div
            className={`${
              isFullscreen ? "fixed inset-0" : "w-full md:w-[490px] h-[550px]"
            } bg-chatbot-bg-color shadow-lg flex flex-col border border-gray-300 transition-all duration-300 ${
              isFullscreen ? "rounded-none" : "rounded-xl"
            }`} // Removed mb-4 margin
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
                    key={index}
                    className={`flex ${
                      msg.sender === "user"
                        ? "justify-end items-center"
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
                      className={`px-4 py-2 text-sm rounded-lg ${
                        msg.sender === "user"
                          ? "bg-purple-200 text-purple-950 shadow-lg"
                          : "bg-transparent text-purple-950 shadow-xl"
                      } max-w-[75%] break-words`}
                    >
                      {msg.text}
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Uploaded"
                          className="mt-2 rounded-lg w-40 h-auto"
                        />
                      )}
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
              {imagePreview && (
                <div className="relative mb-2 p-2 border rounded-lg bg-gray-100 flex items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg mr-2"
                  />
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
