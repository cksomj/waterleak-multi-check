const STORAGE_KEY = "waterleak_multi_check_v1";
const GOOGLE_CONFIG_KEY = "waterleak_google_drive_config_v1";
const RECORDING_DB_NAME = "waterleak_recordings_v1";
const PROVIDER = {
  name: "최씨누수탐지종합설비",
  bizNo: "381-26-00781",
  address: "속초시 조양로 22번길7",
  owner: "최규석",
};

const basePlumbingChecks = [
  ["hot_water", "배관누수검사", "배관 밸브를 잠그고 열어 계량기 누수 변화를 확인합니다."],
  ["toilet_parts", "화장실 변기부속 누수검사", "밸브를 잠그고 열어 계량기 움직임을 확인합니다. 물이 없으면 보충 후 재검사합니다."],
  ["all_valves", "모든 밸브류 검사", "화장실, 싱크대, 개수대, 외부수도, 밸브고장 여부를 순차 확인합니다."],
];

const baseWaterproofChecks = [
  ["window_frame", "창틀검사", "외부 빗물 유입, 실리콘 벌어짐, 하부 물길 상태를 확인합니다."],
  ["rain_pipe", "우수관검사", "우수관 막힘, 파손, 역류 흔적과 주변 오염을 확인합니다."],
  ["bathroom_waterproof", "화장실 방수상태", "바닥/벽체 방수층 의심 구간, 하부세대 피해 방향을 확인합니다."],
  ["drain_trap", "유가상태", "유가 주변 크랙, 배수 불량, 악취 및 물고임 여부를 확인합니다."],
  ["toilet_body", "변기상태", "변기 정심, 백시멘트, 배관 연결부 흔들림과 누수 흔적을 확인합니다."],
];

const blogEmojis = [
  "😀","😃","😄","😁","😆","😅","😂","🤣","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙",
  "😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫢","🫣","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😶‍🌫️",
  "😏","😒","🙄","😬","😮‍💨","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴",
  "😵","😵‍💫","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","☹️","😮","😯","😲","😳","🥺","🥹",
  "😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈",
  "👿","💀","☠️","💩","🤡","👹","👺","👻","👽","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾",
  "🙈","🙉","🙊","💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣️","💔","❤️","🩷","🧡","💛","💚","💙","🩵","💜","🤎","🖤","🩶","🤍",
  "👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","🙏",
  "💧","💦","🌊","🚰","🚿","🛁","🧽","🪣","🧴","🫧","❄️","🔥","☔","🌧️","🌦️",
  "🔧","🛠️","🧰","🔩","⚙️","🪛","🔨","🪜","🧱","🧲","📏","📐","✂️","🧪","🧯",
  "🏠","🏡","🏢","🏘️","🏚️","🚪","🪟","🧱","🚽","🍽️","🛋️","🛏️","🚗","🏗️","🏪",
  "✅","☑️","✔️","❌","⭕","❗","❓","⚠️","🚨","⛔","🔴","🟠","🟡","🟢","🔵","🟣","⚪","⚫",
  "📍","📌","📝","📄","📋","📁","📂","📎","🔖","🧾","📑","📊","📈","📉","🗂️","🗓️","⏱️","⏰","📞","☎️",
  "🔍","🔎","🎧","🎙️","🔊","📢","📣","📸","🎥","💻","📱","🖨️","💾","☁️","🔐","🔗",
  "➡️","⬅️","⬆️","⬇️","↗️","↘️","↙️","↖️","🔁","🔄","⏩","⏪","▶️","⏸️","⏹️",
  "⭐","✨","💡","💬","🗯️","👍","👌","👏","🙏","💪","🙂","😊","😮","😅","😎","🙌",
  "1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","#️⃣","*️⃣","➕","➖","➗","✳️","✴️","🔶","🔷","▪️","▫️",
  "가","나","다","A","B","C","Ⅰ","Ⅱ","Ⅲ","①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩",
];

const viewOrder = [
  ["dashboard", "메인메뉴"],
  ["basic", "기본점검"],
  ["tracker", "누수추적기"],
  ["blog", "블로그 작성"],
  ["estimate", "견적서"],
  ["report", "AI 소견서"],
];

const defaultState = {
  activeView: "dashboard",
  currentJobId: null,
  storageMode: "google",
  googleDrive: {
    apiKey: "",
    clientId: "",
    folderId: "",
    folderName: "WaterLeak Multi Check",
  },
  googleSetupOpen: false,
  blogEditorOpen: false,
  blogCustomOpen: false,
  quickListOpen: false,
  quickListQuery: "",
  quickListMonth: new Date().toISOString().slice(0, 7),
  quickListSelectedDate: "",
  deletedJobIds: [],
  jobs: [],
};

let state = loadState();
state.activeView = "dashboard";
let wavRecorder = null;
let audioContext = null;
let analyser = null;
let animationFrame = null;
let micStream = null;
let leakAudioHistory = [];
let lastLeakAudioMetrics = null;
let recordingTarget = null;
let driveSaveDraft = null;
let googleTokenClient = null;
let googleAccessToken = "";
let pendingViewAnimation = "";
let savedBlogSelection = null;
let storageEstimate = { percent: null, text: "Google 저장 전용" };

const app = document.querySelector("#app");

function createJob() {
  const today = new Date().toISOString().slice(0, 10);
  const id = `job-${Date.now()}`;
  return {
    id,
    date: today,
    customerName: "",
    address: "",
    phone: "",
    situation: "",
    environment: "",
    plumbingChecks: createChecks(basePlumbingChecks),
    waterproofChecks: createChecks(baseWaterproofChecks),
    photos: [],
    photoFiles: [],
    somersPhotos: [],
    somersPhotoFiles: [],
    blogPhotos: [],
    videos: [],
    recordings: [],
    report: "",
    blog: "",
    blogCategory: "",
    blogKeyword: "",
    leakAudioPoints: [],
    somersLeakLevel: "",
    somersFrequency: "",
    somersOrangeMark: "",
    somersSuspectLocation: "",
    somersCaptureMemo: "",
    excavationResult: "",
    finalLeakLocation: "",
    vatMode: "exclusive",
    estimateItems: [{ name: "", cost: "" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createChecks(items) {
  return items.map(([id, title, guide]) => ({ id, title, guide, done: false, result: "대기", memo: "" }));
}

function normalizeChecks(savedChecks = [], baseItems = []) {
  const savedById = new Map(savedChecks.map((check) => [check.id, check]));
  return baseItems.map(([id, title, guide]) => ({
    id,
    title,
    guide,
    done: false,
    result: "대기",
    memo: "",
    ...(savedById.get(id) || {}),
    title,
    guide,
  }));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const googleDrive = loadStoredGoogleConfig(parsed.googleDrive);
      return { ...defaultState, ...parsed, googleDrive, googleSetupOpen: false };
    }
  } catch (error) {
    console.warn(error);
  }
  const firstJob = createJob();
  return { ...defaultState, googleDrive: loadStoredGoogleConfig(), currentJobId: firstJob.id, jobs: [firstJob] };
}

function saveState() {
  saveGoogleConfigOnly();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function updateStorageEstimate() {
  setStorageEstimate({ percent: null, text: "Google 저장 전용" });
}

function setStorageEstimate(next) {
  if (storageEstimate.text === next.text && storageEstimate.percent === next.percent) return;
  storageEstimate = next;
  const pill = document.querySelector(".storage-pill");
  if (pill) pill.textContent = storageEstimate.text;
}

function loadStoredGoogleConfig(fallback = {}) {
  try {
    const saved = localStorage.getItem(GOOGLE_CONFIG_KEY);
    if (saved) {
      return {
        apiKey: "",
        clientId: "",
        folderId: "",
        folderName: "WaterLeak Multi Check",
        ...fallback,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.warn(error);
  }
  return {
    apiKey: "",
    clientId: "",
    folderId: "",
    folderName: "WaterLeak Multi Check",
    ...fallback,
  };
}

function saveGoogleConfigOnly() {
  if (!state?.googleDrive) return;
  localStorage.setItem(GOOGLE_CONFIG_KEY, JSON.stringify(googleConfig()));
}

function currentJob() {
  let job = state.jobs.find((item) => item.id === state.currentJobId);
  if (!job) {
    job = state.jobs[0] || createJob();
    if (!state.jobs.length) state.jobs.push(job);
    state.currentJobId = job.id;
  }
  job.plumbingChecks = normalizeChecks(job.plumbingChecks, basePlumbingChecks);
  job.waterproofChecks = normalizeChecks(job.waterproofChecks, baseWaterproofChecks);
  normalizeV2Fields(job);
  return job;
}

function normalizeV2Fields(job) {
  const defaults = {
    somersLeakLevel: "",
    somersFrequency: "",
    somersOrangeMark: "",
    somersSuspectLocation: "",
    somersCaptureMemo: "",
    excavationResult: "",
    finalLeakLocation: "",
  };
  Object.entries(defaults).forEach(([key, value]) => {
    if (job[key] == null) job[key] = value;
  });
  if (!Array.isArray(job.somersPhotos)) job.somersPhotos = [];
  if (!Array.isArray(job.somersPhotoFiles)) job.somersPhotoFiles = [];
}

function updateJob(patch) {
  const job = currentJob();
  Object.assign(job, patch, { updatedAt: new Date().toISOString() });
  saveState();
  render();
}

function updateCheck(type, id, patch) {
  const job = currentJob();
  job[type] = job[type].map((check) => (check.id === id ? { ...check, ...patch } : check));
  job.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function setView(view, direction = 0) {
  state.activeView = view;
  pendingViewAnimation = direction > 0 ? "slide-in-right" : direction < 0 ? "slide-in-left" : "";
  saveState();
  render();
}

function moveView(direction) {
  const ids = viewOrder.map(([id]) => id);
  const currentIndex = Math.max(0, ids.indexOf(state.activeView));
  const nextIndex = Math.min(ids.length - 1, Math.max(0, currentIndex + direction));
  if (nextIndex !== currentIndex) animateViewChange(ids[nextIndex], direction);
}

function hardRefreshApp() {
  const url = new URL(window.location.href);
  url.searchParams.set("v", Date.now().toString());
  window.location.replace(url.toString());
}

function animateViewChange(view, direction) {
  setView(view, direction);
}

function render() {
  const job = currentJob();
  const animationClass = pendingViewAnimation;
  pendingViewAnimation = "";
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">WL</span>
          <div>
            <strong>WaterLeak Multi Check</strong>
            <small>누수진단 · 소견서 · 견적서 · 블로그 작성</small>
          </div>
        </div>
        <div class="top-actions">
          <span class="status-pill top-status">${escapeHtml(job.date || "-")} · ${escapeHtml(job.address || "주소 미입력")}</span>
          <span class="status-pill storage-pill">${escapeHtml(storageEstimate.text)}</span>
          <button class="btn ghost top-new-job" data-action="new-job">새 작업</button>
          <button class="btn ghost top-job-list" data-action="toggle-quick-list">리스트</button>
          <button class="btn ghost top-refresh" data-action="hard-refresh">새 버전 새로고침</button>
        </div>
      </header>
      <div class="layout">
        <aside class="sidebar">${renderNav()}</aside>
        <main class="content"><div class="view-stage ${animationClass}">${renderView()}</div></main>
      </div>
      ${state.blogEditorOpen ? renderBlogEditor(job) : ""}
      ${state.quickListOpen ? renderQuickJobList() : ""}
    </div>
  `;
  bindEvents();
  if (state.activeView === "tracker") drawIdleSpectrum();
  updateStorageEstimate();
}

function renderNav() {
  return viewOrder.map(([id, label]) => `<button class="nav-button ${state.activeView === id ? "active" : ""}" data-view="${id}">${label}</button>`).join("");
}

function renderView() {
  const job = currentJob();
  const views = {
    dashboard: renderDashboard,
    basic: () => renderChecklist("기본점검 및 방수문제 목록"),
    tracker: renderTracker,
    report: renderReport,
    blog: renderBlog,
    estimate: renderEstimate,
  };
  return (views[state.activeView] || views.dashboard)(job);
}

function renderFieldSteps(activeId) {
  const steps = [
    ["dashboard", "현장정보"],
    ["basic", "기본점검"],
    ["tracker", "누수추적"],
    ["blog", "블로그"],
    ["estimate", "견적서"],
    ["report", "소견서"],
  ];
  return `
    <div class="field-step-strip">
      ${steps.map(([id, label], index) => `
        <button class="${id === activeId ? "active" : ""}" data-view="${id}" type="button">
          <b>${index + 1}</b>${label}
        </button>
      `).join("")}
    </div>
  `;
}

function renderDashboard(job) {
  return `
    <div class="section-head">
      <div>
        <h1>현장 기본정보</h1>
        <p class="muted">날짜, 주소, 연락처, 현장 상황을 저장하고 이후 서식에 자동 반영합니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn ghost" data-action="show-app-map">카카오지도</button>
        <button class="btn primary" data-action="google-drive-save">구글저장</button>
      </div>
    </div>
    ${renderFieldSteps("dashboard")}
    ${renderFieldReadinessPanel(job)}
    <section class="panel grid">
      <div class="info-grid dashboard-info-grid">
        ${field("date", "날짜", "date", job.date, "", "", "info-date")}
        ${field("customerName", "고객 이름", "text", job.customerName || "", "고객 이름", "", "info-customer")}
        ${field("address", "소비자 주소", "text", job.address, "예: 서울시 강남구 ...", "", "info-address")}
        ${phoneField(job)}
      </div>
      ${textareaWithSituationRecording(job)}
      <div id="driveStatus" class="drive-status">Google Drive: ${driveStatusText()}</div>
      ${renderGoogleDriveInlineSetup()}
      ${renderDriveMediaPicker()}
    </section>
    ${renderDashboardCommandDeck(job)}
    <section class="meter-cards" style="margin-top:14px">
      ${metric("점검 완료", countDone([...job.plumbingChecks, ...job.waterproofChecks]), `${job.plumbingChecks.length + job.waterproofChecks.length}개 중`)}
      ${metric("소견서", job.report ? "작성됨" : "미작성", "AI 초안")}
      ${metric("저장방식", "구글", "Drive 저장")}
    </section>
  `;
}

function renderFieldReadinessPanel(job) {
  const googleReady = Boolean(googleConfig().apiKey && googleConfig().clientId);
  const micReady = Boolean(navigator.mediaDevices?.getUserMedia);
  const recordingCount = (job.recordings || []).length;
  const reportReady = Boolean(job.report);
  const estimateReady = (job.estimateItems || []).some((item) => Number(item.cost || item.unitPrice || 0) > 0 || item.name);
  const somersReady = Boolean((job.somersPhotos || []).length || job.somersLeakLevel || job.somersFrequency || job.somersSuspectLocation);
  const items = [
    ["Google", googleReady ? "준비" : "설정", googleReady ? "Drive 저장 가능" : "키 입력 필요"],
    ["마이크", micReady ? "지원" : "미지원", micReady ? "녹음/분석 가능" : "권한 확인"],
    ["녹음", recordingCount ? `${recordingCount}개` : "대기", recordingCount ? "기록 있음" : "녹음 가능"],
    ["소머즈", somersReady ? "기록" : "대기", somersReady ? "OCR 포함" : "촬영 필요"],
    ["문서", reportReady || estimateReady ? "준비" : "대기", "출력 확인"],
  ];
  return `
    <section class="field-readiness-panel">
      ${items.map(([label, status, help]) => `
        <div class="${status === "설정 필요" || status === "미지원" ? "attention" : ""}">
          <span>${label}</span>
          <b>${status}</b>
          <small>${help}</small>
        </div>
      `).join("")}
    </section>
  `;
}

function renderDashboardCommandDeck(job) {
  const checks = [...job.plumbingChecks, ...job.waterproofChecks];
  const done = countDone(checks);
  const pointCount = (job.leakAudioPoints || []).length;
  const cards = [
    ["basic", "01", "기본점검 계속", `${done}/${checks.length} 완료`, "밸브, 방수, 우수관, 유가 상태를 빠르게 확인합니다."],
    ["tracker", "02", "누수추적 시작", `${pointCount}개 지점`, "실시간 그래프와 청음 점수로 의심 위치를 좁힙니다."],
    ["blog", "03", "블로그 자료 정리", job.blog ? "자료 있음" : "대기", "현장 자료를 ChatGPT용 프롬프트와 원고로 정리합니다."],
    ["estimate", "04", "견적서 작성", `${(job.estimateItems || []).length}개 항목`, "공급가액, 부가세, 합계를 현장에서 바로 계산합니다."],
    ["report", "05", "AI 소견서 작성", job.report ? "작성됨" : "미작성", "현장 기록과 점검 결과를 소견서 초안으로 만듭니다."],
  ];
  return `
    <section class="command-deck">
      ${cards.map(([view, index, title, meta, desc]) => `
        <button class="command-card" data-view="${view}" type="button">
          <span>${index}</span>
          <strong>${title}</strong>
          <b>${meta}</b>
          <small>${desc}</small>
        </button>
      `).join("")}
    </section>
  `;
}

function textareaWithSituationRecording(job) {
  const target = { kind: "field", field: "situation" };
  const recording = getLastRecordingForTarget(target);
  const active = wavRecorder?.recording && targetKey(recordingTarget) === targetKey(target);
  const paused = active && wavRecorder?.paused;
  return `
    <div class="field">
      <div class="field-head">
        <label for="situation">상황 기록</label>
        <div class="mini-actions record-actions">
          <button class="btn ghost record-btn ${active ? "recording" : ""} ${recording ? "saved" : ""}" data-action="record-field" data-field="situation">
            <span class="voice-icon ${active && !paused ? "blue pulse" : recording ? "blue" : "idle"}"></span>${active ? "녹음멈춤" : recording ? "저장완료" : "녹음"}
          </button>
          <button class="btn ghost pause-btn" data-action="pause-recording" data-field="situation" ${active ? "" : "disabled"}>${paused ? "이어녹음" : "일시정지"}</button>
          <button class="btn ghost listen-btn" data-action="play-recording" data-recording-id="${escapeAttr(recording?.id || "")}" ${recording ? "" : "disabled"}>재생</button>
          <button class="btn ghost clear-btn" data-action="delete-recording" data-recording-id="${escapeAttr(recording?.id || "")}" ${recording ? "" : "disabled"}>삭제</button>
        </div>
      </div>
      <textarea id="situation" data-job-field="situation" placeholder="누수 발생 위치, 시간, 피해상황, 고객 진술을 직접 입력합니다.">${escapeHtml(job.situation || "")}</textarea>
    </div>
  `;
}

function phoneField(job) {
  return `
    <div class="field info-phone">
      <label for="phone">전화번호</label>
      <div class="phone-input-row">
        <input id="phone" data-job-field="phone" type="tel" value="${escapeAttr(job.phone || "")}" placeholder="010-0000-0000" />
        <button class="btn ghost" data-action="pick-contact-phone" type="button">연락처 선택</button>
      </div>
    </div>
  `;
}

function renderDriveMediaPicker() {
  if (!driveSaveDraft?.active) return "";
  return `
    <div class="drive-setup">
      <h2>Google Drive 선택 업로드</h2>
      <label>사진갤러리에서 선택
        <input data-drive-pick="photos" type="file" accept="image/*" multiple />
      </label>
      <p class="muted">선택됨: ${driveSaveDraft.photoFiles.length}개</p>
      <label>녹음 파일에서 선택
        <input data-drive-pick="recordings" type="file" accept="audio/*" multiple />
      </label>
      <p class="muted">선택됨: ${driveSaveDraft.recordingFiles.length}개</p>
      <div class="toolbar">
        <button class="btn primary" data-action="continue-google-drive-save">오늘작업저장</button>
        <button class="btn ghost" data-action="cancel-google-drive-save">취소</button>
      </div>
    </div>
  `;
}

function renderGoogleDriveInlineSetup() {
  const config = googleConfig();
  if (config.apiKey && config.clientId) return "";
  return `
    <div class="drive-setup">
      <h2>Google Drive 저장 설정</h2>
      <div class="grid two">
        <label>Google API Key
          <input data-google-setting="apiKey" type="text" value="${escapeHtml(config.apiKey || "")}" placeholder="API 키를 붙여넣기" />
        </label>
        <label>OAuth Client ID
          <input data-google-setting="clientId" type="text" value="${escapeHtml(config.clientId || "")}" placeholder="OAuth 클라이언트 ID를 붙여넣기" />
        </label>
      </div>
      <div class="toolbar">
        <button class="btn primary" data-action="save-google-settings">설정 저장 후 구글저장</button>
      </div>
      <p class="muted">처음 한 번만 입력하면 이후에는 구글저장 버튼으로 바로 저장합니다.</p>
    </div>
  `;
}

function renderChecklist(title) {
  const job = currentJob();
  const groups = [
    ["plumbingChecks", "기본점검", job.plumbingChecks || []],
    ["waterproofChecks", "방수문제", job.waterproofChecks || []],
  ];
  return `
    <div class="section-head">
      <div>
        <h1>${title}</h1>
        <p class="muted">중요 항목부터 빠르게 체크하고 결과를 저장합니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn ghost" data-action="reset-checks" data-type="all">초기화</button>
        <button class="btn primary" data-action="save">점검목록 저장</button>
      </div>
    </div>
    ${renderFieldSteps("basic")}
    <section class="panel check-list">
      ${groups.map(([type, groupTitle, checks]) => `
        <h2 class="check-group-title">${groupTitle}</h2>
        ${checks.map((check) => renderCheckRow(type, check)).join("")}
      `).join("")}
    </section>
  `;
}

function renderCheckRow(type, check) {
  const isPipeLeakCheck = check.id === "hot_water";
  const pipeRecording = isPipeLeakCheck ? getLastRecordingForTarget({ kind: "check", type, id: check.id }) : null;
  const pipeRecordingActive = isPipeLeakCheck && wavRecorder?.recording && targetKey(recordingTarget) === targetKey({ kind: "check", type, id: check.id });
  return `
    <div class="check-row">
      <input type="checkbox" ${check.done ? "checked" : ""} data-check="${check.id}" data-check-type="${type}" data-field="done" />
      <div>
        <strong>${escapeHtml(check.title)}</strong>
        <p class="muted">${escapeHtml(check.guide)}</p>
        ${isPipeLeakCheck ? `
          <div class="mini-actions record-actions">
            <button class="btn ghost record-btn ${pipeRecordingActive ? "recording" : ""} ${pipeRecording ? "saved" : ""}" data-action="record-check" data-check="${check.id}" data-check-type="${type}">
              <span class="voice-icon ${pipeRecordingActive ? "blue pulse" : pipeRecording ? "blue" : "idle"}"></span>${pipeRecordingActive ? "녹음멈춤" : pipeRecording ? "저장완료" : "녹음"}
            </button>
            <button class="btn ghost listen-btn" data-action="play-recording" data-recording-id="${escapeAttr(pipeRecording?.id || "")}" ${pipeRecording ? "" : "disabled"}>재생</button>
            <button class="btn ghost clear-btn" data-action="delete-recording" data-recording-id="${escapeAttr(pipeRecording?.id || "")}" ${pipeRecording ? "" : "disabled"}>삭제</button>
          </div>
        ` : ""}
      </div>
      <div class="check-result">
        <select data-check="${check.id}" data-check-type="${type}" data-field="result">
          ${["대기", "정상", "의심", "누수확인", "재검필요"].map((item) => `<option ${check.result === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </div>
    </div>
  `;
}

function renderTracker(job) {
  const trackerRecording = getLastRecordingForTarget({ kind: "tracker" });
  const trackerRecordingActive = wavRecorder?.recording && targetKey(recordingTarget) === "tracker";
  const trackerRecordingPaused = trackerRecordingActive && wavRecorder?.paused;
  const leakPoints = job.leakAudioPoints || [];
  return `
    <div class="section-head">
      <div>
        <h1>누수추적기</h1>
        <p class="muted">마이크 입력을 실시간 주파수 그래프로 표시하고 필요한 소리를 녹음합니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn primary" data-action="start-spectrum">USB-C / 3.5파이 입력 분석</button>
        <button class="btn ghost record-btn ${trackerRecordingActive ? "recording" : ""} ${trackerRecording ? "saved" : ""}" data-action="record-tracker">
          <span class="voice-icon ${trackerRecordingActive && !trackerRecordingPaused ? "blue pulse" : trackerRecording ? "blue" : "idle"}"></span>${trackerRecordingActive ? "녹음멈춤" : trackerRecording ? "저장완료" : "녹음"}
        </button>
        <button class="btn ghost listen-btn" data-action="play-recording" data-recording-id="${escapeAttr(trackerRecording?.id || "")}" ${trackerRecording ? "" : "disabled"}>재생</button>
        <button class="btn ghost clear-btn" data-action="delete-recording" data-recording-id="${escapeAttr(trackerRecording?.id || "")}" ${trackerRecording ? "" : "disabled"}>삭제</button>
        <button class="btn warn" data-action="stop-spectrum">정지</button>
      </div>
    </div>
    ${renderFieldSteps("tracker")}
    <section class="audio-panel">
      <div class="toolbar" style="justify-content:space-between;margin-bottom:10px">
        <h2>실시간 주파수 그래프</h2>
        <span class="status-pill" id="peakStatus">최고 주파수 대역 대기</span>
      </div>
      <div class="spectrum-wrap">
        <canvas id="spectrum" width="1100" height="360"></canvas>
        <div class="leak-score-overlay">
          <div class="leak-score-circle" id="leakScoreCircle" style="--score-deg:0deg"><span id="leakScoreValue">0</span><small>%</small></div>
          <span class="leak-risk-badge risk-green" id="leakRiskBadge">정상 범위</span>
        </div>
      </div>
      <p class="muted" style="color:#9fc2c8;margin-top:10px">높은 피크 대역은 주황색으로 표시됩니다. 녹음은 WAV 파일로 저장됩니다.</p>
    </section>
    <section class="panel leak-ai-panel">
      <div class="leak-ai-head">
        <div>
          <h2>AI 청음 누수 분석</h2>
          <p class="muted">청음기 3.5파이 출력 또는 USB-C 오디오 캡처 입력을 실시간 주파수 그래프로 분석합니다.</p>
        </div>
      </div>
      <div class="leak-metrics-grid">
        <div><span>피크 주파수</span><strong id="leakPeakHz">- Hz</strong></div>
        <div><span>저주파 평균</span><strong id="leakLowAvg">- dB</strong></div>
        <div><span>중역 평균</span><strong id="leakMidAvg">- dB</strong></div>
        <div><span>누수대역 평균</span><strong id="leakBandAvg">- dB</strong></div>
      </div>
      <div class="leak-save-row">
        <input id="leakPointName" placeholder="예: 욕실 앞, 보일러실, 주방 싱크대" />
        <button class="btn primary" data-action="save-leak-point">현재 지점 저장</button>
      </div>
      <div class="leak-point-list">
        <h3>저장된 측정 지점</h3>
        ${leakPoints.length ? leakPoints.map((point) => `
          <div class="leak-point-item ${escapeAttr(point.color || "green")}">
            <div>
              <strong>${escapeHtml(point.name || "측정지점")}</strong>
              <span>${escapeHtml(new Date(point.createdAt || Date.now()).toLocaleString())}</span>
            </div>
            <b>${Number(point.score || 0)}% · ${escapeHtml(point.risk || "정상 범위")}</b>
            <button class="btn ghost" data-action="delete-leak-point" data-id="${escapeAttr(point.id)}">삭제</button>
          </div>
        `).join("") : `<p class="muted">아직 저장된 측정 지점이 없습니다.</p>`}
      </div>
    </section>
    ${renderTrackerV2Expansion(leakPoints)}
    ${renderTrackerV2Workbench(job, leakPoints)}
    ${renderTrackerPipeCheck(job)}
  `;
}

function renderTrackerV2Expansion(leakPoints = []) {
  const bestPoint = [...leakPoints].sort((a, b) => Number(b.score || 0) - Number(a.score || 0))[0];
  return `
    <section class="tracker-v2-grid">
      <article class="tracker-v2-card">
        <span class="v2-kicker">DAESUNG INPUT</span>
        <h3>대성 청음기 입력</h3>
        <p>대성 청음기 → 3.5파이/AUX → USB-C 오디오 캡처 또는 직접 입력 흐름을 기준으로 실시간 분석 영역을 유지합니다.</p>
        <div class="v2-flow"><span>청음기</span><b>→</b><span>3.5파이</span><b>→</b><span>USB-C</span><b>→</b><span>FFT</span></div>
      </article>
      <article class="tracker-v2-card">
        <span class="v2-kicker">SOMERS OCR</span>
        <h3>소머즈 촬영 데이터</h3>
        <p>API가 없는 장비 화면은 촬영 후 OCR로 누수 레벨, 주파수, 그래프, 주황색 표시, 의심 위치를 읽는 방향입니다.</p>
        <div class="v2-tags"><span>누수 레벨</span><span>주파수</span><span>그래프</span><span>의심 위치</span></div>
      </article>
      <article class="tracker-v2-card">
        <span class="v2-kicker">MULTI POINT</span>
        <h3>다지점 비교 모드</h3>
        <p>A/B/C/D 지점을 같은 기준으로 저장하고 비교해 최종 의심 위치를 빠르게 추천하는 공간입니다.</p>
        <div class="v2-point-row">
          ${["A", "B", "C", "D"].map((label, index) => {
            const point = leakPoints[index];
            return `<span class="${point ? "filled" : ""}">${label}<small>${point ? `${Number(point.score || 0)}%` : "대기"}</small></span>`;
          }).join("")}
        </div>
      </article>
      <article class="tracker-v2-card">
        <span class="v2-kicker">LEARNING DATA</span>
        <h3>결과 저장/학습 데이터</h3>
        <p>청음 결과, 소머즈 OCR, 실제 굴착 결과를 함께 남겨 장기 학습 데이터로 확장합니다.</p>
        <strong class="v2-recommend">${bestPoint ? `현재 최고 의심: ${escapeHtml(bestPoint.name || "측정지점")} ${Number(bestPoint.score || 0)}%` : "측정 지점을 저장하면 추천 후보가 표시됩니다."}</strong>
      </article>
    </section>
  `;
}

function renderTrackerV2Workbench(job, leakPoints = []) {
  const topPoints = [...leakPoints].sort((a, b) => Number(b.score || 0) - Number(a.score || 0)).slice(0, 4);
  const somersPreview = (job.somersPhotoFiles || [])[0];
  return `
    <section class="tracker-v2-workbench">
      <article class="v2-screen somers-screen">
        <div>
          <span class="v2-kicker">SCREEN 01</span>
          <h3>소머즈 촬영 화면</h3>
          <p>장비 화면을 촬영해 OCR로 누수 레벨, 주파수, 그래프, 주황색 표시, 의심 위치를 추출하는 설계 영역입니다.</p>
        </div>
        <label class="v2-capture-box">
          <span>소머즈 화면 사진 선택</span>
          <input data-file-type="somersPhotos" type="file" accept="image/*" capture="environment" multiple />
        </label>
        <div class="v2-capture-status">
          <span>촬영 자료 <b>${(job.somersPhotos || []).length ? `${job.somersPhotos.length}장 저장됨` : "대기"}</b></span>
          ${somersPreview?.dataUrl ? `<img src="${escapeAttr(somersPreview.dataUrl)}" alt="소머즈 촬영 미리보기" />` : ""}
        </div>
        <div class="v2-ocr-grid">
          <label>누수 레벨<input data-job-field="somersLeakLevel" value="${escapeAttr(job.somersLeakLevel || "")}" placeholder="예: 78" /></label>
          <label>주파수<input data-job-field="somersFrequency" value="${escapeAttr(job.somersFrequency || "")}" placeholder="예: 620 Hz" /></label>
          <label>주황 표시<input data-job-field="somersOrangeMark" value="${escapeAttr(job.somersOrangeMark || "")}" placeholder="예: 강함 / 우측" /></label>
          <label>의심 위치<input data-job-field="somersSuspectLocation" value="${escapeAttr(job.somersSuspectLocation || "")}" placeholder="예: 욕실 앞 배관" /></label>
          <label>촬영 메모<textarea data-job-field="somersCaptureMemo" placeholder="촬영 각도, 화면 밝기, 소머즈 그래프 특징을 기록합니다.">${escapeHtml(job.somersCaptureMemo || "")}</textarea></label>
        </div>
      </article>
      <article class="v2-screen daesung-screen">
        <div>
          <span class="v2-kicker">SCREEN 02</span>
          <h3>대성 청음 분석 화면</h3>
          <p>현재 실시간 그래프와 연결되는 입력 계통입니다. 3.5파이/AUX 또는 USB-C 입력 후 FFT, 피크, 누수대역 평균을 같은 기준으로 봅니다.</p>
        </div>
        <div class="v2-meter-stack">
          <span><b>INPUT</b> 3.5파이 / USB-C 오디오 입력</span>
          <span><b>FFT</b> 실시간 주파수 분석</span>
          <span><b>WAVE</b> 실시간 파형 확장 예정</span>
        </div>
      </article>
      <article class="v2-screen compare-screen">
        <div>
          <span class="v2-kicker">SCREEN 03</span>
          <h3>다지점 비교 화면</h3>
          <p>A/B/C/D 지점의 점수와 위험도를 비교해 현장에서 바로 의심 위치를 좁히는 화면입니다.</p>
        </div>
        <div class="v2-compare-table">
          ${["A", "B", "C", "D"].map((label, index) => {
            const point = topPoints[index];
            return `
              <div class="${point ? "filled" : ""}">
                <strong>${label}</strong>
                <span>${escapeHtml(point?.name || "측정 대기")}</span>
                <b>${point ? `${Number(point.score || 0)}%` : "- %"}</b>
              </div>
            `;
          }).join("")}
        </div>
      </article>
      <article class="v2-screen save-screen">
        <div>
          <span class="v2-kicker">SCREEN 04</span>
          <h3>결과 저장 화면</h3>
          <p>대성 청음, 소머즈 OCR, 다지점 비교, 실제 굴착 결과를 한 작업 기록에 묶어 장기 학습 데이터로 남깁니다.</p>
        </div>
        <div class="v2-save-checks">
          <span>청음 점수 <b>${leakPoints.length ? "저장됨" : "대기"}</b></span>
          <span>소머즈 OCR <b>${job.somersLeakLevel || job.somersFrequency || job.somersSuspectLocation ? "기록됨" : "대기"}</b></span>
          <label>최종 누수 위치<input data-job-field="finalLeakLocation" value="${escapeAttr(job.finalLeakLocation || "")}" placeholder="예: 주방 싱크대 하부 온수관" /></label>
          <label>실제 굴착 결과<textarea data-job-field="excavationResult" placeholder="굴착 위치, 실제 파손 지점, 보수 결과를 기록합니다.">${escapeHtml(job.excavationResult || "")}</textarea></label>
          <span>Google Drive <b>연동 가능</b></span>
        </div>
        <button class="btn primary" data-action="google-drive-save">결과 Google 저장</button>
      </article>
    </section>
  `;
}

function renderTrackerPipeCheck(job) {
  const check = (job.plumbingChecks || []).find((item) => item.id === "hot_water") || normalizeChecks([], basePlumbingChecks)[0];
  const target = { kind: "check", type: "plumbingChecks", id: check.id };
  const recording = getLastRecordingForTarget(target);
  const active = wavRecorder?.recording && targetKey(recordingTarget) === targetKey(target);
  const paused = active && wavRecorder?.paused;
  return `
    <section class="panel tracker-pipe-check">
      <div class="check-row">
        <input type="checkbox" ${check.done ? "checked" : ""} data-check="${check.id}" data-check-type="plumbingChecks" data-field="done" />
        <div>
          <strong>${escapeHtml(check.title)}</strong>
          <p class="muted">${escapeHtml(check.guide)}</p>
          <div class="mini-actions record-actions">
            <button class="btn ghost record-btn ${active ? "recording" : ""} ${recording ? "saved" : ""}" data-action="record-check" data-check="${check.id}" data-check-type="plumbingChecks">
              <span class="voice-icon ${active && !paused ? "blue pulse" : recording ? "blue" : "idle"}"></span>${active ? "녹음멈춤" : recording ? "저장완료" : "녹음"}
            </button>
            <button class="btn ghost pause-btn" data-action="pause-recording" data-check="${check.id}" data-check-type="plumbingChecks" ${active ? "" : "disabled"}>${paused ? "이어녹음" : "일시정지"}</button>
            <button class="btn ghost listen-btn" data-action="play-recording" data-recording-id="${escapeAttr(recording?.id || "")}" ${recording ? "" : "disabled"}>재생</button>
            <button class="btn ghost clear-btn" data-action="delete-recording" data-recording-id="${escapeAttr(recording?.id || "")}" ${recording ? "" : "disabled"}>삭제</button>
          </div>
        </div>
        <div class="check-result">
          <select data-check="${check.id}" data-check-type="plumbingChecks" data-field="result">
            ${["대기", "정상", "의심", "누수확인", "재검필요"].map((item) => `<option ${check.result === item ? "selected" : ""}>${item}</option>`).join("")}
          </select>
        </div>
      </div>
    </section>
  `;
}

function renderReport(job) {
  return `
    <div class="section-head">
      <div>
        <h1>AI 소견서</h1>
        <p class="muted">오늘 저장된 현장 데이터와 점검결과를 조합해 누수상황·문제점 소견서 초안을 만듭니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn primary" data-action="generate-report">소견서 만들기</button>
        <button class="btn ghost" data-action="download-report-pdf">PDF 다운로드</button>
        <button class="btn ghost" data-action="clear-report">새로만들기</button>
      </div>
    </div>
    ${renderFieldSteps("report")}
    <div class="grid two">
      <section class="panel grid">
        <h2>사진 업로드</h2>
        ${fileBox("photos", "사진 앨범 열기")}
      </section>
      <section class="panel grid">
        ${textarea("report", "소견서 내용", job.report, "소견서 자동생성 후 수정할 수 있습니다.")}
        <div class="toolbar">
          <button class="btn primary" data-action="save">수정 저장</button>
          <button class="btn warn" data-action="delete-report">삭제</button>
        </div>
      </section>
    </div>
    <section class="panel pdf-preview-panel">
      <div class="section-head compact">
        <div>
          <h2>소견서 출력 미리보기</h2>
          <p class="muted">PDF 팝업이 차단되어도 현장에서 출력 내용을 먼저 확인할 수 있습니다.</p>
        </div>
        <button class="btn ghost" data-action="download-report-pdf">인쇄창 다시 열기</button>
      </div>
      <div class="pdf-preview-page">${buildReportPrintHtml(job)}</div>
    </section>
  `;
}

function renderBlog(job) {
  return `
    <div class="section-head">
      <div>
        <h1>블로그 글 작성</h1>
        <p class="muted">현장 자료를 정리해 ChatGPT에 붙여넣을 프롬프트를 만듭니다.</p>
      </div>
      <div class="toolbar blog-main-toolbar">
        <button class="btn primary" data-action="generate-blog">관련자료 가져오기</button>
        <button class="btn ghost" data-action="copy-blog-prompt">프롬프트 복사</button>
        <button class="btn ghost" data-action="open-chatgpt">ChatGPT 실행</button>
        <button class="btn ghost" data-action="open-blog-editor">원고 수정하기</button>
        <button class="btn ghost" data-action="print-blog">PDF 인쇄</button>
        <button class="btn warn" data-action="clear-blog-data">자료 삭제</button>
      </div>
    </div>
    ${renderFieldSteps("blog")}
    ${renderCustomBlogPanel(job)}
    <section class="panel blog-preview-panel">
      <div class="section-head compact">
        <div>
          <h2>프롬프트/원고 미리보기</h2>
          <p class="muted">ChatGPT에서 작성한 글은 원고 수정하기 화면에 붙여넣고 저장합니다.</p>
        </div>
        <button class="btn primary" data-action="save">앱에 저장</button>
      </div>
      <div class="preview blog-preview">${formatBlogContent(job.blog || "관련자료 가져오기를 누르면 프롬프트가 표시됩니다.")}</div>
    </section>
  `;
}

function renderCustomBlogPanel(job) {
  return `
    <details class="panel custom-blog-panel" ${job.blogCategory || job.blogKeyword ? "open" : ""}>
      <summary class="custom-blog-summary">새 블로그</summary>
      <div class="section-head compact">
        <div>
          <h2>새 블로그 주제 지정</h2>
          <p class="muted">원하는 카테고리와 메인키워드로 ChatGPT용 프롬프트를 만듭니다.</p>
        </div>
      </div>
      <div class="custom-blog-grid">
        ${blogKeywordField("blogCategory", "카테고리:", job.blogCategory || "", "예) 건강, 생활정보, 누수탐지")}
        ${blogKeywordField("blogKeyword", "메인키워드:", job.blogKeyword || "", "예) 누수진단")}
      </div>
      <div class="toolbar custom-blog-actions">
        <button class="btn primary" data-action="copy-custom-blog-prompt">프롬프트 복사</button>
        <button class="btn ghost" data-action="open-chatgpt-custom">ChatGPT 실행</button>
      </div>
    </details>
  `;
}

function renderBlogEditor(job) {
  return `
    <div class="blog-editor-screen">
      <header class="blog-editor-bar">
        <div class="toolbar">
          <button class="btn primary" data-action="save-blog-editor">저장</button>
          <button class="btn ghost" data-action="print-blog">PDF 인쇄</button>
          <button class="btn ghost" data-action="copy-blog-editor">내용복사</button>
          <button class="btn warn" data-action="clear-blog-editor">화면 삭제</button>
          <button class="btn blog-link naver" data-action="open-external-link" data-url="https://blog.naver.com/cksomj">N</button>
          <button class="btn blog-link tistory" data-action="open-external-link" data-url="https://cksomj.tistory.com/manage">T</button>
          <button class="btn blog-link daangn" data-action="open-external-link" data-url="https://bizprofile.daangn.com/biz_accounts/83300/manager/posts/new/?entry=business_profile.home.info_manage_ba_info">D</button>
          <button class="btn warn" data-action="close-blog-editor">나오기</button>
        </div>
      </header>
      <div class="blog-editor-tools">
        <button class="btn ghost" data-format="undo">↶</button>
        <button class="btn ghost" data-format="redo">↷</button>
        <button class="btn ghost" data-format="bold"><b>B</b></button>
        <button class="btn ghost" data-format="italic"><i>I</i></button>
        <button class="btn ghost" data-format="underline"><u>U</u></button>
        <button class="btn ghost" data-format-block="h2">제목</button>
        <button class="btn ghost" data-format-block="p">본문</button>
        <button class="btn ghost" data-format="justifyLeft">왼쪽</button>
        <button class="btn ghost" data-format="justifyCenter">가운데</button>
        <button class="btn ghost" data-format="justifyRight">오른쪽</button>
        <button class="btn ghost" data-format="insertUnorderedList">목록</button>
        <button class="btn ghost" data-format="insertOrderedList">번호</button>
        <button class="btn ghost" data-action="toggle-emoji-picker">이모티콘</button>
      </div>
      <div class="emoji-picker" hidden>
        ${blogEmojis.map((emoji) => `<button class="emoji-btn" data-emoji="${emoji}" type="button">${emoji}</button>`).join("")}
      </div>
      <main id="blogEditor" class="blog-editor-page" contenteditable="true"></main>
    </div>
  `;
}

function renderEstimate(job) {
  const items = job.estimateItems || [];
  const totals = estimateTotals(job);
  const estimateNo = job.estimateNo || `WL-${(job.date || "").replaceAll("-", "") || "00000000"}`;
  const docTitle = job.estimateDocTitle || "견 적 서";
  const vatMode = estimateVatMode(job);
  return `
    <div class="section-head">
      <div>
        <h1>견적서 작성</h1>
        <p class="muted">날짜와 주소는 현장 기본정보에서 자동 입력됩니다. 내용과 비용은 직접 입력합니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn ghost" data-action="toggle-estimate-title">제목 바꾸기</button>
        <button class="btn ${vatMode === "inclusive" ? "primary" : "ghost"}" data-action="set-estimate-vat" data-mode="inclusive">부가세포함</button>
        <button class="btn ${vatMode === "exclusive" ? "primary" : "ghost"}" data-action="set-estimate-vat" data-mode="exclusive">부가세별도</button>
        <button class="btn ghost" data-action="add-estimate">품명 추가</button>
        <button class="btn primary" data-action="save">저장 및 수정</button>
        <button class="btn ghost" data-action="download-estimate-pdf">PDF 다운로드</button>
      </div>
    </div>
    ${renderFieldSteps("estimate")}
    <section class="print-area estimate-form">
      <h2 class="estimate-title">${escapeHtml(docTitle)}</h2>
      <div class="estimate-meta">
        ${field("estimateNo", "견적번호", "text", estimateNo)}
        ${field("date", "견적일자", "date", job.date)}
        ${field("estimateValidUntil", "유효기간", "date", job.estimateValidUntil || "")}
      </div>
      <div class="estimate-party-edit">
        <div class="estimate-party-card">
          <h3>수신</h3>
          <div class="estimate-party-grid">
            <label>고객명${inlineField("customerName", job.customerName || "", "고객명")}</label>
            <label>주소${inlineField("address", job.address || "", "주소")}</label>
            <label>전화번호${inlineField("phone", job.phone || "", "전화번호")}</label>
            <label>공사명${inlineField("workSummary", job.workSummary || "누수 진단 및 보수 공사", "공사명")}</label>
          </div>
        </div>
        <div class="estimate-party-card">
          <h3>공급자</h3>
          <div class="estimate-party-grid">
            <label>상호${inlineField("vendorName", job.vendorName || PROVIDER.name, "상호")}</label>
            <label>사업자번호${inlineField("vendorBizNo", job.vendorBizNo || PROVIDER.bizNo, "000-00-00000")}</label>
            <label>대표/담당${inlineField("vendorOwner", job.vendorOwner || PROVIDER.owner, "담당자")}</label>
            <label>주소${inlineField("vendorAddress", job.vendorAddress || PROVIDER.address, "공급자 주소")}</label>
          </div>
        </div>
      </div>
      <table class="table estimate-info estimate-party-print print-only">
        <tbody>
          <tr><th colspan="2">수신</th><th colspan="2">공급자</th></tr>
          <tr>
            <th>고객명</th><td>${inlineField("customerName", job.customerName || "", "고객명")}</td>
            <th>상호</th><td>${inlineField("vendorName", job.vendorName || PROVIDER.name, "상호")}</td>
          </tr>
          <tr>
            <th>주소</th><td>${inlineField("address", job.address || "", "주소")}</td>
            <th>사업자번호</th><td>${inlineField("vendorBizNo", job.vendorBizNo || PROVIDER.bizNo, "000-00-00000")}</td>
          </tr>
          <tr>
            <th>전화번호</th><td>${inlineField("phone", job.phone || "", "전화번호")}</td>
            <th>대표/담당</th><td>${inlineField("vendorOwner", job.vendorOwner || PROVIDER.owner, "담당자")}</td>
          </tr>
          <tr>
            <th>공사명</th><td>${inlineField("workSummary", job.workSummary || "누수 진단 및 보수 공사", "공사명")}</td>
            <th>주소</th><td>${inlineField("vendorAddress", job.vendorAddress || PROVIDER.address, "공급자 주소")}</td>
          </tr>
        </tbody>
      </table>
      <div class="estimate-edit-list">
        ${items.map((item, index) => `
          <div class="estimate-edit-card">
            <div class="estimate-edit-card-head">
              <strong>품명 ${index + 1}</strong>
              <button class="btn warn no-print" data-action="remove-estimate" data-index="${index}">삭제</button>
            </div>
            <label class="estimate-edit-field estimate-edit-name">
              <span>품명</span>
              <textarea class="estimate-item-name" data-estimate="${index}" data-field="name" placeholder="예: 누수 진단 및 온수 배관 보수">${escapeHtml([item.name, item.spec].filter(Boolean).join(" / "))}</textarea>
            </label>
            <div class="estimate-edit-row">
              <label class="estimate-edit-field">
                <span>수량</span>
                <input data-estimate="${index}" data-field="qty" type="number" value="${escapeAttr(item.qty || 1)}" placeholder="1" />
              </label>
              <label class="estimate-edit-field">
                <span>공급가액</span>
                <input data-estimate="${index}" data-field="cost" type="number" value="${escapeAttr(estimateLineTotal(item) || "")}" placeholder="0" />
              </label>
            </div>
          </div>
        `).join("")}
        <div class="estimate-total-box">
          <div><span>공급가액</span><strong data-estimate-total="supplyTotal">${totals.supplyTotal.toLocaleString()}원</strong></div>
          <div><span>부가세</span><strong data-estimate-total="tax">${totals.tax.toLocaleString()}원</strong></div>
          <div class="estimate-grand-total"><span>합계금액</span><strong data-estimate-total="total">${totals.total.toLocaleString()}원</strong></div>
        </div>
      </div>
      <table class="table estimate-print-items print-only" style="margin-top:16px">
        <thead><tr><th>품명</th><th style="width:90px">수량</th><th style="width:150px">공급가액</th></tr></thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <td>${escapeHtml([item.name, item.spec].filter(Boolean).join(" / "))}</td>
              <td>${escapeHtml(item.qty || 1)}</td>
              <td>${estimateLineTotal(item).toLocaleString()}원</td>
            </tr>
          `).join("")}
          <tr><th colspan="2">공급가액</th><td><strong>${totals.supplyTotal.toLocaleString()}원</strong></td></tr>
          <tr><th colspan="2">부가세</th><td><strong>${totals.tax.toLocaleString()}원</strong></td></tr>
          <tr class="estimate-total"><th colspan="2">합계금액</th><td><strong>${totals.total.toLocaleString()}원</strong></td></tr>
        </tbody>
      </table>
      <div class="estimate-note">
        ${textarea("estimateNote", "비고", job.estimateNote || "상기 견적은 현장 상황 및 추가 작업 범위에 따라 변경될 수 있습니다.", "비고")}
      </div>
      <div class="estimate-sign">공급자 확인: ${escapeHtml(PROVIDER.owner)} ${stampSealImage("stamp-seal")}</div>
    </section>
    <section class="panel pdf-preview-panel estimate-preview-panel">
      <div class="section-head compact">
        <div>
          <h2>견적서 출력 미리보기</h2>
          <p class="muted">현장 화면에서 인쇄 결과를 확인하고 PDF 다운로드를 다시 실행할 수 있습니다.</p>
        </div>
        <button class="btn ghost" data-action="download-estimate-pdf">인쇄창 다시 열기</button>
      </div>
      <div class="pdf-preview-page">${buildEstimatePrintHtml(job)}</div>
    </section>
  `;
}

function renderQuickJobList() {
  const query = state.quickListQuery || "";
  const allJobs = visibleJobs().sort((a, b) => `${b.date || ""}${b.createdAt || ""}`.localeCompare(`${a.date || ""}${a.createdAt || ""}`));
  const jobs = allJobs
    .filter((job) => matchesQuickJobSearch(job, query))
    .sort((a, b) => `${b.date || ""}${b.createdAt || ""}`.localeCompare(`${a.date || ""}${a.createdAt || ""}`));
  const month = state.quickListMonth || new Date().toISOString().slice(0, 7);
  const selectedDate = state.quickListSelectedDate || "";
  const selectedJobs = selectedDate ? allJobs.filter((job) => job.date === selectedDate) : [];
  return `
    <div class="quick-list-backdrop">
      <section class="quick-list-box">
        <div class="quick-list-head">
          <div>
            <h2>작업 리스트</h2>
            <p class="muted">Google Drive에서 불러온 작업을 달력과 검색으로 확인합니다.</p>
          </div>
          <div class="quick-list-actions">
            <button class="btn primary" data-action="import-google-jobs">구글에서 불러오기</button>
            <button class="btn ghost" data-action="close-quick-list">닫기</button>
          </div>
        </div>
        <div class="quick-list-search">
          <input data-quick-list-search value="${escapeAttr(query)}" placeholder="주소, 아파트, 누수, 방수, 창틀방수, 옥상방수 등 검색" />
          <button class="btn primary" data-action="apply-quick-list-search">검색</button>
          <button class="btn ghost" data-action="clear-quick-list-search" ${query ? "" : "disabled"}>검색 지우기</button>
          <span class="muted">검색 결과 ${jobs.length}건</span>
        </div>
        ${query ? renderQuickSearchResults(jobs) : renderQuickCalendar(allJobs, month, selectedDate, selectedJobs)}
      </section>
    </div>
  `;
}

function renderQuickSearchResults(jobs) {
  return `
    <div class="quick-result-panel">
      <h3>검색 결과</h3>
      ${renderQuickJobItems(jobs)}
    </div>
  `;
}

function renderQuickCalendar(jobs, month, selectedDate, selectedJobs) {
  const counts = jobs.reduce((map, job) => {
    if (!job.date || !job.date.startsWith(month)) return map;
    map[job.date] = (map[job.date] || 0) + 1;
    return map;
  }, {});
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(year, monthNumber - 1, 1);
  const lastDate = new Date(year, monthNumber, 0).getDate();
  const leading = first.getDay();
  const cells = [];
  for (let i = 0; i < leading; i += 1) cells.push(null);
  for (let day = 1; day <= lastDate; day += 1) cells.push(`${month}-${String(day).padStart(2, "0")}`);
  while (cells.length % 7) cells.push(null);
  return `
    <div class="quick-calendar-panel">
      <div class="quick-calendar-head">
        <button class="btn ghost" data-action="set-quick-list-month" data-month="${escapeAttr(shiftMonth(month, -1))}">이전달</button>
        <h3>${escapeHtml(month)}</h3>
        <button class="btn ghost" data-action="set-quick-list-month" data-month="${escapeAttr(shiftMonth(month, 1))}">다음달</button>
      </div>
      <div class="quick-calendar-weekdays">
        ${["일", "월", "화", "수", "목", "금", "토"].map((day) => `<b>${day}</b>`).join("")}
      </div>
      <div class="quick-calendar-grid">
        ${cells.map((date) => {
          if (!date) return `<div class="quick-calendar-day empty"></div>`;
          const count = counts[date] || 0;
          return `
            <button class="quick-calendar-day ${count ? "has-work" : ""} ${date === selectedDate ? "selected" : ""}" data-action="select-quick-date" data-date="${escapeAttr(date)}" ${count ? "" : "disabled"}>
              <span>${Number(date.slice(-2))}</span>
              ${count ? `<strong>${count}건</strong>` : ""}
            </button>
          `;
        }).join("")}
      </div>
      <div class="quick-date-results">
        <h3>${selectedDate ? `${escapeHtml(selectedDate)} 작업` : "날짜의 건수를 누르면 리스트가 열립니다"}</h3>
        ${selectedDate ? renderQuickJobItems(selectedJobs) : `<p class="muted">작업한 날짜에는 건수가 표시됩니다.</p>`}
      </div>
    </div>
  `;
}

function renderQuickJobItems(jobs) {
  return jobs.length ? `
    <div class="quick-list-items">
      ${jobs.map((job) => `
        <div class="quick-list-item ${job.id === state.currentJobId ? "active" : ""}">
          <button class="quick-list-main" data-action="select-job" data-id="${escapeAttr(job.id)}">
            <strong>${escapeHtml(job.address || "주소 미입력")}</strong>
            <span>${escapeHtml(job.date || "-")} · ${escapeHtml(job.customerName || job.phone || "이름/전화 없음")}</span>
          </button>
          <div class="quick-list-item-actions">
            <button class="btn primary" data-action="edit-quick-job" data-id="${escapeAttr(job.id)}">수정</button>
            <button class="btn warn" data-action="delete-quick-job" data-id="${escapeAttr(job.id)}">삭제</button>
          </div>
        </div>
      `).join("")}
    </div>
  ` : `<p class="muted">해당 작업이 없습니다.</p>`;
}

function visibleJobs() {
  const deleted = new Set(state.deletedJobIds || []);
  return state.jobs.filter((job) => job?.id && !deleted.has(job.id));
}

function shiftMonth(month, delta) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function extractApartmentGroup(address = "") {
  const text = String(address || "").trim();
  if (!text) return "아파트명 없음";
  const match = text.match(/[가-힣A-Za-z0-9·\-\s]+?(?:아파트|APT|apt|오피스텔|빌라|맨션|주공|자이|래미안|푸르지오|힐스테이트|더샵|롯데캐슬|아이파크)/);
  return match ? match[0].trim() : "아파트명 없음";
}

function matchesQuickJobSearch(job, query = "") {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  const searchText = buildQuickJobSearchText(job);
  const addressText = normalizeLooseSearchText([job.address, extractApartmentGroup(job.address)].join(" "));
  return expandSearchTerms(normalizedQuery).every((group) => group.some((term) => {
    const normalizedTerm = normalizeSearchText(term);
    const looseTerm = normalizeLooseSearchText(term);
    return searchText.includes(normalizedTerm) || (looseTerm.length >= 2 && addressText.includes(looseTerm));
  }));
}

function normalizeSearchText(value = "") {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function expandSearchTerms(query) {
  const rawTerms = normalizeSearchText(query).split(" ").filter(Boolean);
  return rawTerms.map((term) => {
    const related = QUICK_SEARCH_RELATED_TERMS.find((group) => group.some((item) => item.includes(term) || term.includes(item)));
    return related ? [...new Set([term, ...related.map(normalizeSearchText)])] : expandAddressLikeTerm(term);
  });
}

function expandAddressLikeTerm(term) {
  const normalized = normalizeSearchText(term);
  const loose = normalizeLooseSearchText(term);
  const parts = normalized.split(/[,\s]+/).filter((part) => part.length >= 2);
  const numericParts = normalized.match(/\d+/g) || [];
  return [...new Set([normalized, loose, ...parts, ...numericParts].filter(Boolean))];
}

function normalizeLooseSearchText(value = "") {
  return String(value).toLowerCase().replace(/[\s,.-]/g, "").trim();
}

const QUICK_SEARCH_RELATED_TERMS = [
  ["누수", "배관누수", "물샘", "물새", "누수확인", "누수의심", "청음", "탐지", "수압", "계량기"],
  ["방수", "화장실방수", "창틀방수", "옥상방수", "외벽방수", "우레탄", "실리콘", "코킹", "방수층", "유가"],
  ["창틀", "샷시", "새시", "창문", "창틀방수", "실리콘", "코킹"],
  ["옥상", "옥상방수", "우수관", "배수", "드레인", "루프드레인"],
  ["화장실", "욕실", "변기", "유가", "타일", "방수"],
  ["싱크대", "주방", "개수대", "수전", "배수관"],
  ["보일러", "온수", "난방", "배관", "분배기"],
  ["아파트", "apt", "주공", "자이", "래미안", "푸르지오", "힐스테이트", "더샵", "롯데캐슬", "아이파크"],
];

function buildQuickJobSearchText(job) {
  const checkText = [...(job.plumbingChecks || []), ...(job.waterproofChecks || [])]
    .map((check) => [check.title, check.guide, check.result, check.memo, check.done ? "점검완료" : ""].join(" "))
    .join(" ");
  const estimateText = (job.estimateItems || []).map((item) => [item.name, item.spec, item.cost].join(" ")).join(" ");
  const leakText = (job.leakAudioPoints || []).map((point) => [point.name, point.score, point.risk, point.metrics?.peakHz].join(" ")).join(" ");
  const v2Text = [
    job.somersLeakLevel,
    job.somersFrequency,
    job.somersOrangeMark,
    job.somersSuspectLocation,
    job.somersCaptureMemo,
    ...(job.somersPhotos || []),
    job.finalLeakLocation,
    job.excavationResult,
  ].join(" ");
  return normalizeSearchText([
    job.date,
    job.customerName,
    job.address,
    extractApartmentGroup(job.address),
    job.phone,
    job.situation,
    job.environment,
    job.report,
    job.blog,
    job.workSummary,
    checkText,
    estimateText,
    leakText,
    v2Text,
  ].join(" "));
}

async function importJobsFromGoogleDrive() {
  try {
    const config = googleConfig();
    if (!config.apiKey || !config.clientId) {
      state.googleSetupOpen = true;
      saveState();
      render();
      notify("먼저 Google Drive 저장 설정을 입력하세요.");
      return;
    }
    const token = await getGoogleAccessToken();
    const files = await listDriveJobDataFiles(token);
    if (!files.length) {
      notify("Google Drive에서 작업데이터.json 파일을 찾지 못했습니다.");
      return;
    }
    const jobs = [];
    for (const file of files) {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) continue;
      jobs.push(...extractJobsFromImportedData(await response.json()));
    }
    const count = mergeImportedJobs(jobs);
    if (state.jobs[0]?.date) {
      state.quickListMonth = state.jobs[0].date.slice(0, 7);
      state.quickListSelectedDate = state.jobs[0].date;
    }
    notify(`Google Drive에서 작업 ${count}개를 불러왔습니다.`);
  } catch (error) {
    console.error(error);
    notify(`Google Drive 불러오기 실패: ${driveErrorMessage(error)}`);
  }
}

async function listDriveJobDataFiles(token) {
  const query = "name contains '작업데이터.json' and trashed=false";
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,createdTime,modifiedTime)&orderBy=modifiedTime desc&pageSize=100`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return data.files || [];
}

function extractJobsFromImportedData(data) {
  if (!data) return [];
  if (Array.isArray(data.jobs)) return data.jobs;
  if (Array.isArray(data.state?.jobs)) return data.state.jobs;
  if (data.job) return [data.job];
  if (data.id && (data.date || data.address || data.customerName)) return [data];
  return [];
}

function mergeImportedJobs(importedJobs) {
  const deleted = new Set(state.deletedJobIds || []);
  const validJobs = importedJobs.filter((job) => job && (job.id || job.date || job.address || job.customerName));
  let added = 0;
  validJobs.forEach((job) => {
    const normalizedJob = {
      ...createJob(),
      ...job,
      id: job.id || `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      plumbingChecks: normalizeChecks(job.plumbingChecks || [], basePlumbingChecks),
      waterproofChecks: normalizeChecks(job.waterproofChecks || [], baseWaterproofChecks),
      estimateItems: Array.isArray(job.estimateItems) && job.estimateItems.length ? job.estimateItems : [{ name: "", cost: "" }],
      recordings: Array.isArray(job.recordings) ? job.recordings : [],
      photos: Array.isArray(job.photos) ? job.photos : [],
      photoFiles: Array.isArray(job.photoFiles) ? job.photoFiles : [],
      somersPhotos: Array.isArray(job.somersPhotos) ? job.somersPhotos : [],
      somersPhotoFiles: Array.isArray(job.somersPhotoFiles) ? job.somersPhotoFiles : [],
      leakAudioPoints: Array.isArray(job.leakAudioPoints) ? job.leakAudioPoints : [],
    };
    normalizeV2Fields(normalizedJob);
    if (deleted.has(normalizedJob.id)) return;
    const existingIndex = state.jobs.findIndex((existing) => existing.id === normalizedJob.id);
    if (existingIndex >= 0) {
      state.jobs[existingIndex] = { ...state.jobs[existingIndex], ...normalizedJob };
    } else {
      state.jobs.unshift(normalizedJob);
      added += 1;
    }
  });
  if (!state.currentJobId && state.jobs.length) state.currentJobId = state.jobs[0].id;
  state.quickListOpen = true;
  saveState();
  render();
  return added;
}

function field(id, label, type, value, placeholder = "", step = "", className = "") {
  return `
    <div class="field ${escapeAttr(className)}">
      <label for="${id}">${label}</label>
      <input id="${id}" data-job-field="${id}" type="${type}" value="${escapeAttr(value ?? "")}" placeholder="${escapeAttr(placeholder)}" ${step ? `step="${step}"` : ""} />
    </div>
  `;
}

function inlineField(id, value, placeholder = "") {
  return `<input class="inline-input" data-job-field="${id}" value="${escapeAttr(value || "")}" placeholder="${escapeAttr(placeholder)}" />`;
}

function blogKeywordField(id, label, value, placeholder = "") {
  return `
    <label class="keyword-input">
      <span>${escapeHtml(label)}</span>
      <input data-job-field="${id}" value="${escapeAttr(value || "")}" placeholder="${escapeAttr(placeholder)}" />
    </label>
  `;
}

function textarea(id, label, value, placeholder = "") {
  return `
    <div class="field">
      <label for="${id}">${label}</label>
      <textarea id="${id}" data-job-field="${id}" placeholder="${escapeAttr(placeholder)}">${escapeHtml(value || "")}</textarea>
    </div>
  `;
}

function metric(label, value, helper) {
  return `<div class="metric"><span class="muted">${label}</span><b>${value}</b><span class="muted">${helper}</span></div>`;
}

function fileBox(type, label) {
  const job = currentJob();
  const files = job[type] || [];
  const accept = type === "photos" ? ".jpg,.jpeg,.png,.webp,.heic,.heif" : "video/*";
  return `
    <div class="file-box">
      <span>${label}: ${files.length ? files.map(escapeHtml).join(", ") : "없음"}</span>
      <input data-file-type="${type}" type="file" accept="${accept}" multiple />
    </div>
  `;
}

function bindEvents() {
  app.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  app.querySelectorAll("[data-job-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const value = input.type === "number" ? Number(input.value) : input.value;
      const job = currentJob();
      job[input.dataset.jobField] = value;
      job.updatedAt = new Date().toISOString();
      saveState();
      if (input.dataset.jobField === "pressureLive") updatePressureDial(value);
    });
  });

  app.querySelectorAll("[data-check]").forEach((input) => {
    input.addEventListener("input", () => {
      const fieldName = input.dataset.field;
      const value = fieldName === "done" ? input.checked : input.value;
      updateCheck(input.dataset.checkType, input.dataset.check, { [fieldName]: value });
    });
  });

  app.querySelectorAll("[data-estimate]").forEach((input) => {
    input.addEventListener("input", () => {
      const job = currentJob();
      const item = job.estimateItems[Number(input.dataset.estimate)];
      item[input.dataset.field] = input.value;
      if (input.dataset.field === "name") item.spec = "";
      if (input.dataset.field === "name") resizeEstimateNameInput(input);
      maybeAddEstimateRow(input);
      job.updatedAt = new Date().toISOString();
      saveState();
      updateEstimateTotalsInPlace();
    });
  });

  app.querySelectorAll("[data-file-type]").forEach((input) => {
    input.addEventListener("change", async () => {
      const job = currentJob();
      const files = Array.from(input.files || []);
      const fileType = input.dataset.fileType;
      job[fileType] = files.map((file) => file.name);
      if (fileType === "photos") {
        job.photoFiles = await filesToPrintableImages(files);
      }
      if (fileType === "somersPhotos") {
        job.somersPhotoFiles = await filesToPrintableImages(files);
      }
      saveState();
      render();
    });
  });

  app.querySelectorAll("[data-drive-pick]").forEach((input) => {
    input.addEventListener("change", () => {
      if (!driveSaveDraft) return;
      const files = Array.from(input.files || []);
      if (input.dataset.drivePick === "photos") driveSaveDraft.photoFiles = files;
      if (input.dataset.drivePick === "recordings") driveSaveDraft.recordingFiles = files;
      render();
    });
  });

  const quickSearch = app.querySelector("[data-quick-list-search]");
  if (quickSearch) {
    quickSearch.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      applyQuickListSearch();
    });
  }

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action, button.dataset));
  });

  app.querySelectorAll("[data-format]").forEach((button) => {
    button.addEventListener("click", () => applyBlogFormat(button.dataset.format));
  });

  app.querySelectorAll("[data-format-block]").forEach((button) => {
    button.addEventListener("click", () => applyBlogBlock(button.dataset.formatBlock));
  });

  app.querySelectorAll("[data-emoji]").forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => insertBlogEmoji(button.dataset.emoji));
  });

  const blogEditor = app.querySelector("#blogEditor");
  if (blogEditor) {
    ["keyup", "mouseup", "touchend", "input"].forEach((eventName) => {
      blogEditor.addEventListener(eventName, saveBlogSelection);
    });
  }

  bindSwipeNavigation();
}

function applyQuickListSearch() {
  const input = app.querySelector("[data-quick-list-search]");
  state.quickListQuery = input?.value.trim() || "";
  saveState();
  render();
}

async function pickContactPhone() {
  if (!navigator.contacts?.select) {
    notify("이 브라우저는 연락처 선택을 지원하지 않습니다. 전화번호를 직접 입력하세요.");
    return;
  }
  try {
    const contacts = await navigator.contacts.select(["name", "tel"], { multiple: false });
    const selected = contacts?.[0];
    const tel = selected?.tel?.[0] || "";
    if (!tel) {
      notify("선택한 연락처에 전화번호가 없습니다.");
      return;
    }
    const job = currentJob();
    job.phone = tel;
    if (!job.customerName && selected.name?.[0]) job.customerName = selected.name[0];
    saveState();
    render();
    notify("연락처 전화번호를 입력했습니다.");
  } catch (error) {
    notify("연락처 선택을 취소했거나 브라우저가 차단했습니다.");
  }
}

function saveGoogleSettingsFromForm() {
  const config = googleConfig();
  const apiKey = app.querySelector("[data-google-setting='apiKey']")?.value.trim() || "";
  const clientId = app.querySelector("[data-google-setting='clientId']")?.value.trim() || "";
  if (!apiKey || !clientId) {
    notify("Google API Key와 OAuth Client ID를 모두 입력하세요.");
    return false;
  }
  state.googleDrive = {
    ...config,
    apiKey,
    clientId,
    folderName: config.folderName || "WaterLeak Multi Check",
  };
  state.googleSetupOpen = false;
  saveGoogleConfigOnly();
  saveState();
  return true;
}

function bindSwipeNavigation() {
  const content = app.querySelector(".content");
  if (!content) return;
  let startX = 0;
  let startY = 0;
  let tracking = false;
  const ignored = "button,input,textarea,select,option,label,a,canvas,.map-canvas,.estimate-name";

  content.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1 || event.target.closest(ignored)) return;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    tracking = true;
  }, { passive: true });

  content.addEventListener("touchend", (event) => {
    if (!tracking || event.changedTouches.length !== 1) return;
    tracking = false;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    if (Math.abs(deltaX) < 70 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
    moveView(deltaX < 0 ? 1 : -1);
  }, { passive: true });
}

function handleAction(action, data) {
  const job = currentJob();
  if (action === "save") {
    saveState();
    saveCurrentJobToGoogleDrive({ askMedia: false });
  }
  if (action === "new-job") {
    const next = createJob();
    state.jobs.unshift(next);
    state.currentJobId = next.id;
    state.activeView = "dashboard";
    state.quickListOpen = false;
    saveState();
    render();
  }
  if (action === "toggle-quick-list") {
    state.quickListOpen = !state.quickListOpen;
    saveState();
    render();
  }
  if (action === "import-google-jobs") importJobsFromGoogleDrive();
  if (action === "apply-quick-list-search") applyQuickListSearch();
  if (action === "clear-quick-list-search") {
    state.quickListQuery = "";
    saveState();
    render();
  }
  if (action === "set-quick-list-month") {
    state.quickListMonth = data.month;
    state.quickListSelectedDate = "";
    saveState();
    render();
  }
  if (action === "select-quick-date") {
    state.quickListSelectedDate = data.date;
    saveState();
    render();
  }
  if (action === "close-quick-list") {
    state.quickListOpen = false;
    saveState();
    render();
  }
  if (action === "hard-refresh") hardRefreshApp();
  if (action === "show-app-map") openExternalMap(job.address, "kakao");
  if (action === "pick-contact-phone") pickContactPhone();
  if (action === "google-drive-save") saveCurrentJobToGoogleDrive();
  if (action === "save-google-settings" && saveGoogleSettingsFromForm()) saveCurrentJobToGoogleDrive();
  if (action === "continue-google-drive-save") continueGoogleDriveSave();
  if (action === "cancel-google-drive-save") {
    driveSaveDraft = null;
    render();
    notify("Google Drive 선택 업로드를 취소했습니다.");
  }
  if (action === "clear-field") clearField(data.field);
  if (action === "clear-check") clearCheckMemo(data.checkType, data.check);
  if (action === "record-field") toggleRecording({ kind: "field", field: data.field });
  if (action === "record-check") toggleRecording({ kind: "check", type: data.checkType, id: data.check });
  if (action === "record-tracker") toggleRecording({ kind: "tracker" });
  if (action === "pause-recording") {
    const target = data.field ? { kind: "field", field: data.field } : { kind: "check", type: data.checkType, id: data.check };
    togglePauseRecording(target);
  }
  if (action === "play-recording") playRecording(data.recordingId);
  if (action === "delete-recording") deleteRecording(data.recordingId);
  if (action === "reset-checks") {
    if (data.type === "all") {
      job.plumbingChecks = createChecks(basePlumbingChecks);
      job.waterproofChecks = createChecks(baseWaterproofChecks);
    } else {
      job[data.type] = createChecks(data.type === "plumbingChecks" ? basePlumbingChecks : baseWaterproofChecks);
    }
    saveState();
    render();
  }
  if (action === "start-spectrum") startSpectrum();
  if (action === "stop-spectrum") stopSpectrum();
  if (action === "save-leak-point") saveLeakAudioPoint();
  if (action === "delete-leak-point") deleteLeakAudioPoint(data.id);
  if (action === "save-tracker") notify("추적 데이터가 현재 작업에 저장되었습니다.");
  if (action === "clear-tracker") notify("화면 그래프 로그를 삭제했습니다.");
  if (action === "generate-report") updateJob({ report: generateReport(job) });
  if (action === "download-report-pdf") openPdfPrintWindow("report");
  if (action === "clear-report" || action === "delete-report") updateJob({ report: "" });
  if (action === "generate-blog") updateJob({ blog: buildBlogPrompt(job) });
  if (action === "copy-blog-prompt") copyBlogPrompt(job);
  if (action === "open-chatgpt") openChatGptWithPrompt(job);
  if (action === "clear-blog-data") clearBlogData();
  if (action === "toggle-custom-blog") {
    state.blogCustomOpen = !state.blogCustomOpen;
    saveState();
    render();
  }
  if (action === "copy-custom-blog-prompt") copyBlogPrompt(job, true);
  if (action === "open-chatgpt-custom") openChatGptWithPrompt(job, true);
  if (action === "open-blog-editor") {
    state.blogEditorOpen = true;
    saveState();
    render();
  }
  if (action === "close-blog-editor") {
    state.blogEditorOpen = false;
    saveState();
    render();
  }
  if (action === "save-blog-editor") saveBlogEditor();
  if (action === "clear-blog-editor") clearBlogEditor();
  if (action === "print-blog") printBlogPreview();
  if (action === "copy-blog-editor") copyBlogEditor();
  if (action === "toggle-emoji-picker") toggleEmojiPicker();
  if (action === "open-external-link") openExternalLink(data.url);
  if (action === "toggle-estimate-title") toggleEstimateTitle();
  if (action === "set-estimate-vat") setEstimateVatMode(data.mode);
  if (action === "add-estimate") {
    job.estimateItems.push({ name: "", spec: "", qty: 1, unit: "식", unitPrice: "", cost: "" });
    saveState();
    render();
  }
  if (action === "remove-estimate") {
    job.estimateItems.splice(Number(data.index), 1);
    if (!job.estimateItems.length) job.estimateItems.push({ name: "", cost: "" });
    saveState();
    render();
  }
  if (action === "print") window.print();
  if (action === "download-estimate-pdf") openPdfPrintWindow("estimate");
  if (action === "select-job" || action === "edit-quick-job") openQuickJob(data.id);
  if (action === "delete-quick-job") deleteQuickJob(data.id);
}

function openQuickJob(id) {
  if (!state.jobs.some((item) => item.id === id)) {
    notify("작업 데이터를 찾지 못했습니다.");
    return;
  }
  state.currentJobId = id;
  state.activeView = "dashboard";
  state.quickListOpen = false;
  saveState();
  render();
}

function deleteQuickJob(id) {
  const job = state.jobs.find((item) => item.id === id);
  if (!job) {
    notify("삭제할 작업을 찾지 못했습니다.");
    return;
  }
  const label = [job.date, job.address || job.customerName || "주소 미입력"].filter(Boolean).join(" · ");
  if (!confirm(`${label}\n\n이 작업을 리스트에서 삭제할까요?\nGoogle Drive 원본 파일은 지우지 않고, 앱 목록에서만 숨깁니다.`)) return;
  state.deletedJobIds = [...new Set([...(state.deletedJobIds || []), id])];
  state.jobs = state.jobs.filter((item) => item.id !== id);
  if (state.currentJobId === id) {
    const next = visibleJobs()[0] || createJob();
    if (!state.jobs.some((item) => item.id === next.id)) state.jobs.unshift(next);
    state.currentJobId = next.id;
    state.activeView = "dashboard";
  }
  saveState();
  render();
  notify("작업 리스트에서 숨김 처리했습니다. Google Drive 원본은 그대로 둡니다.");
}

function openExternalMap(address, provider = "kakao") {
  if (!address) {
    notify("주소를 먼저 입력하세요.");
    return;
  }
  const encoded = encodeURIComponent(address);
  window.open(`https://map.kakao.com/link/search/${encodeURIComponent(address)}`, "_blank");
}

function googleConfig() {
  state.googleDrive = {
    apiKey: "",
    clientId: "",
    folderId: "",
    folderName: "WaterLeak Multi Check",
    ...(state.googleDrive || {}),
  };
  return state.googleDrive;
}

function driveStatusText() {
  const config = googleConfig();
  if (!config.clientId || !config.apiKey) return "처음 저장 때 설정";
  if (!config.folderId) return `저장 시 폴더 자동 생성 · ${config.folderName || "WaterLeak Multi Check"}`;
  return `연결됨 · ${config.folderName || "WaterLeak Multi Check"}`;
}

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-google-identity]");
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", () => reject(new Error("Google 로그인 스크립트를 불러오지 못했습니다. 인터넷 연결, 광고차단, 승인된 JavaScript 원본을 확인하세요.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.dataset.googleIdentity = "true";
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Google 로그인 스크립트를 불러오지 못했습니다. 인터넷 연결, 광고차단, 승인된 JavaScript 원본을 확인하세요."));
    document.head.appendChild(script);
  });
}

async function getGoogleAccessToken() {
  const config = googleConfig();
  if (!config.clientId || !config.apiKey) {
    notify("처음 저장을 위해 Google API Key와 OAuth Client ID를 입력하세요.");
    throw new Error("Missing Google Drive settings");
  }
  if (googleAccessToken) return googleAccessToken;
  await loadGoogleIdentityScript();
  return new Promise((resolve, reject) => {
    googleTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: config.clientId,
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        googleAccessToken = response.access_token;
        resolve(googleAccessToken);
      },
    });
    googleTokenClient.requestAccessToken({ prompt: "consent" });
  });
}

async function createGoogleDriveFolder() {
  const config = googleConfig();
  const token = await getGoogleAccessToken();
  const folder = await ensureMainDriveFolder(token, config);
  state.googleDrive = { ...config, folderId: folder.id, folderName: folder.name };
  saveState();
  render();
  notify(`Google Drive 주 폴더 연결 완료: ${folder.name}`);
  return folder;
}

async function ensureMainDriveFolder(token, config) {
  if (config.folderId) {
    const existing = await getDriveFolderById(token, config.folderId);
    if (existing) return existing;
  }
  return ensureDriveFolder(token, config.folderName || "WaterLeak Multi Check", null);
}

async function getDriveFolderById(token, folderId) {
  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(folderId)}?fields=id,name,mimeType,trashed`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (response.status === 403 || response.status === 404) return null;
  if (!response.ok) throw new Error(await response.text());
  const file = await response.json();
  if (file.trashed || file.mimeType !== "application/vnd.google-apps.folder") return null;
  return file;
}

async function ensureDriveFolder(token, name, parentId) {
  const escapedName = String(name).replaceAll("\\", "\\\\").replaceAll("'", "\\'");
  const parentQuery = parentId ? ` and '${parentId}' in parents` : "";
  const query = `name='${escapedName}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentQuery}`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink,createdTime)&orderBy=createdTime&pageSize=10`;
  const searchResponse = await fetch(searchUrl, { headers: { Authorization: `Bearer ${token}` } });
  if (!searchResponse.ok) throw new Error(await searchResponse.text());
  const found = await searchResponse.json();
  if (found.files?.length) return found.files[0];

  const body = {
    name,
    mimeType: "application/vnd.google-apps.folder",
  };
  if (parentId) body.parents = [parentId];
  const response = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function saveCurrentJobToGoogleDrive(options = {}) {
  try {
    const askMedia = options.askMedia !== false;
    const config = googleConfig();
    if (!config.apiKey || !config.clientId) {
      state.googleSetupOpen = true;
      saveState();
      render();
      notify("화면 아래 Google Drive 저장 설정에 키를 붙여넣으세요.");
      return;
    }
    state.googleSetupOpen = false;
    saveState();
    if (askMedia) {
      driveSaveDraft = {
        active: true,
        wantPhotos: true,
        wantRecordings: true,
        photoFiles: [],
        recordingFiles: [],
        prepared: null,
      };
      render();
      notify("사진/녹음 파일을 선택하거나, 바로 오늘작업저장을 누르세요.");
      return;
    }
    const prepared = await prepareGoogleDriveSave(false, false);
    const somersText = prepared.somersPhotoCount ? ` · 소머즈 ${prepared.somersPhotoCount}개` : "";
    notify(`Google Drive 저장 완료: ${prepared.yearFolder.name}/${prepared.monthFolder.name}/${prepared.dateFolder.name} · PDF 2개 · 작업데이터 1개${somersText}`);
  } catch (error) {
    notify(`Google Drive 저장 실패: ${driveErrorMessage(error)}`);
    console.error(error);
  }
}

async function continueGoogleDriveSave() {
  if (!driveSaveDraft?.active) return;
  const photoFiles = driveSaveDraft.photoFiles || [];
  const recordingFiles = driveSaveDraft.recordingFiles || [];
  const prepared = await prepareGoogleDriveSave(photoFiles.length > 0, recordingFiles.length > 0);
  driveSaveDraft = null;
  render();
  await uploadSelectedDriveMedia(prepared, photoFiles, recordingFiles);
}

async function prepareGoogleDriveSave(wantPhotos, wantRecordings) {
  const token = await getGoogleAccessToken();
  const mainFolder = await ensureMainDriveFolder(token, googleConfig());
  state.googleDrive = { ...googleConfig(), folderId: mainFolder.id, folderName: mainFolder.name };
  saveState();
  const job = currentJob();
  const dateValue = job.date || new Date().toISOString().slice(0, 10);
  const year = dateValue.slice(0, 4) || new Date().getFullYear().toString();
  const month = dateValue.slice(0, 7) || `${year}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const yearFolder = await ensureDriveFolder(token, year, mainFolder.id);
  const monthFolder = await ensureDriveFolder(token, month, yearFolder.id);
  const dateFolder = await ensureDriveFolder(token, dateValue, monthFolder.id);
  const baseName = safeFileName(job.address || "주소미입력");
  const reportBlob = await createDocumentPdfBlob("report", job);
  const estimateBlob = await createDocumentPdfBlob("estimate", job);
  await uploadBlobToDrive(token, dateFolder.id, `${baseName}-소견서.pdf`, reportBlob, "application/pdf");
  await uploadBlobToDrive(token, dateFolder.id, `${baseName}-견적서.pdf`, estimateBlob, "application/pdf");
  const dataBlob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), job }, null, 2)], { type: "application/json" });
  await uploadBlobToDrive(token, dateFolder.id, `${baseName}-작업데이터.json`, dataBlob, "application/json");
  const somersPhotoCount = await uploadStoredSomersPhotosToDrive(token, dateFolder.id, baseName, job);
  const photoFolder = wantPhotos ? await ensureDriveFolder(token, "사진", dateFolder.id) : null;
  const recordingFolder = wantRecordings ? await ensureDriveFolder(token, "녹음", dateFolder.id) : null;
  return { token, yearFolder, monthFolder, dateFolder, baseName, photoFolder, recordingFolder, somersPhotoCount };
}

async function uploadStoredSomersPhotosToDrive(token, dateFolderId, baseName, job) {
  const somersPhotos = Array.isArray(job.somersPhotoFiles) ? job.somersPhotoFiles.filter((photo) => photo?.dataUrl) : [];
  if (!somersPhotos.length) return 0;
  const somersFolder = await ensureDriveFolder(token, "소머즈", dateFolderId);
  let count = 0;
  for (const [index, photo] of somersPhotos.entries()) {
    const blob = await dataUrlToBlob(photo.dataUrl);
    const name = `${baseName}-소머즈-${safeFileName(photo.name || `capture-${index + 1}.jpg`)}`;
    await uploadBlobToDrive(token, somersFolder.id, name, blob, blob.type || "image/jpeg");
    count += 1;
  }
  return count;
}

async function uploadSelectedDriveMedia(prepared, photoFiles, recordingFiles) {
  try {
    const token = prepared?.token || await getGoogleAccessToken();
    let photoCount = 0;
    let recordingCount = 0;
    if (photoFiles.length && prepared?.photoFolder) {
      for (const file of photoFiles) {
        await uploadBlobToDrive(token, prepared.photoFolder.id, `${prepared.baseName}-${safeFileName(file.name || "photo")}`, file, file.type || "image/jpeg");
        photoCount += 1;
      }
    }
    if (recordingFiles.length && prepared?.recordingFolder) {
      for (const file of recordingFiles) {
        await uploadBlobToDrive(token, prepared.recordingFolder.id, `${prepared.baseName}-${safeFileName(file.name || "recording")}`, file, file.type || "audio/wav");
        recordingCount += 1;
      }
    }
    const somersText = prepared.somersPhotoCount ? ` · 소머즈 ${prepared.somersPhotoCount}개` : "";
    notify(`Google Drive 저장 완료: ${prepared.dateFolder.name} 폴더 · 사진 ${photoCount}개 · 녹음 ${recordingCount}개${somersText}`);
  } catch (error) {
    notify(`Google Drive 업로드 실패: ${driveErrorMessage(error)}`);
    console.error(error);
  }
}

function clearRecordingDatabase() {
  return new Promise((resolve) => {
    const request = indexedDB.deleteDatabase(RECORDING_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  });
}

function driveErrorMessage(error) {
  if (error instanceof Event) {
    return "브라우저가 Google 요청을 차단했습니다. 팝업 허용, 광고차단 해제, OAuth 승인된 JavaScript 원본을 확인하세요.";
  }
  const message = String(error?.message || error || "알 수 없는 오류");
  if (message === "[object Event]") {
    return "브라우저가 Google 요청을 차단했습니다. 팝업 허용, 광고차단 해제, OAuth 승인된 JavaScript 원본을 확인하세요.";
  }
  try {
    const parsed = JSON.parse(message);
    return parsed.error?.message || parsed.message || message;
  } catch {
    return message.slice(0, 180);
  }
}

async function uploadBlobToDrive(token, folderId, name, blob, mimeType) {
  const boundary = `waterleak_${Date.now()}`;
  const metadata = { name, parents: [folderId], mimeType };
  const body = new Blob([
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify(metadata),
    `--${boundary}`,
    `Content-Type: ${mimeType}`,
    "",
    blob,
    "",
    `--${boundary}--`,
  ].map((part) => part instanceof Blob ? part : `${part}\r\n`), { type: `multipart/related; boundary=${boundary}` });
  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function createDocumentPdfBlob(type, job) {
  const pages = type === "report" ? buildReportPdfPages(job) : buildEstimatePdfPages(job);
  const images = [];
  for (const lines of pages) {
    images.push(await renderPdfPageImage(lines));
  }
  return buildImagePdf(images);
}

function buildReportPdfPages(job) {
  const report = reportContentForDocument(job.report || generateReport(job));
  return paginatePdfLines([
    { text: "누수진단 소견서", size: 32, bold: true, align: "center", gap: 18 },
    { text: `진단일자: ${job.date || ""}`, size: 16 },
    { text: `고객 이름: ${job.customerName || ""}`, size: 16 },
    { text: `현장주소: ${job.address || ""}`, size: 16 },
    { text: `연락처: ${job.phone || ""}`, size: 16 },
    { text: `공급자: ${PROVIDER.name} / ${PROVIDER.bizNo}`, size: 16 },
    { text: `공급자 주소: ${PROVIDER.address}`, size: 16, gap: 18 },
    { text: "소견 내용", size: 20, bold: true, gap: 8 },
    ...String(report).split("\n").map((text) => ({ text, size: 15 })),
    { text: "", size: 10, gap: 20 },
    { text: `공급자 확인: ${PROVIDER.owner} (인)`, size: 17, align: "right" },
  ]);
}

function buildEstimatePdfPages(job) {
  const items = job.estimateItems || [];
  const totals = estimateTotals(job);
  return paginatePdfLines([
    { text: job.estimateDocTitle || "견 적 서", size: 32, bold: true, align: "center", gap: 18 },
    { text: `견적일자: ${job.date || ""}`, size: 16 },
    { text: `견적번호: ${job.estimateNo || `WL-${(job.date || "").replaceAll("-", "")}`}`, size: 16 },
    { text: `수신: ${job.customerName || ""}`, size: 16 },
    { text: `수신 주소: ${job.address || ""}`, size: 16 },
    { text: `전화번호: ${job.phone || ""}`, size: 16 },
    { text: `공급자: ${PROVIDER.name} / ${PROVIDER.bizNo}`, size: 16 },
    { text: `공급자 주소: ${PROVIDER.address}`, size: 16, gap: 18 },
    { text: "품명 및 금액", size: 20, bold: true, gap: 8 },
    ...items.map((item, index) => ({
      text: `${index + 1}. ${[item.name, item.spec].filter(Boolean).join(" / ") || "품명 미입력"} - ${estimateLineTotal(item).toLocaleString()}원`,
      size: 15,
    })),
    { text: "", size: 10, gap: 12 },
    { text: `공급가액: ${totals.supplyTotal.toLocaleString()}원`, size: 17, align: "right" },
    { text: `부가세: ${totals.tax.toLocaleString()}원`, size: 17, align: "right" },
    { text: `합계금액: ${totals.total.toLocaleString()}원`, size: 20, bold: true, align: "right", gap: 16 },
    { text: `비고: ${job.estimateNote || "상기 견적은 현장 상황 및 추가 작업 범위에 따라 변경될 수 있습니다."}`, size: 15 },
    { text: `공급자 확인: ${PROVIDER.owner} (인)`, size: 17, align: "right", gap: 18 },
  ]);
}

function paginatePdfLines(lines) {
  const pages = [[]];
  let y = 0;
  lines.forEach((line) => {
    const height = (line.size || 15) * 1.6 + (line.gap || 3);
    if (y + height > 1480 && pages[pages.length - 1].length) {
      pages.push([]);
      y = 0;
    }
    pages[pages.length - 1].push(line);
    y += height;
  });
  return pages;
}

async function renderPdfPageImage(lines) {
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111827";
  let y = 110;
  lines.forEach((line) => {
    const size = line.size || 15;
    ctx.font = `${line.bold ? "700" : "400"} ${size * 2}px "Malgun Gothic", Arial, sans-serif`;
    ctx.textAlign = line.align || "left";
    const x = line.align === "center" ? canvas.width / 2 : line.align === "right" ? canvas.width - 90 : 90;
    const maxWidth = line.align ? 1060 : 1060;
    const wrapped = wrapCanvasText(ctx, line.text || " ", maxWidth);
    wrapped.forEach((text) => {
      ctx.fillText(text, x, y);
      y += size * 2.7;
    });
    y += line.gap || 6;
  });
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  return { bytes: await blob.arrayBuffer(), width: 595.28, height: 841.89 };
}

function wrapCanvasText(ctx, text, maxWidth) {
  const words = String(text).split(/(\s+)/);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trimEnd());
      line = word.trimStart();
    } else {
      line = test;
    }
  });
  lines.push(line || " ");
  return lines;
}

function buildImagePdf(images) {
  const parts = [];
  const offsets = [];
  let offset = 0;
  const add = (part) => {
    parts.push(part);
    offset += typeof part === "string" ? part.length : part.byteLength;
  };
  const addObject = (id, bodyParts) => {
    offsets[id] = offset;
    add(`${id} 0 obj\n`);
    bodyParts.forEach(add);
    add("\nendobj\n");
  };
  add("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");
  const pageIds = images.map((_, index) => 3 + index * 3);
  addObject(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
  addObject(2, [`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${images.length} >>`]);
  images.forEach((image, index) => {
    const pageId = 3 + index * 3;
    const contentId = pageId + 1;
    const imageId = pageId + 2;
    const imageName = `Im${index + 1}`;
    const command = `q\n595.28 0 0 841.89 0 0 cm\n/${imageName} Do\nQ`;
    addObject(pageId, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`]);
    addObject(contentId, [`<< /Length ${command.length} >>\nstream\n${command}\nendstream`]);
    addObject(imageId, [
      `<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.byteLength} >>\nstream\n`,
      new Uint8Array(image.bytes),
      "\nendstream",
    ]);
  });
  const xref = offset;
  add(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  for (let i = 1; i < offsets.length; i += 1) add(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  add(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts, { type: "application/pdf" });
}

function safeFileName(value) {
  return String(value).replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_").slice(0, 60);
}

async function toggleRecording(target = { kind: "situation" }) {
  if (wavRecorder?.recording) {
    await stopWavRecording();
    notify("녹음 저장완료.");
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordingTarget = target;
    await startWavRecording(stream);
    render();
    notify("녹음 중입니다.");
  } catch (error) {
    notify("마이크 권한이 필요합니다. 브라우저 권한 허용, USB-C 오디오 캡처 연결, HTTPS/로컬 실행 상태를 확인하세요.");
  }
}

function togglePauseRecording(target) {
  if (!wavRecorder?.recording || targetKey(recordingTarget) !== targetKey(target)) {
    notify("진행 중인 녹음이 없습니다.");
    return;
  }
  wavRecorder.paused = !wavRecorder.paused;
  render();
  notify(wavRecorder.paused ? "녹음 일시정지." : "녹음 이어서 진행.");
}

async function startWavRecording(stream) {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(4096, 1, 1);
  const samples = [];
  processor.onaudioprocess = (event) => {
    if (!wavRecorder?.recording || wavRecorder.paused) return;
    samples.push(new Float32Array(event.inputBuffer.getChannelData(0)));
  };
  source.connect(processor);
  processor.connect(context.destination);
  wavRecorder = {
    context,
    source,
    processor,
    samples,
    sampleRate: context.sampleRate,
    stream,
    recording: true,
    paused: false,
  };
}

async function stopWavRecording() {
  if (!wavRecorder) return;
  const recorder = wavRecorder;
  recorder.recording = false;
  recorder.processor.disconnect();
  recorder.source.disconnect();
  recorder.stream.getTracks().forEach((track) => track.stop());
  await recorder.context.close();
  const blob = createWavBlob(recorder.samples, recorder.sampleRate);
  const savedName = saveBlobFile(blob, "wav");
  const target = recordingTarget || { kind: "situation" };
  const recording = {
    id: `rec-${Date.now()}`,
    name: savedName,
    targetKey: targetKey(target),
    target,
    type: "audio/wav",
    createdAt: new Date().toISOString(),
  };
  await putRecordingBlob(recording.id, blob);
  const job = currentJob();
  job.recordings = [...(job.recordings || []).filter((item) => item.targetKey !== recording.targetKey), recording];
  recordingTarget = null;
  wavRecorder = null;
  saveState();
  render();
}

function targetKey(target = {}) {
  if (!target) return "";
  if (target.kind === "tracker") return "tracker";
  if (target.kind === "check") return `check:${target.type || ""}:${target.id || ""}`;
  if (target.kind === "field") return `field:${target.field || "situation"}`;
  return "field:situation";
}

function getLastRecordingForTarget(target) {
  const key = targetKey(target);
  const recordings = currentJob().recordings || [];
  return [...recordings].reverse().find((item) => item.targetKey === key);
}

async function playRecording(id) {
  if (!id) return;
  try {
    const blob = await getRecordingBlob(id);
    if (!blob) {
      notify("녹음 파일을 찾지 못했습니다.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.addEventListener("ended", () => URL.revokeObjectURL(url), { once: true });
    await audio.play();
    notify("녹음 재생 중입니다.");
  } catch (error) {
    notify("녹음을 재생하지 못했습니다.");
  }
}

async function deleteRecording(id) {
  if (!id) return;
  const job = currentJob();
  job.recordings = (job.recordings || []).filter((item) => item.id !== id);
  await deleteRecordingBlob(id);
  saveState();
  render();
  notify("녹음이 삭제되었습니다.");
}

function openRecordingDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(RECORDING_DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("recordings");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putRecordingBlob(id, blob) {
  const db = await openRecordingDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("recordings", "readwrite");
    tx.objectStore("recordings").put(blob, id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function getRecordingBlob(id) {
  const db = await openRecordingDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("recordings", "readonly");
    const request = tx.objectStore("recordings").get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function deleteRecordingBlob(id) {
  const db = await openRecordingDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("recordings", "readwrite");
    tx.objectStore("recordings").delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

function createWavBlob(buffers, sampleRate) {
  const totalLength = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
  const pcm = new Int16Array(totalLength);
  let offset = 0;
  buffers.forEach((buffer) => {
    for (let i = 0; i < buffer.length; i += 1) {
      const sample = Math.max(-1, Math.min(1, buffer[i]));
      pcm[offset] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      offset += 1;
    }
  });
  const wav = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(wav);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, pcm.length * 2, true);
  let dataOffset = 44;
  for (let i = 0; i < pcm.length; i += 1) {
    view.setInt16(dataOffset, pcm[i], true);
    dataOffset += 2;
  }
  return new Blob([view], { type: "audio/wav" });
}

function writeAscii(view, offset, text) {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

function saveBlobFile(blob, extension) {
  const date = new Date();
  const stamp = `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}-${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`;
  const filename = `waterleak-recording-${stamp}.${extension}`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function appendTargetText(target, text) {
  const job = currentJob();
  const stamp = text.trim();
  if (!stamp) return;
  if (target.kind === "check") {
    const checks = job[target.type] || [];
    const check = checks.find((item) => item.id === target.id);
    if (check) check.memo = `${check.memo ? `${check.memo}\n` : ""}${stamp}`;
  } else if (target.kind === "field") {
    const fieldName = target.field || "situation";
    job[fieldName] = `${job[fieldName] ? `${job[fieldName]}\n` : ""}${stamp}`;
  } else {
    job.situation = `${job.situation ? `${job.situation}\n` : ""}${stamp}`;
  }
  job.updatedAt = new Date().toISOString();
  saveState();
}

function clearField(fieldName, shouldRender = true) {
  const job = currentJob();
  job[fieldName] = "";
  job.updatedAt = new Date().toISOString();
  saveState();
  if (shouldRender) render();
}

function clearCheckMemo(type, id, shouldRender = true) {
  const job = currentJob();
  const check = (job[type] || []).find((item) => item.id === id);
  if (check) check.memo = "";
  job.updatedAt = new Date().toISOString();
  saveState();
  if (shouldRender) render();
}

function openDeviceFilePicker(type) {
  const input = document.querySelector("#externalAudioInput");
  if (!input) {
    notify("녹음 파일 선택창을 찾지 못했습니다.");
    return;
  }
  input.value = "";
  input.click();
}

function maybeAddEstimateRow(input) {
  if (input.dataset.field !== "name") return;
  const job = currentJob();
  const index = Number(input.dataset.estimate);
  const isLast = index === job.estimateItems.length - 1;
  const isLong = input.value.length >= 80 || input.scrollHeight > input.clientHeight + 12;
  if (!isLast || !isLong) return;
  job.estimateItems.push({ name: "", spec: "", qty: 1, unit: "식", unitPrice: "", cost: "" });
  setTimeout(render, 0);
}

function resizeEstimateNameInput(input) {
  input.style.height = "auto";
  input.style.height = `${Math.min(Math.max(input.scrollHeight, 110), 260)}px`;
}

async function filesToPrintableImages(files) {
  const images = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    try {
      const dataUrl = await resizeImageFile(file, 1400, 0.82);
      images.push({ name: file.name, dataUrl });
    } catch (error) {
      console.warn(error);
      const dataUrl = await readFileAsDataUrl(file);
      images.push({ name: file.name, dataUrl });
    }
  }
  return images;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("사진 파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function resizeImageFile(file, maxSide = 1400, quality = 0.82) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
  const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
  const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("사진 미리보기 변환에 실패했습니다."));
    image.src = src;
  });
}

function toggleEstimateTitle() {
  const job = currentJob();
  job.estimateDocTitle = job.estimateDocTitle === "거래명세서" ? "견 적 서" : "거래명세서";
  job.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function estimateLineTotal(item) {
  const qty = Number(item.qty || 0);
  const unitPrice = Number(item.unitPrice || 0);
  if (qty && unitPrice) return qty * unitPrice;
  return Number(item.cost || 0);
}

function estimateVatMode(job = currentJob()) {
  return job.vatMode === "inclusive" ? "inclusive" : "exclusive";
}

function estimateTotals(job = currentJob()) {
  const lineTotal = (job.estimateItems || []).reduce((sum, item) => sum + estimateLineTotal(item), 0);
  if (estimateVatMode(job) === "inclusive") {
    const total = lineTotal;
    const supplyTotal = Math.round(total / 1.1);
    return { supplyTotal, tax: total - supplyTotal, total };
  }
  const supplyTotal = lineTotal;
  const tax = Math.round(supplyTotal * 0.1);
  return { supplyTotal, tax, total: supplyTotal + tax };
}

function updateEstimateTotalsInPlace(job = currentJob()) {
  const totals = estimateTotals(job);
  Object.entries(totals).forEach(([key, value]) => {
    const target = document.querySelector(`[data-estimate-total="${key}"]`);
    if (target) target.textContent = `${value.toLocaleString()}원`;
  });
}

function setEstimateVatMode(mode) {
  const job = currentJob();
  job.vatMode = mode === "inclusive" ? "inclusive" : "exclusive";
  job.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function openPdfPrintWindow(type) {
  const job = currentJob();
  const title = type === "report" ? "누수진단 소견서" : currentJob().estimateDocTitle || "견 적 서";
  const html = type === "report" ? buildReportPrintHtml(job) : buildEstimatePrintHtml(job);
  const popup = window.open("", "_blank", "width=920,height=1100");
  if (!popup) {
    notify("팝업이 차단되었습니다. 브라우저 팝업 허용 후 다시 시도하세요.");
    return;
  }
  popup.document.open();
  popup.document.write(`
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          * { box-sizing: border-box; }
          body { color: #111827; font-family: "Malgun Gothic", Arial, sans-serif; line-height: 1.55; margin: 0; }
          h1 { font-size: 28px; letter-spacing: 0; margin: 0 0 18px; text-align: center; }
          h2 { border-bottom: 2px solid #111827; font-size: 17px; margin: 18px 0 8px; padding-bottom: 5px; }
          p { margin: 6px 0; }
          table { border-collapse: collapse; margin: 10px 0; width: 100%; }
          th, td { border: 1px solid #222; padding: 8px; text-align: left; vertical-align: top; }
          th { background: #f3f4f6; font-weight: 700; width: 120px; }
          .doc { padding: 10px; }
          .right { text-align: right; }
          .pre { white-space: pre-wrap; }
          .total th, .total td { background: #ecfdf5; font-size: 16px; font-weight: 700; }
          .stamp-wrap { align-items: center; display: inline-flex; gap: 12px; justify-content: flex-end; margin-top: 28px; width: 100%; }
          .stamp-svg { height: 78px; object-fit: contain; opacity: .95; transform: rotate(-5deg); width: 78px; }
          .photo-page { break-before: page; page-break-before: always; }
          .photo-grid-print { display: grid; gap: 7mm; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(4, 1fr); min-height: 244mm; }
          .photo-grid-print figure { border: 1px solid #222; display: grid; grid-template-rows: 1fr auto; margin: 0; min-height: 0; padding: 3mm; }
          .photo-grid-print img { height: 100%; max-height: 51mm; object-fit: contain; width: 100%; }
          .photo-grid-print figcaption { border-top: 1px solid #ddd; font-size: 11px; margin-top: 2mm; overflow: hidden; padding-top: 1mm; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="doc">${html}</div>
        <script>
          window.addEventListener("load", () => setTimeout(() => window.print(), 250));
        <\/script>
      </body>
    </html>
  `);
  popup.document.close();
}

function buildReportPrintHtml(job) {
  const report = reportContentForDocument(job.report || generateReport(job));
  return `
    <h1>누수진단 소견서</h1>
    <table>
      <tbody>
        <tr><th>진단일자</th><td>${escapeHtml(job.date || "")}</td><th>연락처</th><td>${escapeHtml(job.phone || "")}</td></tr>
        <tr><th>고객 이름</th><td colspan="3">${escapeHtml(job.customerName || "")}</td></tr>
        <tr><th>현장주소</th><td colspan="3">${escapeHtml(job.address || "")}</td></tr>
        <tr><th>작성자</th><td>${escapeHtml(PROVIDER.name)}</td><th>사업자번호</th><td>${escapeHtml(PROVIDER.bizNo)}</td></tr>
        <tr><th>공급자 주소</th><td colspan="3">${escapeHtml(PROVIDER.address)}</td></tr>
      </tbody>
    </table>
    <h2>소견 내용</h2>
    <div class="pre">${escapeHtml(report)}</div>
    <div class="stamp-wrap">
      <span>공급자 확인: ${escapeHtml(PROVIDER.owner)}</span>
      ${stampSealImage("stamp-svg")}
    </div>
    ${buildReportPhotoPages(job)}
  `;
}

function reportContentForDocument(report) {
  const text = String(report || "").trim();
  const firstSection = text.search(/\n\s*1\.\s*현장\s*상황/);
  if (firstSection >= 0) return text.slice(firstSection).trim();
  return text
    .replace(/^\[누수진단 소견서\]\s*/u, "")
    .replace(/^진단일자:.*(?:\r?\n)?/mu, "")
    .replace(/^고객 이름:.*(?:\r?\n)?/mu, "")
    .replace(/^현장주소:.*(?:\r?\n)?/mu, "")
    .replace(/^연락처:.*(?:\r?\n)?/mu, "")
    .replace(/^작성자:.*(?:\r?\n)?/mu, "")
    .replace(/^사업자번호:.*(?:\r?\n)?/mu, "")
    .replace(/^공급자 주소:.*(?:\r?\n)?/mu, "")
    .replace(/^공급자 확인:.*(?:\r?\n)?/mu, "")
    .trim();
}

function buildReportPhotoPages(job) {
  const fieldPhotos = Array.isArray(job.photoFiles) ? job.photoFiles.filter((photo) => photo?.dataUrl).map((photo) => ({ ...photo, group: "현장 사진" })) : [];
  const somersPhotos = Array.isArray(job.somersPhotoFiles) ? job.somersPhotoFiles.filter((photo) => photo?.dataUrl).map((photo) => ({ ...photo, group: "소머즈 촬영" })) : [];
  const photos = [...fieldPhotos, ...somersPhotos];
  if (!photos.length) return "";
  const chunks = [];
  for (let i = 0; i < photos.length; i += 8) chunks.push(photos.slice(i, i + 8));
  return chunks.map((chunk, pageIndex) => `
    <section class="photo-page">
      <h1>첨부 사진${chunks.length > 1 ? ` ${pageIndex + 1}` : ""}</h1>
      <div class="photo-grid-print">
        ${chunk.map((photo, index) => `
          <figure>
            <img src="${escapeAttr(photo.dataUrl)}" alt="${escapeAttr(photo.name || `첨부 사진 ${index + 1}`)}" />
            <figcaption>${escapeHtml(`${photo.group || "첨부 사진"} - ${photo.name || `사진 ${pageIndex * 8 + index + 1}`}`)}</figcaption>
          </figure>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function buildEstimatePrintHtml(job) {
  const items = job.estimateItems || [];
  const totals = estimateTotals(job);
  return `
    <h1>${escapeHtml(job.estimateDocTitle || "견 적 서")}</h1>
    <table>
      <tbody>
        <tr><th>견적일자</th><td>${escapeHtml(job.date || "")}</td><th>견적번호</th><td>${escapeHtml(job.estimateNo || `WL-${(job.date || "").replaceAll("-", "")}`)}</td></tr>
        <tr><th colspan="2">수신</th><th colspan="2">공급자</th></tr>
        <tr><th>고객명</th><td>${escapeHtml(job.customerName || "")}</td><th>상호</th><td>${escapeHtml(PROVIDER.name)}</td></tr>
        <tr><th>주소</th><td>${escapeHtml(job.address || "")}</td><th>사업자번호</th><td>${escapeHtml(PROVIDER.bizNo)}</td></tr>
        <tr><th>전화번호</th><td>${escapeHtml(job.phone || "")}</td><th>대표/담당</th><td>${escapeHtml(PROVIDER.owner)}</td></tr>
        <tr><th>공사명</th><td>${escapeHtml(job.workSummary || "누수 진단 및 보수 공사")}</td><th>주소</th><td>${escapeHtml(PROVIDER.address)}</td></tr>
      </tbody>
    </table>
    <table>
      <thead><tr><th style="width:68%">품명</th><th>수량</th><th>공급가액</th></tr></thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>${escapeHtml([item.name, item.spec].filter(Boolean).join(" / "))}</td>
            <td>${escapeHtml(item.qty || 1)}</td>
            <td class="right">${estimateLineTotal(item).toLocaleString()}원</td>
          </tr>
        `).join("")}
        <tr><th colspan="2" class="right">공급가액</th><td class="right">${totals.supplyTotal.toLocaleString()}원</td></tr>
        <tr><th colspan="2" class="right">부가세</th><td class="right">${totals.tax.toLocaleString()}원</td></tr>
        <tr class="total"><th colspan="2" class="right">합계금액</th><td class="right">${totals.total.toLocaleString()}원</td></tr>
      </tbody>
    </table>
    <h2>비고</h2>
    <p class="pre">${escapeHtml(job.estimateNote || "상기 견적은 현장 상황 및 추가 작업 범위에 따라 변경될 수 있습니다.")}</p>
    <div class="stamp-wrap">
      <span>공급자 확인: ${escapeHtml(PROVIDER.owner)}</span>
      ${stampSealImage("stamp-svg")}
    </div>
  `;
}

function stampSealImage(className = "stamp-seal") {
  const src = new URL("assets/stamp-choi.png", window.location.href).href;
  return `<img class="${className}" src="${src}" alt="최규석 도장" />`;
}

async function startSpectrum() {
  try {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (micStream) micStream.getTracks().forEach((track) => track.stop());
    if (audioContext) await audioContext.close();
    leakAudioHistory = [];
    lastLeakAudioMetrics = null;
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
      video: false,
    });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(micStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 0.72;
    analyser.minDecibels = -110;
    analyser.maxDecibels = -20;
    source.connect(analyser);
    renderSpectrum();
  } catch (error) {
    notify("마이크/오디오 입력 권한이 필요합니다. USB-C 오디오 캡처 연결, 브라우저 권한, 입력 장치를 확인한 뒤 다시 실행하세요.");
  }
}

function stopSpectrum() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (micStream) micStream.getTracks().forEach((track) => track.stop());
  if (audioContext) audioContext.close();
  animationFrame = null;
  micStream = null;
  audioContext = null;
  analyser = null;
  lastLeakAudioMetrics = null;
  drawIdleSpectrum();
  updateLeakAudioPanel(null);
}

function renderSpectrum() {
  const canvas = document.querySelector("#spectrum");
  if (!canvas || !analyser || !audioContext) return;
  const ctx = canvas.getContext("2d");
  const data = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(data);
  const currentMetrics = calculateLeakAudioScore({
    frequencyData: data,
    sampleRate: audioContext.sampleRate,
    fftSize: analyser.fftSize,
    history: leakAudioHistory,
  });
  leakAudioHistory.push(currentMetrics);
  if (leakAudioHistory.length > 60) leakAudioHistory.shift();
  const smoothedScore = Math.round(leakAudioHistory.reduce((sum, item) => sum + item.score, 0) / leakAudioHistory.length);
  lastLeakAudioMetrics = { ...currentMetrics, score: smoothedScore };
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let y = 40; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  const maxHz = 18000;
  const maxBin = Math.min(binFromHz(maxHz, audioContext.sampleRate, analyser.fftSize), data.length - 1);
  const leakStartBin = binFromHz(3500, audioContext.sampleRate, analyser.fftSize);
  const leakX = (leakStartBin / maxBin) * width;
  ctx.fillStyle = "rgba(249,115,22,0.12)";
  ctx.fillRect(leakX, 0, width - leakX, height);
  const barWidth = width / Math.max(1, maxBin);
  for (let i = 0; i < maxBin; i += 1) {
    const db = data[i];
    const normalized = clamp((db + 110) / 90, 0, 1);
    const barHeight = normalized * height;
    const hz = (i * audioContext.sampleRate) / analyser.fftSize;
    if (hz >= 3500 && smoothedScore >= 85) ctx.fillStyle = "#ef4444";
    else if (hz >= 3500 && smoothedScore >= 70) ctx.fillStyle = "#f97316";
    else if (hz >= 3500) ctx.fillStyle = "#38bdf8";
    else ctx.fillStyle = "#64748b";
    ctx.fillRect(i * barWidth, height - barHeight, Math.max(1, barWidth), barHeight);
  }
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px sans-serif";
  ctx.fillText("저주파", 12, 24);
  ctx.fillText("누수 의심 고주파 대역", leakX + 12, 24);
  const status = document.querySelector("#peakStatus");
  const risk = getLeakAudioRisk(smoothedScore);
  if (status) status.textContent = `${risk.label} · 피크 ${lastLeakAudioMetrics.peakHz} Hz · ${smoothedScore}%`;
  updateLeakAudioPanel(lastLeakAudioMetrics);
  animationFrame = requestAnimationFrame(renderSpectrum);
}

function drawIdleSpectrum() {
  const canvas = document.querySelector("#spectrum");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#071316";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 72; i += 1) {
    const h = 22 + Math.sin(i * 0.8) * 18 + (i % 9) * 4;
    ctx.fillStyle = i % 17 === 0 ? "#e47c24" : "#214f58";
    ctx.fillRect(i * 16, canvas.height - h - 18, 9, h);
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function averageFrequencyRange(data, startBin, endBin) {
  let sum = 0;
  let count = 0;
  const start = clamp(startBin, 0, data.length - 1);
  const end = clamp(endBin, start, data.length - 1);
  for (let i = start; i <= end; i += 1) {
    sum += data[i];
    count += 1;
  }
  return count ? sum / count : -110;
}

function maxFrequencyRange(data, startBin, endBin) {
  let max = -Infinity;
  const start = clamp(startBin, 0, data.length - 1);
  const end = clamp(endBin, start, data.length - 1);
  let index = start;
  for (let i = start; i <= end; i += 1) {
    if (data[i] > max) {
      max = data[i];
      index = i;
    }
  }
  return { max, index };
}

function binFromHz(hz, sampleRate, fftSize) {
  return Math.floor((hz * fftSize) / sampleRate);
}

function getLeakAudioRisk(score) {
  if (score >= 85) return { label: "강한 누수 의심", className: "risk-danger", color: "red" };
  if (score >= 70) return { label: "누수 의심", className: "risk-orange", color: "orange" };
  if (score >= 40) return { label: "주의 관찰", className: "risk-yellow", color: "yellow" };
  return { label: "정상 범위", className: "risk-green", color: "green" };
}

function calculateLeakAudioScore({ frequencyData, sampleRate, fftSize, history }) {
  const lowStart = binFromHz(80, sampleRate, fftSize);
  const lowEnd = binFromHz(900, sampleRate, fftSize);
  const midStart = binFromHz(900, sampleRate, fftSize);
  const midEnd = binFromHz(3500, sampleRate, fftSize);
  const leakStart = binFromHz(3500, sampleRate, fftSize);
  const leakEnd = binFromHz(12000, sampleRate, fftSize);
  const ultraStart = binFromHz(12000, sampleRate, fftSize);
  const ultraEnd = binFromHz(18000, sampleRate, fftSize);
  const lowAvg = averageFrequencyRange(frequencyData, lowStart, lowEnd);
  const midAvg = averageFrequencyRange(frequencyData, midStart, midEnd);
  const leakAvg = averageFrequencyRange(frequencyData, leakStart, leakEnd);
  const ultraAvg = averageFrequencyRange(frequencyData, ultraStart, ultraEnd);
  const peak = maxFrequencyRange(frequencyData, leakStart, ultraEnd);
  const highVsLow = leakAvg - lowAvg;
  const highVsMid = leakAvg - midAvg;
  const peakStrength = peak.max - Math.max(lowAvg, midAvg);
  const highScore = clamp((highVsLow + 22) * 2.2, 0, 40);
  const midCompareScore = clamp((highVsMid + 18) * 1.6, 0, 25);
  const peakScore = clamp((peakStrength + 16) * 1.5, 0, 20);
  const ultraScore = clamp((ultraAvg - lowAvg + 24) * 0.55, 0, 10);
  const recent = history.slice(-24);
  const stableCount = recent.filter((item) => item.rawScore >= 55).length;
  const stableScore = clamp((stableCount / 24) * 12, 0, 12);
  let rawScore = highScore + midCompareScore + peakScore + ultraScore + stableScore;
  if (lowAvg > leakAvg + 12) rawScore -= 15;
  const score = Math.round(clamp(rawScore, 0, 100));
  const peakHz = Math.round((peak.index * sampleRate) / fftSize);
  return {
    score,
    rawScore: score,
    peakHz,
    lowAvg: Math.round(lowAvg),
    midAvg: Math.round(midAvg),
    leakAvg: Math.round(leakAvg),
    ultraAvg: Math.round(ultraAvg),
  };
}

function updateLeakAudioPanel(metrics) {
  const score = metrics?.score || 0;
  const risk = getLeakAudioRisk(score);
  const badge = document.querySelector("#leakRiskBadge");
  if (badge) {
    badge.className = `leak-risk-badge ${risk.className}`;
    badge.textContent = risk.label;
  }
  const circle = document.querySelector("#leakScoreCircle");
  if (circle) circle.style.setProperty("--score-deg", `${score * 3.6}deg`);
  const scoreValue = document.querySelector("#leakScoreValue");
  if (scoreValue) scoreValue.textContent = score;
  const peakHz = document.querySelector("#leakPeakHz");
  if (peakHz) peakHz.textContent = metrics ? `${metrics.peakHz} Hz` : "- Hz";
  const lowAvg = document.querySelector("#leakLowAvg");
  if (lowAvg) lowAvg.textContent = metrics ? `${metrics.lowAvg} dB` : "- dB";
  const midAvg = document.querySelector("#leakMidAvg");
  if (midAvg) midAvg.textContent = metrics ? `${metrics.midAvg} dB` : "- dB";
  const bandAvg = document.querySelector("#leakBandAvg");
  if (bandAvg) bandAvg.textContent = metrics ? `${metrics.leakAvg} dB` : "- dB";
}

function saveLeakAudioPoint() {
  if (!lastLeakAudioMetrics) {
    notify("소리 분석을 먼저 시작한 뒤 저장하세요.");
    return;
  }
  const job = currentJob();
  const risk = getLeakAudioRisk(lastLeakAudioMetrics.score);
  const input = document.querySelector("#leakPointName");
  const point = {
    id: `leak-${Date.now()}`,
    name: input?.value.trim() || `측정지점 ${(job.leakAudioPoints || []).length + 1}`,
    score: lastLeakAudioMetrics.score,
    risk: risk.label,
    color: risk.color,
    metrics: lastLeakAudioMetrics,
    createdAt: new Date().toISOString(),
  };
  job.leakAudioPoints = [point, ...(job.leakAudioPoints || [])];
  job.updatedAt = new Date().toISOString();
  saveState();
  render();
  notify("현재 측정 지점을 저장했습니다.");
}

function deleteLeakAudioPoint(id) {
  const job = currentJob();
  job.leakAudioPoints = (job.leakAudioPoints || []).filter((point) => point.id !== id);
  job.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function updatePressureDial(value) {
  const dial = document.querySelector(".pressure-dial b");
  if (dial) dial.textContent = Number(value || 0).toFixed(1);
}

function generateReport(job) {
  const plumbingIssues = job.plumbingChecks.filter((check) => check.done && check.result !== "정상");
  const waterproofIssues = job.waterproofChecks.filter((check) => check.done && check.result !== "정상");
  const leakAudioSummary = (job.leakAudioPoints || [])
    .map((point) => `- ${point.name}: ${point.score}% / ${point.risk} / 피크 ${point.metrics?.peakHz || "-"} Hz`)
    .join("\n") || "저장된 AI 청음 측정 지점이 없습니다.";
  const v2EvidenceSummary = [
    `- 소머즈 누수 레벨: ${job.somersLeakLevel || "미기록"}`,
    `- 소머즈 주파수: ${job.somersFrequency || "미기록"}`,
    `- 소머즈 주황 표시: ${job.somersOrangeMark || "미기록"}`,
    `- 소머즈 의심 위치: ${job.somersSuspectLocation || "미기록"}`,
    `- 소머즈 촬영 자료: ${(job.somersPhotos || []).length ? `${job.somersPhotos.length}장 (${job.somersPhotos.join(", ")})` : "미기록"}`,
    `- 소머즈 촬영 메모: ${job.somersCaptureMemo || "미기록"}`,
    `- 최종 누수 위치: ${job.finalLeakLocation || "미기록"}`,
    `- 실제 굴착 결과: ${job.excavationResult || "미기록"}`,
  ].join("\n");
  return `[누수진단 소견서]

진단일자: ${job.date}
고객 이름: ${job.customerName || "미입력"}
현장주소: ${job.address || "미입력"}
연락처: ${job.phone || "미입력"}
작성자: ${PROVIDER.name}
사업자번호: ${PROVIDER.bizNo}
공급자 주소: ${PROVIDER.address}
공급자 확인: ${PROVIDER.owner}

1. 현장 상황
${job.situation || "현장 상황 기록이 필요합니다."}

2. 배관 누수 점검 결과
${summaryLines(job.plumbingChecks)}

3. 방수 및 외부 요인 점검 결과
${summaryLines(job.waterproofChecks)}

4. AI 청음 누수 분석
${leakAudioSummary}

5. 누수추적기 V2 기록
${v2EvidenceSummary}

6. 종합 의견
${plumbingIssues.length ? "배관 계통 누수 가능성이 확인 또는 의심됩니다. 압력검사, 청음, 열화상/가스탐지 등 다각적 추적을 권장합니다." : "기본 배관 점검에서는 중대한 누수 징후가 제한적입니다."}
${waterproofIssues.length ? "외부 요인 또는 방수층 문제 가능성도 함께 검토해야 합니다." : "방수 및 외부 요인은 현재 기록 기준 특이사항이 적습니다."}

7. 첨부자료
사진: ${(job.photos || []).length ? `${job.photos.length}장 (${job.photos.join(", ")})` : "없음"}`;
}

function generateBlog(job, custom = null) {
  const keyword = custom?.keyword || "누수진단";
  const category = custom?.category || "누수탐지 및 설비 점검";
  const title = `${keyword} 현장 점검 방법`;
  const description = fitDescription(`${keyword}은 ${category}에서 중요한 기준이며 문제 상황, 점검 순서, 기록 내용을 차분히 확인해 원인을 좁히고 필요한 조치를 판단하는 과정입니다.`);
  const situation = job.situation || "고객 진술과 피해 위치를 기준으로 누수 범위를 좁혀 확인했습니다.";
  const checks = summaryLines([...job.plumbingChecks, ...job.waterproofChecks]);
  if (custom) {
    return `제목: ${title}
디스크립션: ${description}
본문:
<h2>${keyword} 기본 개념을 먼저 정리했습니다</h2>
${category} 분야에서 ${keyword}은 단순히 하나의 정보를 확인하는 일이 아니라 전체 상황을 차분히 살피는 과정입니다. 먼저 현재 문제가 왜 생겼는지, 어떤 기준으로 판단해야 하는지, 어떤 기록이 필요한지를 순서대로 확인해야 합니다. 특히 처음 접하는 분들은 눈에 보이는 결과만 보고 바로 결론을 내리기 쉽지만, 실제로는 원인과 결과가 다르게 나타나는 경우가 많습니다. 그래서 ${keyword}을 확인할 때는 현장의 조건, 사용 환경, 반복되는 증상, 이전 기록을 함께 보는 것이 중요합니다. 이런 방식으로 접근하면 불필요한 시행착오를 줄이고 필요한 조치를 더 정확하게 선택할 수 있습니다. [사진 삽입: ${keyword}과 관련된 현장 또는 준비 장면]

<h2>${keyword} 확인 절차를 단계별로 살펴봤습니다</h2>
${keyword}을 제대로 판단하려면 먼저 큰 범위에서 작은 범위로 좁혀 가는 순서가 필요합니다. 처음에는 전체 상황을 기록하고, 다음에는 의심되는 부분을 나누어 확인하며, 마지막에는 실제 조치가 필요한 지점을 정리하는 방식이 좋습니다. 이 과정에서 중요한 것은 한 번의 느낌으로 판단하지 않는 것입니다. 같은 증상처럼 보여도 원인은 다를 수 있기 때문에 확인한 내용과 확인하지 못한 내용을 구분해서 남겨야 합니다. 또한 사진, 메모, 날짜, 장소 같은 기본 정보가 함께 있으면 나중에 비교할 때 훨씬 도움이 됩니다. ${category} 주제로 글을 작성할 때도 이런 순서를 유지하면 독자가 내용을 쉽게 이해하고 실제 상황에 적용하기 좋습니다. [사진 삽입: 단계별 확인 과정 또는 체크리스트 장면]

<h2>${keyword} 기록은 문제 해결의 기준이 됩니다</h2>
${keyword}에서 마지막으로 중요한 부분은 기록을 남기는 일입니다. 기록이 있어야 같은 문제가 다시 생겼을 때 이전 상태와 현재 상태를 비교할 수 있고, 어떤 조치가 효과가 있었는지도 판단할 수 있습니다. 글을 작성할 때도 단순한 설명보다 왜 이 절차가 필요한지, 어떤 점을 주의해야 하는지, 실제로 어떤 순서로 확인하면 좋은지를 함께 적으면 정보의 신뢰도가 높아집니다. 특히 구글 애드센스 승인을 목표로 한다면 과장된 표현보다 차분하고 정확한 문장이 좋습니다. 제목에는 메인 키워드를 앞에 배치하고, 디스크립션에는 핵심 내용을 자연스럽게 포함하며, 본문은 H2 소제목을 중심으로 충분한 설명을 넣는 방식이 안정적입니다. 이렇게 정리하면 독자에게도 도움이 되고 검색에도 적합한 글이 됩니다.`;
  }
  return `제목: ${title}
디스크립션: ${description}
본문:
<h2>누수진단 현장 상황을 먼저 확인했습니다</h2>
오늘은 ${job.date || "접수 당일"} 접수된 누수 의심 현장을 방문해 고객이 겪고 있는 피해 상황과 물이 번진 방향을 먼저 확인했습니다. ${job.address ? `${job.address} 현장은 ` : "이번 현장은 "}단순히 눈에 보이는 물자국만 보고 판단하기보다, 물이 시작된 위치와 이동한 방향을 나누어 살피는 것이 중요했습니다. 누수진단은 한 번에 답을 정하는 작업이 아니라 가능성이 높은 원인을 순서대로 배제해 가는 과정입니다. 현장에서 확인한 상황은 다음과 같습니다. ${situation} 이처럼 초기 상황을 자세히 기록하면 이후 배관 문제인지, 방수 문제인지, 외부 유입인지 판단하는 기준이 분명해집니다. 특히 아래층 천장 얼룩이나 벽면 젖음은 실제 누수 위치와 다르게 나타날 수 있으므로 계량기, 밸브, 사용 환경을 함께 확인해야 했습니다. [사진 삽입: 현장 누수 흔적과 점검 전 상태]

<h2>배관과 방수 항목을 순서대로 점검했습니다</h2>
이번 점검에서는 먼저 배관누수 가능성을 확인하기 위해 밸브를 잠그고 열면서 계량기 반응을 확인했습니다. 이후 화장실 변기부속, 각 밸브류, 창틀, 우수관, 화장실 방수상태, 유가, 변기 주변 상태를 차례로 살폈습니다. 점검 결과는 다음과 같이 정리할 수 있습니다. ${checks} 배관누수검사는 단순히 물소리만 듣는 과정이 아니라 계량기 움직임, 밸브 차단 후 변화, 사용하지 않는 시간대의 압력 변화 등을 함께 보는 작업입니다. 반대로 방수 문제는 물을 사용했을 때만 증상이 나타나는 경우가 많아 배관 검사와 구분해서 판단해야 합니다. 이런 이유로 현장에서는 배관 계통과 방수 계통을 나누어 확인했고, 외부 요인까지 함께 검토했습니다. [사진 삽입: 계량기 확인 또는 배관 점검 장면]

<h2>누수 원인은 기록을 남기며 좁혀가야 합니다</h2>
누수진단에서 가장 중요한 것은 추측보다 기록입니다. 어느 밸브를 잠갔을 때 변화가 있었는지, 물 사용 전후에 계량기가 어떻게 반응했는지, 피해 부위가 어느 방향으로 번졌는지를 남겨야 같은 문제가 반복될 때 빠르게 비교할 수 있습니다. 이번 현장도 배관, 방수, 외부 유입 가능성을 한꺼번에 단정하지 않고 순서대로 확인했습니다. 누수는 작은 틈에서 시작해 넓은 피해로 이어질 수 있기 때문에 초기에 정확히 판단하는 것이 공사 범위와 비용을 줄이는 데 도움이 됩니다. 앞으로 같은 증상이 반복된다면 오늘 기록한 점검 결과를 기준으로 추가 압력검사, 청음, 내시경, 열화상 확인 등을 이어가면 원인 파악이 훨씬 수월합니다. 최종적으로는 현장 상황과 점검 결과를 종합해 필요한 보수 범위를 결정하는 것이 바람직합니다.`;
}

function fitDescription(text) {
  const compact = String(text).replace(/\s+/g, " ").trim();
  if (compact.length >= 150 && compact.length <= 160) return compact;
  if (compact.length > 160) return compact.slice(0, 157) + "...";
  return (compact + " 정확한 기록과 순차 점검이 필요합니다.").slice(0, 160);
}

function customBlogInfo(job) {
  return {
    category: (job.blogCategory || "").trim(),
    keyword: (job.blogKeyword || "").trim(),
  };
}

function validateCustomBlog(job) {
  const info = customBlogInfo(job);
  if (!info.category || !info.keyword) {
    notify("카테고리와 메인키워드를 모두 입력하세요.");
    return null;
  }
  return info;
}

function buildBlogPrompt(job, custom = null) {
  const category = custom?.category || "누수탐지 및 설비 점검";
  const keyword = custom?.keyword || "누수진단";
  const isCustom = Boolean(custom);
  return `당신은 구글 애드센스 승인을 목표로 하는 블로그 글 작성 전문가입니다.
아래 조건에 맞춰 블로그 글을 작성해 주십시오.

[조건]
- 주제(카테고리): ${category}
- 메인 키워드: ${keyword}
- 제목: 메인 키워드를 맨 앞에 배치, 15~20자 내외
- 디스크립션: 메인 키워드 포함, 공백 포함 150~160자
- 문체: 합쇼체(~했습니다, ~합니다), 구어체 절대 금지
- 본문: H2 소제목 3개 이상, 소제목당 500자 내외, 총 1,500자 이상
- 사진 설명: 본문 중 적절한 위치에 [사진 삽입: 설명] 형태로 표시
- 글 맨 아래에 "연관 해시태그:" 항목을 만들고, 메인 키워드와 관련된 해시태그를 되도록 많이 넣어 주십시오.

[${isCustom ? "작성 기준" : "현장 자료"}]
- 날짜: ${job.date || ""}
- 주소: ${job.address || ""}
- 상황 기록: ${job.situation || "현장 상황 기록을 바탕으로 작성"}
- 환경 기록: ${job.environment || ""}
- 소머즈 OCR: 레벨 ${job.somersLeakLevel || "미기록"}, 주파수 ${job.somersFrequency || "미기록"}, 주황 표시 ${job.somersOrangeMark || "미기록"}, 의심 위치 ${job.somersSuspectLocation || "미기록"}
- 소머즈 촬영 자료: ${(job.somersPhotos || []).length ? `${job.somersPhotos.length}장 (${job.somersPhotos.join(", ")})` : "미기록"}
- 소머즈 촬영 메모: ${job.somersCaptureMemo || "미기록"}
- 최종 누수 위치: ${job.finalLeakLocation || "미기록"}
- 실제 굴착 결과: ${job.excavationResult || "미기록"}
- 소견서 요약: ${job.report || "소견서가 있으면 함께 반영"}
- 점검 요약:
${summaryLines([...job.plumbingChecks, ...job.waterproofChecks])}

[출력 형식]
제목:
디스크립션:
본문:
연관 해시태그:`;
}

function copyBlogPrompt(job, useCustom = false) {
  const custom = useCustom ? validateCustomBlog(job) : null;
  if (useCustom && !custom) return;
  navigator.clipboard.writeText(buildBlogPrompt(job, custom)).then(() => notify("AI 블로그 프롬프트를 복사했습니다."));
}

function openChatGptWithPrompt(job, useCustom = false) {
  const custom = useCustom ? validateCustomBlog(job) : null;
  if (useCustom && !custom) return;
  navigator.clipboard.writeText(buildBlogPrompt(job, custom)).then(() => {
    notify("프롬프트를 복사했습니다. ChatGPT 입력창에 붙여넣으세요.");
    window.open("https://chatgpt.com/", "_blank", "noopener");
  });
}

function summaryLines(checks) {
  return checks.map((check) => `- ${check.title}: ${check.result}${check.memo ? ` (${check.memo})` : ""}`).join("\n");
}

function countDone(checks) {
  return checks.filter((check) => check.done).length;
}

function copyText(text) {
  if (!text) {
    notify("복사할 블로그 글이 없습니다.");
    return;
  }
  navigator.clipboard.writeText(text).then(() => notify("블로그 글을 복사했습니다."));
}

function saveBlogEditor() {
  const editor = document.querySelector("#blogEditor");
  if (!editor) return;
  updateJob({ blog: editor.innerHTML.trim() });
  state.blogEditorOpen = false;
  saveState();
  render();
  notify("블로그 글이 앱에 저장되었습니다.");
}

function clearBlogEditor() {
  const editor = document.querySelector("#blogEditor");
  if (editor) editor.innerHTML = "";
  const job = currentJob();
  job.blog = "";
  job.updatedAt = new Date().toISOString();
  saveState();
  notify("작성 화면과 저장된 블로그 원고를 삭제했습니다.");
}

function clearBlogData() {
  const job = currentJob();
  job.blog = "";
  job.updatedAt = new Date().toISOString();
  saveState();
  render();
  notify("블로그 자료를 삭제했습니다.");
}

function applyBlogFormat(command) {
  const editor = document.querySelector("#blogEditor");
  if (!editor) return;
  editor.focus();
  document.execCommand(command, false, null);
}

function applyBlogBlock(block) {
  const editor = document.querySelector("#blogEditor");
  if (!editor) return;
  editor.focus();
  document.execCommand("formatBlock", false, block === "h2" ? "h2" : "p");
}

function saveBlogSelection() {
  const editor = document.querySelector("#blogEditor");
  const selection = window.getSelection();
  if (!editor || !selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (editor.contains(range.commonAncestorContainer)) savedBlogSelection = range.cloneRange();
}

function restoreBlogSelection() {
  const editor = document.querySelector("#blogEditor");
  if (!editor) return;
  editor.focus();
  if (!savedBlogSelection) return;
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedBlogSelection);
}

function insertBlogEmoji(emoji) {
  restoreBlogSelection();
  document.execCommand("insertText", false, emoji);
  saveBlogSelection();
  const picker = document.querySelector(".emoji-picker");
  if (picker) picker.hidden = true;
}

function toggleEmojiPicker() {
  const picker = document.querySelector(".emoji-picker");
  if (!picker) return;
  picker.hidden = !picker.hidden;
}

function copyBlogEditor() {
  const editor = document.querySelector("#blogEditor");
  const text = editor?.innerText || currentJob().blog || "";
  if (!text.trim()) {
    notify("복사할 블로그 글이 없습니다.");
    return;
  }
  navigator.clipboard.writeText(text).then(() => notify("블로그 내용을 복사했습니다."));
}

function openExternalLink(url) {
  if (!url) return;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) notify("팝업이 차단되었습니다. 브라우저 팝업 허용 후 다시 시도하세요.");
}

function printBlogPreview() {
  const content = document.querySelector("#blogEditor")?.innerHTML || currentJob().blog || "";
  const win = window.open("", "_blank");
  if (!win) {
    notify("팝업이 차단되었습니다. 브라우저 팝업 허용 후 다시 시도하세요.");
    return;
  }
  win.document.write(`
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>블로그 원고</title>
        <style>
          body { color: #111827; font-family: "Malgun Gothic", Arial, sans-serif; line-height: 1.75; margin: 34px; }
          h1, h2 { line-height: 1.35; }
          img { max-width: 100%; }
          .doc { max-width: 760px; margin: 0 auto; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body><main class="doc">${formatBlogContent(content || "블로그 글이 없습니다.")}</main></body>
    </html>
  `);
  win.document.close();
  win.addEventListener("load", () => setTimeout(() => win.print(), 250));
}

function formatBlogEditorContent(value) {
  const text = String(value || "");
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function formatBlogContent(value) {
  const text = String(value || "");
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function notify(message) {
  const status = document.querySelector("#recordingStatus") || document.querySelector("#peakStatus");
  if (status) status.textContent = message;
  let toast = document.querySelector(".app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

render();
