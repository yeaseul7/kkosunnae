import { HiLightBulb } from "react-icons/hi2";
import { HiArrowRight } from "react-icons/hi2";

export default function WriteNotice() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <HiLightBulb className="w-5 h-5 text-primary1" />
                <h3 className="text-lg font-bold text-gray-900">작성 가이드라인</h3>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-start">
                    <span className="text-primary1 font-bold text-sm shrink-0">01.</span>
                    <p className="text-sm text-gray-700">
                        입양 후기를 작성하실 때는 아이의 예쁜 사진을 3장 이상 포함해 주세요.
                    </p>
                </div>
                <div className="flex gap-2 items-start">
                    <span className="text-primary1 font-bold text-sm shrink-0">02.</span>
                    <p className="text-sm text-gray-700">
                        반려견의 나이, 품종, 특징 등을 함께 적어주시면 다른 분들에게 큰 도움이 됩니다.
                    </p>
                </div>
                <div className="flex gap-2 items-start">
                    <span className="text-primary1 font-bold text-sm shrink-0">03.</span>
                    <p className="text-sm text-gray-700">
                        따뜻한 공동체를 위해 비속어나 비방 섞인 글은 지양해 주세요.
                    </p>
                </div>
                <div className="flex gap-2 items-start">
                    <span className="text-primary1 font-bold text-sm shrink-0">04.</span>
                    <p className="text-sm text-gray-700">
                        임시저장 기능은 로그인 상태에서만 지원됩니다.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 mt-2">
                <p className="text-sm text-gray-500 mb-1">도움이 필요하신가요?</p>
                <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-gray-900">커뮤니티 이용 규칙 보기</span>
                    <HiArrowRight className="w-4 h-4 text-gray-900" />
                </div>
            </div>
        </div>
    );
}