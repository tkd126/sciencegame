# 3편 배경

2026-10-01: 사용자 요청으로 사실적인 v1 질감을 줄이고 어두운 2D 카툰 v2로 재생성. 내장 image_gen 사용. 기존 v1은 보존한다.

게임 연결 파일:
- science-room-cartoon-v2.png
- science-room-open-cartoon-v2.png
- science-bench-cartoon-v2.png
- infirmary-cartoon-v2.png
- small-studio-cartoon-v2.png

공통 프롬프트: 기존 v1을 편집 대상으로, 1편 science-room-night-v3.png를 화풍/어두운 분위기 참고로 사용. 뚜렷한 잉크 윤곽선, 단순한 셀 명암, 큰 청남색 그림자, 사실적인 나뭇결·금속 질감·3D 표현 제거. 어두운 겨울 낮 학교, 소품은 식별 가능하게 유지. 카메라와 소품 위치·크기를 보존하여 클릭 영역 유지. 인물·실루엣·글자·워터마크 금지, 16:9.

열린 문 프롬프트: 새 과학실 v2에서 왼쪽 문만 열고 빈 어두운 복도가 보이게 편집. 나머지 배치·색·윤곽선 모두 보존.

원본 생성 ID (Codex generated_images):
- 과학실: exec-47161c0a-fe65-4d11-912d-a38e152f2043
- 실험대: exec-e7b99850-ef0d-49c4-94c0-6f46dcdc6396
- 보건실: exec-22824407-e388-4ca0-84a4-31dfedb7839e
- 방송실: exec-94f0b4ed-d17a-4a32-92b9-f9085f1c5bcc
- 열린 문: exec-a567c8b4-0d71-4064-83d3-5f796606a04e
