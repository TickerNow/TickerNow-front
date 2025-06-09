import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const SignUpModal = () => {
    const [form, setForm] = useState({
        name: "",
        sex: "남자",
        birth_date: "",
        id: "",
        nickname: "",
        password: "",
        confirm: "",
    });

    const [idChecked, setIdChecked] = useState<boolean>(false);
    const [nicknameChecked, setNicknameChecked] = useState<boolean>(false);

    const hideSignUpModal = useAuthStore((s) => s.hideSignUpModal);
    const signUp = useAuthStore((s) => s.signUp); // 가상의 signUp 함수
    const checkIdDuplicate = useAuthStore((s) => s.checkIdDuplicate); // 가정
    const checkNicknameDuplicate = useAuthStore((s) => s.checkNicknameDuplicate); // 가정

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "id") setIdChecked(false);
        if (name === "nickname") setNicknameChecked(false);
    };

    const handleSubmit = () => {
        if (form.password !== form.confirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
        }

        // 모든 필드가 입력되었는지 확인
        const isEmpty = Object.entries(form).some(([key, value]) => {
            if (typeof value === "string") return value.trim() === "";
            return value === null || value === undefined;
        });

        if (isEmpty) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        if (!idChecked) {
            alert("아이디 중복 확인을 해주세요.");
            return;
        }

        if (!nicknameChecked) {
            alert("닉네임 중복 확인을 해주세요.");
            return;
        }

        const userData = {
        ...form,
        joined_at: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
        };

        signUp(userData);
    };

    const handleCheckId = async () => {
        if (!form.id.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }
        const isAvailable  = await checkIdDuplicate(form.id.trim());
        if (isAvailable) {
            alert("사용 가능한 아이디입니다.");
            setIdChecked(true);
        }
    };

    const handleCheckNickname = async () => {
        if (!form.nickname.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }
        const isAvailable = await checkNicknameDuplicate(form.nickname.trim());
        if (isAvailable) {
            alert("사용 가능한 닉네임입니다.");
            setNicknameChecked(true);
        } 
    };

    return (
        <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
        >
        <div
            className="bg-[#181A20] p-6 rounded-md shadow-xl w-96 max-h-[90vh] text-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className="text-2xl text-[#f0f0f0] font-semibold text-center mb-4">Sign Up</h2>
            <div className="border-b border-gray-600 mb-6 w-full" />

            <div>
                <div className="flex gap-2 mb-4">
                    <input
                        name="id"
                        placeholder="아이디"
                        value={form.id}
                        onChange={handleChange}
                        className="bg-[#181A20] text-white placeholder-white/60 px-4 py-2 flex-1 rounded-sm outline-none border border-gray-600"
                    />
                    <button
                        onClick={handleCheckId}
                        className="bg-[#FCD535] text-black font-bold py-1 px-1 text-sm rounded-sm hover:brightness-110 transition"
                    >
                        중복확인
                    </button>
                </div>
                <div className="flex gap-2 mb-4">
                    <input
                        name="nickname"
                        placeholder="닉네임"
                        value={form.nickname}
                        onChange={handleChange}
                        className="bg-[#181A20] text-white placeholder-white/60 px-4 py-2 flex-1 rounded-sm outline-none border border-gray-600"
                    />
                    <button
                        onClick={handleCheckNickname}
                        className="bg-[#FCD535] text-black font-bold py-1 px-1 text-sm rounded-sm hover:brightness-110 transition"
                    >
                        중복확인
                    </button>
                </div>
                <input
                    name="name"
                    placeholder="이름"
                    value={form.name}
                    onChange={handleChange}
                    className="bg-[#181A20] text-white placeholder-white/60 px-4 py-2 w-full mb-4 rounded-sm outline-none border border-gray-600"
                />
                <div className="flex gap-3 mb-4">
                    <select
                        name="sex"
                        value={form.sex}
                        onChange={handleChange}
                        className="bg-[#181A20] text-white placeholder-white/60 placeholder:text-[12px] px-3 py-2 rounded-sm outline-none border border-gray-600 flex-[1] min-w-0 text-[12px] appearance-none"
                    >
                        <option value="남자">남자</option>
                        <option value="여자">여자</option>
                    </select>
                    <input
                        name="birth_date"
                        type="text"
                        placeholder="생년월일 (yyyy-mm-dd)"
                        value={form.birth_date}
                        onChange={handleChange}
                        onBlur={() => {
                            const regex = /^\d{4}-\d{2}-\d{2}$/;
                            if (!regex.test(form.birth_date)) {
                            alert("생년월일은 yyyy-mm-dd 형식으로 입력해주세요.");
                            }
                        }}
                        className="bg-[#181A20] text-white placeholder-white/60 placeholder:text-[12px] px-4 py-2 rounded-sm outline-none border border-gray-600 flex-[5] min-w-0 text-[12px]"
                    />
                </div>
                <input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    className="bg-[#181A20] text-white placeholder-white/60 px-4 py-2 w-full mb-4 rounded-sm outline-none border border-gray-600"
                />
                <input
                    name="confirm"
                    type="password"
                    placeholder="비밀번호 확인"
                    value={form.confirm}
                    onChange={handleChange}
                    className="bg-[#181A20] text-white placeholder-white/60 px-4 py-2 w-full mb-4 rounded-sm outline-none border border-gray-600"
                />
            </div>

            <div className="mt-6 flex flex-col gap-3">
            <button
                onClick={handleSubmit}
                className="bg-[#FCD535] text-black font-bold py-2 rounded-sm hover:brightness-110 transition"
            >
                회원가입
            </button>
            <button
                onClick={hideSignUpModal}
                className="text-gray-400 text-sm underline w-full text-center hover:text-white"
            >
                취소
            </button>
            </div>
        </div>
        </div>
    );
    };

export default SignUpModal;