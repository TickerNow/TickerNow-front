import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const LoginModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((s) => s.login);
  const hideLoginModal = useAuthStore((s) => s.hideLoginModal);
  const showSignUpModal = useAuthStore((s) => s.showSignUpModal);

  // ESC 키 누르면 닫히도록
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideLoginModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hideLoginModal]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={hideLoginModal}
    >
      <div
        className="bg-[#181A20] p-6 rounded-md shadow-xl w-80 h-[26rem] text-white flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-2xl text-[#f0f0f0] font-semibold text-center mb-4">
            Sign in
          </h2>
          <div className="border-b border-gray-600 mb-6 w-full" />

          <input
            className="bg-[#181A20] text-white placeholder-white/60 px-4 py-2 w-full mb-4 rounded-sm outline-none border border-gray-600"
            type="text"
            placeholder="ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="bg-[#181A20] text-white placeholder-white/60 px-4 py-2 w-full mb-6 rounded-sm outline-none border border-gray-600"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => login(username, password)}
            className="bg-[#FCD535] text-black font-bold py-2 rounded-sm hover:brightness-110 transition"
          >
            Login
          </button>

          <button
            onClick={() => {
              hideLoginModal();
              showSignUpModal();
            }}
            className="text-gray-400 text-sm underline w-full text-center hover:text-white"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;