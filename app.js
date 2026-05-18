const STORAGE_KEY = "waterleak_multi_check_v1";
const GOOGLE_CONFIG_KEY = "waterleak_google_drive_config_v1";
const PROVIDER = {
  name: "최씨누수탐지종합설비",
  bizNo: "381-26-00781",
  address: "속초시 조양로 22번길7",
  owner: "최규석",
};

const basePlumbingChecks = [
  ["toilet_parts", "화장실 변기부속 누수검사", "밸브를 잠그고 열어 계량기 움직임을 확인합니다. 물이 없으면 보충 후 재검사합니다."],
  ["hot_water", "온수 누수검사", "보일러 온수밸브를 잠그고 열어 계량기 누수 변화를 확인합니다."],
  ["all_valves", "모든 밸브류 검사", "화장실, 싱크대, 개수대, 외부수도, 밸브고장 여부를 순차 확인합니다."],
];

const baseWaterproofChecks = [
  ["window_frame", "창틀검사", "외부 빗물 유입, 실리콘 벌어짐, 하부 물길 상태를 확인합니다."],
  ["rain_pipe", "우수관검사", "우수관 막힘, 파손, 역류 흔적과 주변 오염을 확인합니다."],
  ["bathroom_waterproof", "화장실 방수상태", "바닥/벽체 방수층 의심 구간, 하부세대 피해 방향을 확인합니다."],
  ["drain_trap", "유가상태", "유가 주변 크랙, 배수 불량, 악취 및 물고임 여부를 확인합니다."],
  ["toilet_body", "변기상태", "변기 정심, 백시멘트, 배관 연결부 흔들림과 누수 흔적을 확인합니다."],
];

const viewOrder = [
  ["dashboard", "메인메뉴"],
  ["basic", "기본점검"],
  ["tracker", "누수추적기"],
  ["blog", "블로그 작성"],
  ["estimate", "견적서"],
  ["report", "AI 소견서"],
  ["history", "작업 리스트"],
];

const defaultState = {
  activeView: "dashboard",
  currentJobId: null,
  storageMode: "local",
  googleDrive: {
    apiKey: "",
    clientId: "",
    folderId: "",
    folderName: "WaterLeak Multi Check",
  },
  googleSetupOpen: false,
  jobs: [],
};

let state = loadState();
let wavRecorder = null;
let audioContext = null;
let analyser = null;
let animationFrame = null;
let micStream = null;
let recordingTarget = null;
let driveSaveDraft = null;
let googleTokenClient = null;
let googleAccessToken = "";

const app = document.querySelector("#app");

function createJob() {
  const today = new Date().toISOString().slice(0, 10);
  const id = `job-${Date.now()}`;
  return {
    id,
    date: today,
    address: "",
    phone: "",
    situation: "",
    environment: "",
    plumbingChecks: createChecks(basePlumbingChecks),
    waterproofChecks: createChecks(baseWaterproofChecks),
    photos: [],
    blogPhotos: [],
    videos: [],
    pressureSet: 3.0,
    pressureLive: 0,
    compressorOn: false,
    bluetoothDevice: "",
    report: "",
    blog: "",
    estimateItems: [{ name: "", cost: "" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createChecks(items) {
  return items.map(([id, title, guide]) => ({ id, title, guide, done: false, result: "대기", memo: "" }));
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
  return job;
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

function setView(view) {
  state.activeView = view;
  saveState();
  render();
}

function moveView(direction) {
  const ids = viewOrder.map(([id]) => id);
  const currentIndex = Math.max(0, ids.indexOf(state.activeView));
  const nextIndex = Math.min(ids.length - 1, Math.max(0, currentIndex + direction));
  if (nextIndex !== currentIndex) setView(ids[nextIndex]);
}

function render() {
  const job = currentJob();
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
          <span class="status-pill">${escapeHtml(job.date || "-")} · ${escapeHtml(job.address || "주소 미입력")}</span>
          <button class="btn ghost" data-action="new-job">새 작업</button>
          <button class="btn primary" data-action="save">저장</button>
        </div>
      </header>
      <div class="layout">
        <aside class="sidebar">${renderNav()}</aside>
        <main class="content">${renderView()}</main>
      </div>
    </div>
  `;
  bindEvents();
  if (state.activeView === "tracker") drawIdleSpectrum();
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
    history: renderHistory,
  };
  return (views[state.activeView] || views.dashboard)(job);
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
        <button class="btn ghost" data-action="open-audio-app">녹음 앱 열기</button>
        <button class="btn primary" data-action="google-drive-save">구글저장</button>
      </div>
    </div>
    <section class="panel grid">
      <div class="info-grid">
        ${field("date", "날짜", "date", job.date)}
        ${field("address", "소비자 주소", "text", job.address, "예: 서울시 강남구 ...")}
        ${field("phone", "전화번호", "tel", job.phone, "010-0000-0000")}
      </div>
      ${textarea("situation", "상황 기록", job.situation, "누수 발생 위치, 시간, 피해상황, 고객 진술을 직접 입력합니다.")}
      <input class="hidden-input" id="externalAudioInput" type="file" accept="audio/*" capture />
      <div id="recordingStatus" class="muted">녹음 상태: 대기</div>
      <div id="driveStatus" class="drive-status">Google Drive: ${driveStatusText()}</div>
      ${renderGoogleDriveInlineSetup()}
      ${renderDriveMediaPicker()}
    </section>
    <section class="meter-cards" style="margin-top:14px">
      ${metric("점검 완료", countDone([...job.plumbingChecks, ...job.waterproofChecks]), `${job.plumbingChecks.length + job.waterproofChecks.length}개 중`)}
      ${metric("소견서", job.report ? "작성됨" : "미작성", "AI 초안")}
      ${metric("저장방식", state.storageMode === "local" ? "로컬" : "구글", "선택 옵션")}
    </section>
  `;
}

function renderDriveMediaPicker() {
  if (!driveSaveDraft?.active) return "";
  return `
    <div class="drive-setup">
      <h2>Google Drive 선택 업로드</h2>
      ${driveSaveDraft.wantPhotos ? `
        <label>사진 파일 선택
          <input data-drive-pick="photos" type="file" accept="image/*" multiple />
        </label>
        <p class="muted">선택됨: ${driveSaveDraft.photoFiles.length}개</p>
      ` : ""}
      ${driveSaveDraft.wantRecordings ? `
        <label>녹음 파일 선택
          <input data-drive-pick="recordings" type="file" accept="audio/*" multiple />
        </label>
        <p class="muted">선택됨: ${driveSaveDraft.recordingFiles.length}개</p>
      ` : ""}
      <div class="toolbar">
        <button class="btn primary" data-action="continue-google-drive-save">선택 완료 후 업로드</button>
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
        <p class="muted">개별 항목을 체크하고 결과와 메모를 저장합니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn ghost" data-action="reset-checks" data-type="all">초기화</button>
        <button class="btn primary" data-action="save">점검목록 저장</button>
      </div>
    </div>
    <section class="panel check-list">
      ${groups.map(([type, groupTitle, checks]) => `
        <h2 class="check-group-title">${groupTitle}</h2>
        ${checks.map((check) => renderCheckRow(type, check)).join("")}
      `).join("")}
    </section>
  `;
}

function renderCheckRow(type, check) {
  return `
    <div class="check-row">
      <input type="checkbox" ${check.done ? "checked" : ""} data-check="${check.id}" data-check-type="${type}" data-field="done" />
      <div>
        <strong>${escapeHtml(check.title)}</strong>
        <p class="muted">${escapeHtml(check.guide)}</p>
        <div class="mini-actions">
          <button class="btn ghost record-btn" data-action="record-check" data-check="${check.id}" data-check-type="${type}"><span class="voice-icon red"></span>녹음/저장</button>
          <button class="btn ghost clear-btn" data-action="clear-check" data-check="${check.id}" data-check-type="${type}">삭제</button>
        </div>
      </div>
      <div class="grid">
        <select data-check="${check.id}" data-check-type="${type}" data-field="result">
          ${["대기", "정상", "의심", "누수확인", "재검필요"].map((item) => `<option ${check.result === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
        <textarea data-check="${check.id}" data-check-type="${type}" data-field="memo" placeholder="점검 메모">${escapeHtml(check.memo)}</textarea>
      </div>
    </div>
  `;
}

function renderTracker(job) {
  return `
    <div class="section-head">
      <div>
        <h1>누수추적기</h1>
        <p class="muted">마이크 입력을 실시간 주파수 그래프로 표시하고, 블루투스/콤프레셔 제어 패널을 준비합니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn ghost" data-action="bluetooth">블루투스 연결</button>
        <button class="btn primary" data-action="start-spectrum">소리 분석 시작</button>
        <button class="btn warn" data-action="stop-spectrum">정지</button>
      </div>
    </div>
    <div class="split">
      <section class="audio-panel">
        <div class="toolbar" style="justify-content:space-between;margin-bottom:10px">
          <h2>실시간 주파수 그래프</h2>
          <span class="status-pill" id="peakStatus">최고 주파수 대역 대기</span>
        </div>
        <canvas id="spectrum" width="1100" height="360"></canvas>
        <p class="muted" style="color:#9fc2c8;margin-top:10px">높은 피크 대역은 주황색으로 표시됩니다. 저장/삭제 버튼은 추적 데이터 로그에 반영됩니다.</p>
      </section>
      <section class="panel grid">
        <h2>콤프레셔 제어</h2>
        <div class="pressure-dial"><span><b>${Number(job.pressureLive || 0).toFixed(1)}</b>bar</span></div>
        <div class="grid two">
          ${field("pressureSet", "압력 세팅값(bar)", "number", job.pressureSet, "", "0.1")}
          ${field("pressureLive", "실시간 압력값(bar)", "number", job.pressureLive, "", "0.1")}
        </div>
        <div class="toolbar">
          <button class="btn ${job.compressorOn ? "warn" : "primary"}" data-action="toggle-compressor">${job.compressorOn ? "콤프레셔 끄기" : "콤프레셔 켜기"}</button>
          <button class="btn ghost" data-action="save-tracker">자동저장</button>
          <button class="btn ghost" data-action="clear-tracker">삭제</button>
        </div>
        <p class="muted">연결 장치: ${escapeHtml(job.bluetoothDevice || "미연결")}</p>
      </section>
    </div>
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
        <button class="btn ghost" data-action="download-report-pdf">소견서 PDF 다운로드</button>
        <button class="btn ghost" data-action="clear-report">새로만들기</button>
      </div>
    </div>
    <div class="grid two">
      <section class="panel grid">
        <h2>사진 · 동영상 업로드</h2>
        ${fileBox("photos", "사진 추가")}
        ${fileBox("videos", "동영상 추가")}
        <div class="storage-row">
          <label><input type="radio" name="storage" value="local" ${state.storageMode === "local" ? "checked" : ""} /> 로컬에 저장</label>
          <label><input type="radio" name="storage" value="google" ${state.storageMode === "google" ? "checked" : ""} /> 구글클라우드 저장</label>
        </div>
      </section>
      <section class="panel grid">
        ${textarea("report", "소견서 내용", job.report, "소견서 자동생성 후 수정할 수 있습니다.")}
        <div class="toolbar">
          <button class="btn primary" data-action="save">수정 저장</button>
          <button class="btn warn" data-action="delete-report">삭제</button>
        </div>
      </section>
    </div>
  `;
}

function renderBlog(job) {
  return `
    <div class="section-head">
      <div>
        <h1>블로그 글 작성</h1>
        <p class="muted">소견서, 사진, 동영상 목록을 기반으로 고객 설명형 블로그 글을 생성합니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn primary" data-action="generate-blog">블로그 글 작성</button>
        <button class="btn ghost" data-action="add-blog-photo">사진 올리기</button>
        <button class="btn ghost" data-action="copy-blog">복사</button>
      </div>
    </div>
    <div class="grid two">
      <section class="panel grid">
        ${fileBox("blogPhotos", "블로그 사진")}
        ${textarea("blog", "블로그 원고", job.blog, "생성된 블로그 글을 수정합니다.")}
        <input class="hidden-input" id="blogPhotoInput" data-file-type="blogPhotos" type="file" accept="image/*" multiple />
        <button class="btn primary" data-action="save">저장</button>
      </section>
      <section class="panel">
        <h2 style="margin-bottom:10px">견본 미리보기</h2>
        <div class="preview">${escapeHtml(job.blog || "블로그 글을 작성하면 미리보기가 표시됩니다.")}</div>
      </section>
    </div>
  `;
}

function renderEstimate(job) {
  const items = job.estimateItems || [];
  const supplyTotal = items.reduce((sum, item) => sum + estimateLineTotal(item), 0);
  const tax = Math.round(supplyTotal * 0.1);
  const total = supplyTotal + tax;
  const estimateNo = job.estimateNo || `WL-${(job.date || "").replaceAll("-", "") || "00000000"}`;
  const docTitle = job.estimateDocTitle || "견 적 서";
  return `
    <div class="section-head">
      <div>
        <h1>견적서 작성</h1>
        <p class="muted">날짜와 주소는 현장 기본정보에서 자동 입력됩니다. 내용과 비용은 직접 입력합니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn ghost" data-action="toggle-estimate-title">제목 바꾸기</button>
        <button class="btn ghost" data-action="add-estimate">품명 추가</button>
        <button class="btn primary" data-action="save">저장 및 수정</button>
        <button class="btn ghost" data-action="download-estimate-pdf">견적서 PDF 다운로드</button>
      </div>
    </div>
    <section class="print-area estimate-form">
      <h2 class="estimate-title">${escapeHtml(docTitle)}</h2>
      <div class="estimate-meta">
        ${field("estimateNo", "견적번호", "text", estimateNo)}
        ${field("date", "견적일자", "date", job.date)}
        ${field("estimateValidUntil", "유효기간", "date", job.estimateValidUntil || "")}
      </div>
      <table class="table estimate-info">
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
            <th>공급자 주소</th><td>${inlineField("vendorAddress", job.vendorAddress || PROVIDER.address, "공급자 주소")}</td>
          </tr>
        </tbody>
      </table>
      <table class="table" style="margin-top:16px">
        <thead><tr><th>품명</th><th style="width:90px">수량</th><th style="width:150px">공급가액</th><th class="no-print" style="width:80px">관리</th></tr></thead>
        <tbody>
          ${items.map((item, index) => `
            <tr>
              <td><textarea class="estimate-item-name" data-estimate="${index}" data-field="name" placeholder="예: 누수 진단 및 온수 배관 보수">${escapeHtml([item.name, item.spec].filter(Boolean).join(" / "))}</textarea></td>
              <td><input data-estimate="${index}" data-field="qty" type="number" value="${escapeAttr(item.qty || 1)}" placeholder="1" /></td>
              <td><input data-estimate="${index}" data-field="cost" type="number" value="${escapeAttr(estimateLineTotal(item) || "")}" placeholder="0" /></td>
              <td class="no-print"><button class="btn warn" data-action="remove-estimate" data-index="${index}">삭제</button></td>
            </tr>
          `).join("")}
          <tr><th colspan="2">공급가액</th><td colspan="2"><strong>${supplyTotal.toLocaleString()}원</strong></td></tr>
          <tr><th colspan="2">부가세</th><td colspan="2"><strong>${tax.toLocaleString()}원</strong></td></tr>
          <tr class="estimate-total"><th colspan="2">합계금액</th><td colspan="2"><strong>${total.toLocaleString()}원</strong></td></tr>
        </tbody>
      </table>
      <div class="estimate-note">
        ${textarea("estimateNote", "비고", job.estimateNote || "상기 견적은 현장 상황 및 추가 작업 범위에 따라 변경될 수 있습니다.", "비고")}
      </div>
      <div class="estimate-sign">공급자 확인: ${escapeHtml(PROVIDER.owner)} ${stampSealImage("stamp-seal")}</div>
    </section>
  `;
}

function renderHistory() {
  const query = document.querySelector("#historyQuery")?.value || "";
  const jobs = state.jobs
    .filter((job) => `${job.date} ${job.address} ${job.phone} ${job.situation}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));
  return `
    <div class="section-head">
      <div>
        <h1>전체 작업 상황 리스트</h1>
        <p class="muted">날짜별 작업 목록을 찾고 출력할 수 있습니다.</p>
      </div>
      <div class="toolbar">
        <input id="historyQuery" value="${escapeAttr(query)}" placeholder="주소, 전화번호, 내용 찾기" />
        <button class="btn ghost" data-action="print">출력</button>
      </div>
    </div>
    <section class="list">
      ${jobs.map((job) => `
        <div class="list-item">
          <strong>${escapeHtml(job.date)}</strong>
          <div>
            <b>${escapeHtml(job.address || "주소 미입력")}</b>
            <p class="muted">${escapeHtml(job.phone || "-")} · 기본 ${countDone(job.plumbingChecks)}/${job.plumbingChecks.length}, 방수 ${countDone(job.waterproofChecks)}/${job.waterproofChecks.length}</p>
          </div>
          <button class="btn ghost" data-action="select-job" data-id="${job.id}">열기</button>
        </div>
      `).join("") || `<div class="list-item">검색 결과가 없습니다.</div>`}
    </section>
  `;
}

function field(id, label, type, value, placeholder = "", step = "") {
  return `
    <div class="field">
      <label for="${id}">${label}</label>
      <input id="${id}" data-job-field="${id}" type="${type}" value="${escapeAttr(value ?? "")}" placeholder="${escapeAttr(placeholder)}" ${step ? `step="${step}"` : ""} />
    </div>
  `;
}

function inlineField(id, value, placeholder = "") {
  return `<input class="inline-input" data-job-field="${id}" value="${escapeAttr(value || "")}" placeholder="${escapeAttr(placeholder)}" />`;
}

function textarea(id, label, value, placeholder = "") {
  return `
    <div class="field">
      <label for="${id}">${label}</label>
      <textarea id="${id}" data-job-field="${id}" placeholder="${escapeAttr(placeholder)}">${escapeHtml(value || "")}</textarea>
    </div>
  `;
}

function textareaWithRecord(id, label, value, placeholder = "") {
  return `
    <div class="field">
      <div class="field-head">
        <label for="${id}">${label}</label>
        <div class="mini-actions">
          <button class="btn ghost record-btn" data-action="record-field" data-field="${id}"><span class="voice-icon red"></span>녹음/저장</button>
          <button class="btn ghost clear-btn" data-action="clear-field" data-field="${id}">삭제</button>
        </div>
      </div>
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
  return `
    <div class="file-box">
      <span>${label}: ${files.length ? files.map(escapeHtml).join(", ") : "없음"}</span>
      <input data-file-type="${type}" type="file" ${type === "photos" ? "accept=\"image/*\"" : "accept=\"video/*\""} multiple />
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
      maybeAddEstimateRow(input);
      job.updatedAt = new Date().toISOString();
      saveState();
    });
  });

  app.querySelectorAll("[data-file-type]").forEach((input) => {
    input.addEventListener("change", () => {
      const job = currentJob();
      job[input.dataset.fileType] = Array.from(input.files).map((file) => file.name);
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

  app.querySelectorAll("input[name='storage']").forEach((input) => {
    input.addEventListener("change", () => {
      state.storageMode = input.value;
      saveState();
    });
  });

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action, button.dataset));
  });

  const historyQuery = app.querySelector("#historyQuery");
  if (historyQuery) historyQuery.addEventListener("input", render);

  bindSwipeNavigation();
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
    notify("저장되었습니다.");
  }
  if (action === "new-job") {
    const next = createJob();
    state.jobs.unshift(next);
    state.currentJobId = next.id;
    state.activeView = "dashboard";
    saveState();
    render();
  }
  if (action === "show-app-map") openExternalMap(job.address, "kakao");
  if (action === "open-audio-app") openDeviceFilePicker("audio");
  if (action === "google-drive-save") saveCurrentJobToGoogleDrive();
  if (action === "save-google-settings" && saveGoogleSettingsFromForm()) saveCurrentJobToGoogleDrive();
  if (action === "continue-google-drive-save") continueGoogleDriveSave();
  if (action === "cancel-google-drive-save") {
    driveSaveDraft = null;
    render();
    notify("Google Drive 선택 업로드를 취소했습니다.");
  }
  if (action === "record-field") toggleRecording({ kind: "field", field: data.field });
  if (action === "clear-field") clearField(data.field);
  if (action === "record-check") toggleRecording({ kind: "check", type: data.checkType, id: data.check });
  if (action === "clear-check") clearCheckMemo(data.checkType, data.check);
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
  if (action === "bluetooth") connectBluetooth();
  if (action === "start-spectrum") startSpectrum();
  if (action === "stop-spectrum") stopSpectrum();
  if (action === "toggle-compressor") updateJob({ compressorOn: !job.compressorOn });
  if (action === "save-tracker") notify("추적 데이터가 현재 작업에 저장되었습니다.");
  if (action === "clear-tracker") notify("화면 그래프 로그를 삭제했습니다.");
  if (action === "generate-report") updateJob({ report: generateReport(job) });
  if (action === "download-report-pdf") openPdfPrintWindow("report");
  if (action === "clear-report" || action === "delete-report") updateJob({ report: "" });
  if (action === "generate-blog") updateJob({ blog: generateBlog(job) });
  if (action === "add-blog-photo") document.querySelector("#blogPhotoInput")?.click();
  if (action === "copy-blog") copyText(job.blog);
  if (action === "toggle-estimate-title") toggleEstimateTitle();
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
  if (action === "select-job") {
    state.currentJobId = data.id;
    state.activeView = "dashboard";
    saveState();
    render();
  }
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

async function saveCurrentJobToGoogleDrive() {
  try {
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
    const wantPhotos = confirm("사진폴더를 만들고 사진을 업로드하시겠습니까? y/n");
    const wantRecordings = confirm("녹음폴더를 만들고 녹음파일을 업로드하시겠습니까? y/n");
    const prepared = await prepareGoogleDriveSave(wantPhotos, wantRecordings);
    if (wantPhotos || wantRecordings) {
      driveSaveDraft = {
        active: true,
        wantPhotos,
        wantRecordings,
        photoFiles: [],
        recordingFiles: [],
        prepared,
      };
      render();
      notify("PDF와 폴더를 먼저 만들었습니다. 화면 아래에서 사진/녹음파일을 선택하세요.");
      return;
    }
    notify(`Google Drive 저장 완료: ${prepared.dateFolder.name} 폴더 · PDF 2개`);
  } catch (error) {
    notify(`Google Drive 저장 실패: ${driveErrorMessage(error)}`);
    console.error(error);
  }
}

async function continueGoogleDriveSave() {
  if (!driveSaveDraft?.active) return;
  const photoFiles = driveSaveDraft.photoFiles || [];
  const recordingFiles = driveSaveDraft.recordingFiles || [];
  if (driveSaveDraft.wantPhotos && !photoFiles.length && !confirm("사진을 선택하지 않았습니다. 사진 없이 계속할까요?")) return;
  if (driveSaveDraft.wantRecordings && !recordingFiles.length && !confirm("녹음파일을 선택하지 않았습니다. 녹음 없이 계속할까요?")) return;
  const prepared = driveSaveDraft.prepared;
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
  const dateFolder = await ensureDriveFolder(token, job.date || new Date().toISOString().slice(0, 10), mainFolder.id);
  const baseName = safeFileName(job.address || "주소미입력");
  const reportBlob = await createDocumentPdfBlob("report", job);
  const estimateBlob = await createDocumentPdfBlob("estimate", job);
  await uploadBlobToDrive(token, dateFolder.id, `${baseName}-소견서.pdf`, reportBlob, "application/pdf");
  await uploadBlobToDrive(token, dateFolder.id, `${baseName}-견적서.pdf`, estimateBlob, "application/pdf");
  const photoFolder = wantPhotos ? await ensureDriveFolder(token, "사진", dateFolder.id) : null;
  const recordingFolder = wantRecordings ? await ensureDriveFolder(token, "녹음", dateFolder.id) : null;
  return { token, dateFolder, baseName, photoFolder, recordingFolder };
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
    notify(`Google Drive 저장 완료: ${prepared.dateFolder.name} 폴더 · 사진 ${photoCount}개 · 녹음 ${recordingCount}개`);
  } catch (error) {
    notify(`Google Drive 업로드 실패: ${driveErrorMessage(error)}`);
    console.error(error);
  }
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
  const report = job.report || generateReport(job);
  return paginatePdfLines([
    { text: "누수진단 소견서", size: 32, bold: true, align: "center", gap: 18 },
    { text: `진단일자: ${job.date || ""}`, size: 16 },
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
  const supplyTotal = items.reduce((sum, item) => sum + estimateLineTotal(item), 0);
  const tax = Math.round(supplyTotal * 0.1);
  const total = supplyTotal + tax;
  return paginatePdfLines([
    { text: job.estimateDocTitle || "견 적 서", size: 32, bold: true, align: "center", gap: 18 },
    { text: `견적일자: ${job.date || ""}`, size: 16 },
    { text: `견적번호: ${job.estimateNo || `WL-${(job.date || "").replaceAll("-", "")}`}`, size: 16 },
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
    { text: `공급가액: ${supplyTotal.toLocaleString()}원`, size: 17, align: "right" },
    { text: `부가세: ${tax.toLocaleString()}원`, size: 17, align: "right" },
    { text: `합계금액: ${total.toLocaleString()}원`, size: 20, bold: true, align: "right", gap: 16 },
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
    stopWavRecording();
    notify("녹음을 종료했습니다.");
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordingTarget = target;
    await startWavRecording(stream);
    render();
    notify("녹음 중입니다. 다시 누르면 저장합니다.");
  } catch (error) {
    notify("마이크 권한을 확인하세요.");
  }
}

async function startWavRecording(stream) {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(4096, 1, 1);
  const samples = [];
  processor.onaudioprocess = (event) => {
    if (!wavRecorder?.recording) return;
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
  appendTargetText(target, `녹음파일 저장: ${savedName}`);
  recordingTarget = null;
  wavRecorder = null;
  saveState();
  render();
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
  const report = job.report || generateReport(job);
  return `
    <h1>누수진단 소견서</h1>
    <table>
      <tbody>
        <tr><th>진단일자</th><td>${escapeHtml(job.date || "")}</td><th>연락처</th><td>${escapeHtml(job.phone || "")}</td></tr>
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
  `;
}

function buildEstimatePrintHtml(job) {
  const items = job.estimateItems || [];
  const supplyTotal = items.reduce((sum, item) => sum + estimateLineTotal(item), 0);
  const tax = Math.round(supplyTotal * 0.1);
  const total = supplyTotal + tax;
  return `
    <h1>${escapeHtml(job.estimateDocTitle || "견 적 서")}</h1>
    <table>
      <tbody>
        <tr><th>견적일자</th><td>${escapeHtml(job.date || "")}</td><th>견적번호</th><td>${escapeHtml(job.estimateNo || `WL-${(job.date || "").replaceAll("-", "")}`)}</td></tr>
        <tr><th colspan="2">수신</th><th colspan="2">공급자</th></tr>
        <tr><th>고객명</th><td>${escapeHtml(job.customerName || "")}</td><th>상호</th><td>${escapeHtml(PROVIDER.name)}</td></tr>
        <tr><th>주소</th><td>${escapeHtml(job.address || "")}</td><th>사업자번호</th><td>${escapeHtml(PROVIDER.bizNo)}</td></tr>
        <tr><th>전화번호</th><td>${escapeHtml(job.phone || "")}</td><th>대표/담당</th><td>${escapeHtml(PROVIDER.owner)}</td></tr>
        <tr><th>공사명</th><td>${escapeHtml(job.workSummary || "누수 진단 및 보수 공사")}</td><th>공급자 주소</th><td>${escapeHtml(PROVIDER.address)}</td></tr>
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
        <tr><th colspan="2" class="right">공급가액</th><td class="right">${supplyTotal.toLocaleString()}원</td></tr>
        <tr><th colspan="2" class="right">부가세</th><td class="right">${tax.toLocaleString()}원</td></tr>
        <tr class="total"><th colspan="2" class="right">합계금액</th><td class="right">${total.toLocaleString()}원</td></tr>
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

async function connectBluetooth() {
  if (!navigator.bluetooth) {
    notify("이 브라우저는 Web Bluetooth를 지원하지 않습니다.");
    return;
  }
  try {
    const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
    updateJob({ bluetoothDevice: device.name || device.id || "Bluetooth 장치" });
  } catch (error) {
    notify("블루투스 연결이 취소되었습니다.");
  }
}

async function startSpectrum() {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(micStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    renderSpectrum();
  } catch (error) {
    notify("마이크 분석을 시작할 수 없습니다.");
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
  drawIdleSpectrum();
}

function renderSpectrum() {
  const canvas = document.querySelector("#spectrum");
  if (!canvas || !analyser) return;
  const ctx = canvas.getContext("2d");
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#071316";
  ctx.fillRect(0, 0, width, height);
  const barWidth = width / data.length;
  let peakIndex = 0;
  let peakValue = 0;
  data.forEach((value, index) => {
    if (value > peakValue) {
      peakValue = value;
      peakIndex = index;
    }
  });
  data.forEach((value, index) => {
    const barHeight = (value / 255) * height;
    ctx.fillStyle = index === peakIndex || value > 190 ? "#e47c24" : "#28b5a8";
    ctx.fillRect(index * barWidth, height - barHeight, Math.max(1, barWidth - 1), barHeight);
  });
  const status = document.querySelector("#peakStatus");
  if (status) status.textContent = `최고 피크: ${peakIndex}번 대역 · ${peakValue}`;
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

function updatePressureDial(value) {
  const dial = document.querySelector(".pressure-dial b");
  if (dial) dial.textContent = Number(value || 0).toFixed(1);
}

function generateReport(job) {
  const plumbingIssues = job.plumbingChecks.filter((check) => check.done && check.result !== "정상");
  const waterproofIssues = job.waterproofChecks.filter((check) => check.done && check.result !== "정상");
  return `[누수진단 소견서]

진단일자: ${job.date}
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

4. 종합 의견
${plumbingIssues.length ? "배관 계통 누수 가능성이 확인 또는 의심됩니다. 압력검사, 청음, 열화상/가스탐지 등 다각적 추적을 권장합니다." : "기본 배관 점검에서는 중대한 누수 징후가 제한적입니다."}
${waterproofIssues.length ? "외부 요인 또는 방수층 문제 가능성도 함께 검토해야 합니다." : "방수 및 외부 요인은 현재 기록 기준 특이사항이 적습니다."}

5. 첨부자료
사진: ${(job.photos || []).join(", ") || "없음"}
동영상: ${(job.videos || []).join(", ") || "없음"}`;
}

function generateBlog(job) {
  const titleAddress = job.address ? `${job.address} 누수진단` : "누수진단 현장";
  return `${titleAddress} 작업 기록

오늘은 ${job.date}에 접수된 누수 의심 현장을 방문해 기본 배관 점검과 방수 관련 점검을 함께 진행했습니다.

현장에서 확인한 주요 상황은 다음과 같습니다.
${job.situation || "고객 진술과 피해 위치를 기준으로 누수 범위를 좁혀 확인했습니다."}

먼저 변기부속, 온수라인, 각 밸브류를 순서대로 잠그고 열면서 계량기 반응을 확인했습니다. 이후 창틀, 우수관, 화장실 방수상태, 유가, 변기 주변 상태를 확인해 외부 유입과 방수 문제 가능성도 함께 검토했습니다.

점검 요약
${summaryLines([...job.plumbingChecks, ...job.waterproofChecks])}

이번 현장은 단순히 한 지점만 보는 방식이 아니라 배관, 방수, 외부 요인을 나누어 확인하는 것이 중요했습니다. 누수는 원인이 여러 방향으로 겹칠 수 있기 때문에 기록을 남기고 순서대로 배제하는 과정이 필요합니다.

첨부자료: 사진 ${(job.photos || []).length}개, 동영상 ${(job.videos || []).length}개`;
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

function notify(message) {
  const status = document.querySelector("#recordingStatus") || document.querySelector("#peakStatus");
  if (status) status.textContent = message;
  else alert(message);
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
