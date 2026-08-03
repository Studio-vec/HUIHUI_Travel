# 열쇠 이미지 제작 가이드

홈 화면 키 카드(`/`)와 짐 싸기 게임 시나리오 카드(`/game`)에 쓰는 여행지별 열쇠 이미지를 만드는 방법.

## 생성 프롬프트

`[원하는 주제 입력]` 자리에 여행지 테마를 넣어서 이미지 생성 모델에 그대로 넣는다.

```text
A high-resolution, photorealistic, 3D render of an incredibly detailed, vintage skeleton key, positioned in a perfectly vertical orientation with the bow at the top and the bit at the bottom. The presentation is a flawless flat lay against a pure white background, captured in a vertical portrait aspect ratio.

The key is made of highly detailed, polished antique silver. It has a very long, straight, polished shaft ending in a precise E-shaped (comb-style) mechanical bit. The ornate base where the shaft meets the bow is exactly preserved.

The filigreed, circular bow (handle) is deeply sculpted with an intricate new theme: [원하는 주제 입력].

Clean, directional lighting highlights every minute detail of the new theme and the preserved structure.
```

주제는 그 여행의 1일차 핵심 장면 한두 개를 고르면 카드와 일정의 톤이 맞는다.

| 여행지 | 넣은 주제 |
| --- | --- |
| 철원·포천 | 삼부연폭포 물줄기와 막국수 한 그릇 |
| 송도 | 트라이보울 건축물과 스탠드업 코미디 무대 |

## 저장 규격

- 경로: `public/assets/keys/<trip-id>.png` — `trip-id`는 `trips/data/<trip-id>.json`의 `id`와 같아야 한다.
- 형식: PNG, 알파 채널 유지(배경 투명).
- 크기: 가로 600px 안팎 (세로 비율은 원본 유지).
- 용량: **1MB 이하**.

생성 모델이 뱉는 원본은 보통 2~3MB / 가로 850px 이상이라 그대로 넣으면 안 되고, 아래 스크립트로 한 번 정리한다.

```bash
node scripts/shrink_key_images.mjs
```

`public/assets/keys/` 안에서 1MB를 넘는 파일만 골라 가로 600px로 리사이즈·재압축한다. 이미 1MB 이하인 파일은 건드리지 않는다.

## 연결되는 동작

- **홈 화면**: 키 이미지가 있으면 카드가 열리고(클릭 시 `/trips/<trip-id>`로 이동), **없으면 자동으로 "준비중"** 처리된다. 별도 설정 없이 파일 존재 여부로만 판단한다.
- **홈 카드 그림**: 잠긴 상태에서는 번호가 박힌 카드 SVG가 보이고, 여행 완료(`visited`) 처리한 뒤에 실제 열쇠 그림이 노출된다.
- **게임 카드**: `/game`의 시나리오 카드에 바로 뜬다. 파일이 없으면 시나리오에 적어둔 이모지로 폴백된다.
