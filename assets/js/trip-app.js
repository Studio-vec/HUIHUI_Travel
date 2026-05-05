function createTripApp({ tripUrl, storageKey, schedule: initialSchedule, downloadName }) {
    const { createApp, ref, computed, onMounted } = Vue;
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
            const collagePieces = ref([]);
            const isVisited     = ref(_getVisitedSet().has(tripUrl));
            const schedule      = ref(initialSchedule);

            const toggleVisited = () => {
                if (!isVisited.value && allPhotos.value.length === 0) return;
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
            const uploadPhoto = (e, id) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (res) => {
                    schedule.value.forEach(d => d.places.forEach(p => {
                        if (p.id === id) p.photo = res.target.result;
                    }));
                    localStorage.setItem(storageKey, JSON.stringify(schedule.value));
                };
                reader.readAsDataURL(file);
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

            onMounted(() => {
                const saved = localStorage.getItem(storageKey);
                if (saved) schedule.value = JSON.parse(saved);
            });

            return {
                startDate, endDate, schedule, getFormattedDate,
                currentPlace, allPhotos, clickUpload, uploadPhoto,
                isArtPlaying, playArt, showReport, saveImage, collagePieces,
                isVisited, toggleVisited
            };
        }
    }).mount('#app');
}
