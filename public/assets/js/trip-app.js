function createTripApp({ tripUrl, storageKey, schedule: initialSchedule, downloadName, tips: initialTips, tipsKey }) {
    const { createApp, ref, computed, onMounted, watch } = Vue;
    const VISITED_KEY = 'huihui_visited';
    function _getVisitedSet() {
        try { return new Set(JSON.parse(localStorage.getItem(VISITED_KEY) || '[]')); }
        catch(e) { return new Set(); }
    }

    createApp({
        setup() {
            const startDate     = ref(dayjs().format('YYYY-MM-DD'));
            const isArtPlaying  = ref(false);
            const showReport    = ref(false);
            const showTipModal  = ref(false);
            const newTipAuthor  = ref('');
            const newTipText    = ref('');
            const collagePieces = ref([]);
            const isVisited     = ref(_getVisitedSet().has(tripUrl));
            const schedule      = ref(initialSchedule);
            const tips          = ref(initialTips || []);
            const expandedId    = ref(null);
            const toggleExpand  = (id) => {
                expandedId.value = expandedId.value === id ? null : id;
            };

            const _showPhotoAlert = (
                title = '사진을 등록해주세요',
                body  = '최소 한 장 이상의 사진을 등록해야<br>여행 완료로 기록할 수 있어요'
            ) => {
                const existing = document.getElementById('_photo-alert-overlay');
                if (existing) return;
                const overlay = document.createElement('div');
                overlay.id = '_photo-alert-overlay';
                overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(42,31,72,0.45);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px';
                overlay.innerHTML = `
                  <div style="background:#fff;border-radius:20px;padding:32px 28px 24px;max-width:300px;width:100%;text-align:center;box-shadow:0 8px 40px rgba(107,79,180,0.18);animation:_paSlide 0.22s ease">
                    <div style="width:48px;height:48px;background:#EDE5FF;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.4rem">📷</div>
                    <div style="font-family:'DM Serif Display',serif;font-style:italic;font-size:1.2rem;color:#2a1f48;margin-bottom:8px">${title}</div>
                    <p style="font-size:13px;color:#7a6a9a;line-height:1.6;margin-bottom:20px;word-break:keep-all">${body}</p>
                    <button id="_photo-alert-btn" style="width:100%;padding:12px;background:#C0A8FF;color:#4E3490;border:none;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;letter-spacing:0.04em">확인</button>
                  </div>`;
                const style = document.createElement('style');
                style.textContent = '@keyframes _paSlide{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}';
                document.head.appendChild(style);
                document.body.appendChild(overlay);
                const close = () => { overlay.remove(); style.remove(); };
                document.getElementById('_photo-alert-btn').addEventListener('click', close);
                overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
            };

            const toggleVisited = () => {
                if (!isVisited.value && allPhotos.value.length === 0) { _showPhotoAlert(); return; }
                const s = _getVisitedSet();
                if (s.has(tripUrl)) s.delete(tripUrl); else s.add(tripUrl);
                localStorage.setItem(VISITED_KEY, JSON.stringify([...s]));
                isVisited.value = s.has(tripUrl);
            };

            const DAY_LABELS = ['일','월','화','수','목','금','토'];
            const endDate = computed(() => {
                const d = dayjs(startDate.value).add(schedule.value.length - 1, 'day');
                return d.format('MM.DD') + ' (' + DAY_LABELS[d.day()] + ')';
            });

            /* 선택한 출발일 기준으로 쉬는 곳 찾기 */
            const weekdayOf = (dIdx) => dayjs(startDate.value).add(dIdx, 'day').day();
            const isClosed = (p, dIdx) => !!(p.closedDays && p.closedDays.includes(weekdayOf(dIdx)));
            const closedList = computed(() => schedule.value.flatMap((d, i) =>
                d.places.filter(p => isClosed(p, i)).map(p => ({ id: p.id, name: p.name, day: i + 1, wd: DAY_LABELS[weekdayOf(i)] }))
            ));
            const hasClosedData = computed(() => schedule.value.some(d => d.places.some(p => p.closedDays && p.closedDays.length)));

            const getFormattedDate = (offset) =>
                dayjs(startDate.value).add(offset, 'day').format('MM.DD');

            const allPhotos = computed(() =>
                schedule.value.flatMap(d => d.places).filter(p => p.photo).map(p => p.photo)
            );

            const currentPlace = computed(() => {
                const now = dayjs();
                const all = schedule.value.flatMap((d, i) => d.places.map(p => ({
                    ...p,
                    fullDate: dayjs(startDate.value).add(i, 'day')
                        .hour(Math.floor(p.h)).minute(Math.round((p.h % 1) * 60))
                })));
                return all.reverse().find(p => now.isAfter(p.fullDate)) || null;
            });

            const clickUpload = (id) => document.getElementById('file-' + id).click();

            const deleteConfirmId = ref(null);
            let _pressTimer = null;
            const startPress = (id) => {
                _pressTimer = setTimeout(() => { deleteConfirmId.value = id; }, 600);
            };
            const endPress = () => {
                clearTimeout(_pressTimer);
                _pressTimer = null;
            };
            const cancelDelete = () => { deleteConfirmId.value = null; };
            const confirmDelete = () => {
                const id = deleteConfirmId.value;
                schedule.value.forEach(d => d.places.forEach(p => {
                    if (p.id === id) p.photo = null;
                }));
                _saveSchedule();
                deleteConfirmId.value = null;
            };

            /* 일정(사진 포함)을 저장. localStorage 한도(보통 5MB)를 넘으면 false */
            const _saveSchedule = () => {
                try {
                    localStorage.setItem(storageKey, JSON.stringify(schedule.value));
                    return true;
                } catch (err) {
                    return false;
                }
            };

            /* 폰 원본 사진(3~10MB)은 localStorage에 들어가지 않으므로 긴 변 1024px JPEG로 줄인다 (장당 약 100~200KB) */
            const PHOTO_MAX = 1024;
            const PHOTO_QUALITY = 0.75;
            const _shrinkPhoto = (file) => new Promise((resolve, reject) => {
                const url = URL.createObjectURL(file);
                const img = new Image();
                img.onload = () => {
                    const scale = Math.min(1, PHOTO_MAX / Math.max(img.naturalWidth, img.naturalHeight));
                    const canvas = document.createElement('canvas');
                    canvas.width  = Math.round(img.naturalWidth * scale);
                    canvas.height = Math.round(img.naturalHeight * scale);
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    URL.revokeObjectURL(url);
                    resolve(canvas.toDataURL('image/jpeg', PHOTO_QUALITY));
                };
                img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
                img.src = url;
            });

            const uploadPhoto = async (e, id) => {
                const file = e.target.files[0];
                e.target.value = '';   // 같은 사진을 다시 골라도 change가 일어나게
                if (!file) return;

                let dataUrl;
                try {
                    dataUrl = await _shrinkPhoto(file);
                } catch (err) {
                    _showPhotoAlert('사진을 열 수 없어요', '이 형식의 사진은 지원하지 않아요.<br>JPG나 PNG 사진으로 다시 시도해주세요');
                    return;
                }

                const place = schedule.value.flatMap(d => d.places).find(p => p.id === id);
                if (!place) return;
                const prev = place.photo;
                place.photo = dataUrl;
                if (!_saveSchedule()) {
                    place.photo = prev;   // 저장 못 한 사진은 새로고침하면 사라지므로 화면에도 남기지 않는다
                    _showPhotoAlert('저장 공간이 부족해요', '이 브라우저에 사진을 더 저장할 수 없어요.<br>다른 코스의 사진을 지운 뒤 다시 시도해주세요');
                }
            };

            const playArt = () => {
                isArtPlaying.value = true;
                collagePieces.value = [];
                allPhotos.value.forEach((photo, i) => {
                    setTimeout(() => {
                        collagePieces.value.push({
                            src: photo,
                            style: {
                                top:               (Math.random() * 58 + 8) + '%',
                                left:              (Math.random() * 62 + 6) + '%',
                                animationDelay:    (i * 0.5) + 's',
                                animationDuration: (5 + Math.random() * 3) + 's'
                            }
                        });
                    }, i * 260);
                });
            };

            const saveImage = () => {
                if (!downloadName) return;
                html2canvas(document.getElementById('report-content')).then(canvas => {
                    const link = document.createElement('a');
                    link.download = downloadName;
                    link.href = canvas.toDataURL();
                    link.click();
                });
            };

            const upvoteTip = (tip) => {
                tip.upvoted = !tip.upvoted;
                tip.upvotes += tip.upvoted ? 1 : -1;
                if (tipsKey) localStorage.setItem(tipsKey, JSON.stringify(tips.value));
            };

            const submitTip = () => {
                const text = newTipText.value.trim();
                if (!text) return;
                const author = newTipAuthor.value.trim() || '익명';
                tips.value.unshift({
                    id: 't' + Date.now(), author, avatar: '✈️', isOperator: false,
                    date: dayjs().format('YYYY.MM'), body: text, upvotes: 0, upvoted: false
                });
                if (tipsKey) localStorage.setItem(tipsKey, JSON.stringify(tips.value));
                newTipText.value = ''; newTipAuthor.value = ''; showTipModal.value = false;
            };

            const dateKey = storageKey + '_date';
            const GLOBAL_DATE_KEY = 'huihui_start_date';
            watch(startDate, val => {
                localStorage.setItem(dateKey, val);
                localStorage.setItem(GLOBAL_DATE_KEY, val);
            });

            onMounted(() => {
                const saved = localStorage.getItem(storageKey);
                if (saved) schedule.value = JSON.parse(saved);
                if (tipsKey) {
                    const savedTips = localStorage.getItem(tipsKey);
                    if (savedTips) tips.value = JSON.parse(savedTips);
                }
                // 이 여행에 저장된 날짜가 있으면 우선 사용, 없으면 다른 여행에서 마지막으로 입력한 날짜를 기본값으로 사용
                const savedDate = localStorage.getItem(dateKey) || localStorage.getItem(GLOBAL_DATE_KEY);
                if (savedDate) startDate.value = savedDate;
            });

            return {
                startDate, endDate, schedule, getFormattedDate,
                isClosed, closedList, hasClosedData,
                currentPlace, allPhotos, clickUpload, uploadPhoto,
                isArtPlaying, playArt, showReport, saveImage, collagePieces,
                isVisited, toggleVisited,
                tips, showTipModal, newTipAuthor, newTipText, upvoteTip, submitTip,
                deleteConfirmId, startPress, endPress, cancelDelete, confirmDelete,
                expandedId, toggleExpand
            };
        }
    }).mount('#app');
}
