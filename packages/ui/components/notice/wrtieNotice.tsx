import { HiLightBulb } from "react-icons/hi2";

export default function WriteNotice() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <HiLightBulb className="w-5 h-5 text-primary1" />
                <h3 className="text-lg font-bold text-gray-900">공지사항 작성 가이드</h3>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                    <span className="text-primary1 font-bold text-lg shrink-0 leading-none mt-0.5">01.</span>
                    <div className="text-sm text-gray-700">
                        <strong className="block text-gray-900 mb-1">말머리로 주제를 명확히 해주세요.</strong>
                        <p className="leading-relaxed">
                            [업데이트], [이벤트], [점검] 등 말머리를 달면<br />
                            가족분들이 소식을 더 쉽고 빠르게 알아볼 수 있어요.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 items-start">
                    <span className="text-primary1 font-bold text-lg shrink-0 leading-none mt-0.5">02.</span>
                    <div className="text-sm text-gray-700">
                        <strong className="block text-gray-900 mb-1">딱딱한 공지보다는 친절한 언어로 써주세요.</strong>
                        <p className="leading-relaxed">
                            친절한 언어로 써주면 가족분들이 소식을 더 쉽고 빠르게 알아볼 수 있어요.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 items-start">
                    <span className="text-primary1 font-bold text-lg shrink-0 leading-none mt-0.5">03.</span>
                    <div className="text-sm text-gray-700">
                        <strong className="block text-gray-900 mb-1">핵심 정보는 눈에 띄게 정리해주세요.</strong>
                        <p className="leading-relaxed">
                            일시, 장소, 변경된 기능 등 중요한 내용은<br />
                            줄글 속에 숨기지 말고 목록이나 굵은 글씨로 강조해 주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}