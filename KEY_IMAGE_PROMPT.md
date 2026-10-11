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
- **홈 카드 그림**: 키 이미지가 있으면 방문 여부와 상관없이 항상 걸려 있는 열쇠로 보인다. 방문(여행 완료) 표시는 갤러리에서만 쓴다.
- **게임 카드**: `/game`의 시나리오 카드에 바로 뜬다. 파일이 없으면 시나리오에 적어둔 이모지로 폴백된다.

## WebP 자동 생성

사이트가 실제로 읽는 파일은 `<trip-id>.webp`다. 원본 `<trip-id>.png`만 넣어 두면 `npm run dev` / `npm run build` 직전에
`scripts/optimize_keys.mjs`가 가로 520px 이하 WebP(알파 유지)를 만들어 준다. 생성된 `.webp`도 함께 커밋한다.

```bash
node scripts/optimize_keys.mjs
```

## 전통 테마용 열쇠 프롬프트 (theme/hanok)

전통 테마에서는 카드가 **연지 끈과 선으로 그린 매듭**을 그려 주므로, 열쇠 자체는 조선 자물쇠 열쇠(놋쇠·백동)처럼 만든다.
끈·매듭·술은 카드가 그리니 **이미지에는 넣지 않는다**(겹쳐 보인다). 머리 위쪽 끝이 이미지 맨 위에 닿게 둔다.

```text
A high-resolution, photorealistic 3D render of an ornate traditional Korean Joseon-dynasty key, positioned perfectly vertical with the decorative head at the top and the bit at the bottom. Flat lay on a pure white background, vertical portrait aspect ratio.

The key is made of aged brass (nutsoe) with soft gold highlights and subtle dark patina, inlaid with thin white-bronze (baekdong) lines. The shaft is long, straight and slender, ending in a simple flat Korean padlock-style bit.

The head is a flat, pierced openwork medallion framed by a cloud-scroll (unmun) border, deeply engraved with an intricate theme: [원하는 주제 입력]. Small lotus and cloud motifs fill the gaps, in the style of Joseon metal ornaments (jangseok).

No cord, no tassel, no knot. Clean, directional lighting highlights every engraved detail.
```

지면은 한지·먹 바탕에 연지 하나만 포인트로 쓰므로, 색을 더하고 싶다면 `with a single small red cloisonné accent` 정도만 덧붙인다.
