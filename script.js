
document.addEventListener("DOMContentLoaded", () => {

  let utcTimer = null;

  // =========================
  // 적군 시간 입력 활성화
  // =========================

  const useEnemyCheckbox = document.getElementById("useEnemyTimeCheckbox");
  const rallyRemainInput = document.getElementById("rallyRemainTime");
  const enemyMarchInput = document.getElementById("enemyMarchTime");

  function toggleEnemyInputs() {
    const enabled = useEnemyCheckbox.checked;

    rallyRemainInput.disabled = !enabled;
    enemyMarchInput.disabled = !enabled;

    rallyRemainInput.classList.toggle("bg-gray-200", !enabled);
    enemyMarchInput.classList.toggle("bg-gray-200", !enabled);
  }

  if (useEnemyCheckbox && rallyRemainInput && enemyMarchInput) {
    useEnemyCheckbox.checked = true;
    useEnemyCheckbox.addEventListener("change", toggleEnemyInputs);
    toggleEnemyInputs();
  }

  // =========================
  // UTC 자동 입력
  // =========================

  const useUtcCheckbox = document.getElementById("useUtcCheckbox");
  const utcInput = document.getElementById("utcTime");

  if (useUtcCheckbox) {
    useUtcCheckbox.checked = true;
  }

  if (rallyRemainInput && utcInput && useUtcCheckbox) {
    rallyRemainInput.addEventListener("input", () => {

      if (!useUtcCheckbox.checked) return;

      if (!/^\d{2}:\d{2}:\d{2}$/.test(rallyRemainInput.value)) return;

      const now = new Date();

      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");

      utcInput.value = `${h}:${m}:${s}`;
    });
  }

  // =========================
  // 리셋 버튼
  // =========================

  const resetRally = document.getElementById("resetRallyRemainTime");

  if (resetRally) {
    resetRally.onclick = () => {
      document.getElementById("rallyRemainTime").value = "";
    };
  }

  const resetEnemy = document.getElementById("resetEnemyMarchTime");

  if (resetEnemy) {
    resetEnemy.onclick = () => {
      document.getElementById("enemyMarchTime").value = "";
    };
  }

  const resetTarget = document.getElementById("resetEditTargetTime");

  if (resetTarget) {
    resetTarget.onclick = () => {
      document.getElementById("EditTargetTime").value = "00:00:00";
    };
  }

  const resetUtc = document.getElementById("resetUtcTime");

  if (resetUtc) {
    resetUtc.onclick = () => {
      document.getElementById("utcTime").value = "";
    };
  }

  const resetMarch = document.getElementById("btnResetMarch");

  if (resetMarch) {
    resetMarch.onclick = () => {
      document.getElementById("marchBulkInput").value = "";
      localStorage.removeItem("marchBulk");
    };
  }

  // attackrallyStartTime 리셋
  const resetAttackRally = document.getElementById("resetattackrallyStartTime");

  if (resetAttackRally) {
    resetAttackRally.onclick = () => {
      document.getElementById("attackrallyStartTime").value = "";
    };
  }

  // marchBulkInput2 리셋
  const resetAttackMarch = document.getElementById("resetattackMarchTime");

  if (resetAttackMarch) {
    resetAttackMarch.onclick = () => {
      document.getElementById("marchBulkInput2").value = "";
      localStorage.removeItem("marchBulk2");
    };
  }

  // Switching 목표시간 리셋
  const resetSwitching = document.getElementById("resetswitchingTime");

  if (resetSwitching) {
    resetSwitching.onclick = () => {
      document.getElementById("switchingTime").value = "";
    };
  }

  // =========================
  // 탭 전환
  // =========================

  const tabs = {
    tabRally: document.getElementById("rallyTab"),
    tabSwitch: document.getElementById("switchTab"),
    tabCont: document.getElementById("contTab"),
    tabTime: document.getElementById("TimeTab"),
    tabMarch: document.getElementById("marchTab"),
  };

  const buttons = {
    tabRally: document.getElementById("tabRally"),
    tabSwitch: document.getElementById("tabSwitch"),
    tabCont: document.getElementById("tabCont"),
    tabTime: document.getElementById("tabTime"),
    tabMarch: document.getElementById("tabMarch"),
  };

  function switchTab(activeKey) {

    // 모든 탭 숨김
    Object.values(tabs).forEach(tab => {
      tab.classList.add("hidden");
    });

    // 모든 버튼 비활성화
    Object.values(buttons).forEach(btn => {
      btn.classList.remove("bg-blue-500", "text-white");
      btn.classList.add("bg-gray-300");
    });

    // 선택한 탭 표시
    tabs[activeKey].classList.remove("hidden");

    // 선택한 버튼 활성화
    buttons[activeKey].classList.add("bg-blue-500", "text-white");
    buttons[activeKey].classList.remove("bg-gray-300");
  }

  // 탭 클릭 이벤트
  Object.keys(buttons).forEach(key => {
    buttons[key].onclick = () => switchTab(key);
  });

  // 최초 Timer 탭 표시
  switchTab("tabTime");

  // =========================
  // 자동 콜론 입력
  // =========================

  function autoColon(input) {

    input.addEventListener("input", () => {

      let raw = input.value.replace(/[^0-9]/g, "").slice(0, 6);

      if (raw.length >= 5) {
        input.value = raw.replace(/(\d{2})(\d{2})(\d{0,2})/, "$1:$2:$3");
      } else if (raw.length >= 3) {
        input.value = raw.replace(/(\d{2})(\d{0,2})/, "$1:$2");
      } else {
        input.value = raw;
      }

    });
  }

  [
    "rallyRemainTime",
    "enemyMarchTime",
    "utcTime",
    "switchingTime",
    "attackrallyStartTime",
    "EditTargetTime"
  ].forEach(id => {

    const el = document.getElementById(id);

    if (el) autoColon(el);
  });

  // =========================
  // 시간 변환
  // =========================

  function parseTime(str) {

    if (!str) return null;

    const p = str.split(":").map(Number);

    if (p.length !== 3) return null;

    return p[0] * 3600 + p[1] * 60 + p[2];
  }

  function secToMinSec(sec) {

    if (sec < 0) sec = 0;

    const m = Math.floor(sec / 60) % 60;
    const s = sec % 60;

    return `${m}분 ${s}초`;
  }

  function secToHHMMSS(sec) {

    if (sec < 0) sec = 0;

    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  }

  // =========================
  // Bulk 행군 파싱
  // =========================

  function parseMarchBulk() {

    const txt = document.getElementById("marchBulkInput").value.trim();

    if (!txt) return [];

    const tokens = txt.replace(/\n/g, " ").split(/\s+/);

    let result = [];

    tokens.forEach(t => {

      const m = t.match(/^(.+?)(\d+)$/);

      if (!m) return;

      result.push({
        id: m[1],
        sec: Number(m[2])
      });

    });

    return result;
  }

  // =========================
  // UTC 시계
  // =========================

  function formatUTC(date) {

    const h = String(date.getUTCHours()).padStart(2, "0");
    const m = String(date.getUTCMinutes()).padStart(2, "0");
    const s = String(date.getUTCSeconds()).padStart(2, "0");

    return `${h}:${m}:${s}`;
  }

  // =========================
  // 복사 메시지
  // =========================

  function showCopyMessage(text, x, y) {

    const popup = document.getElementById("copyPopup");

    if (!popup) return;

    popup.innerHTML = `<strong>${text}</strong> 복사됨`;

    popup.style.position = "fixed";
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.bottom = "auto";

    popup.style.transform = "translate(-50%, -120%)";

    popup.style.background = "rgba(40,40,40,0.92)";
    popup.style.color = "#fff";
    popup.style.fontWeight = "700";
    popup.style.fontSize = "14px";

    popup.style.border = "none";
    popup.style.borderRadius = "10px";

    popup.style.padding = "10px 14px";
    popup.style.whiteSpace = "nowrap";

    popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.35)";
    popup.style.zIndex = "9999";

    popup.style.display = "block";

    setTimeout(() => {
      popup.style.display = "none";
    }, 1500);
  }

  // =========================
  // 쉬운 주유 계산
  // =========================

  document.getElementById("btnCalcExplain").onclick = () => {

    const rally = parseTime(document.getElementById("rallyRemainTime").value);
    const enemy = parseTime(document.getElementById("enemyMarchTime").value);
    const utc = parseTime(document.getElementById("utcTime").value);

    if (rally === null || enemy === null || utc === null) {
      alert("시간 형식 HH:mm:ss");
      return;
    }

    const total = rally + enemy + utc;

    document.getElementById("explainStart1").textContent = "<행군> | 주유시간";

    const offsets = [60, 55, 50, 45, 40, 35, 30];

    offsets.forEach((o, i) => {

      const sec = total - o;

      document.getElementById("explain" + (i + 1)).textContent =
        `*${o}초* | ${secToMinSec(sec)}`;

    });

  };

  // =========================
  // 지정 주유 계산
  // =========================

  document.getElementById("btnCalcExplain2").onclick = () => {

    const rally = parseTime(document.getElementById("rallyRemainTime").value);
    const enemy = parseTime(document.getElementById("enemyMarchTime").value);
    const utc = parseTime(document.getElementById("utcTime").value);

    if (rally === null || enemy === null || utc === null) {
      alert("시간 형식 HH:mm:ss");
      return;
    }

    const total = rally + enemy + utc;

    const marches = parseMarchBulk();

    const container = document.getElementById("explain2Container");

    container.innerHTML = "";

    marches.forEach(m => {

      const sec = total - m.sec;

      const el = document.createElement("div");

      el.textContent = `${m.id}(${m.sec}) - ${secToMinSec(sec)}`;

      container.appendChild(el);

    });

  };

  // =========================
  // 공통 복사 기능
  // =========================

  function copyExplain(prefix, count, startId = null) {

    let txt = [];

    if (startId) {

      const title = document.getElementById(startId);

      if (title && title.textContent.trim() !== "") {
        txt.push(title.textContent);
      }
    }

    for (let i = 1; i <= count; i++) {

      const el = document.getElementById(prefix + i);

      if (el && el.textContent.trim() !== "") {
        txt.push(el.textContent);
      }
    }

    if (txt.length) {
      navigator.clipboard.writeText(txt.join("\n"));
    }
  }

  // =========================
  // 컨테이너 스마트 복사
  // =========================

  function smartCopy(containerId) {

    const container = document.getElementById(containerId);

    if (!container) return;

    const rows = container.querySelectorAll("div");
    const count = rows.length;

    // 10줄 이하: 바로 복사
    if (count <= 10) {

      const txt = [...rows].map(r => r.textContent).join("\n");

      navigator.clipboard.writeText(txt);

      return;
    }

    // 10줄 초과: 구간 선택
    showCopyPopup(containerId, count);
  }

  // =========================
  // 구간 선택 복사 팝업
  // =========================

  function showCopyPopup(containerId, count) {

    const popup = document.getElementById("copyPopup");

    if (!popup) return;

    popup.innerHTML = "";

    const rows = document.querySelectorAll(`#${containerId} div`);

    for (let start = 0; start < count; start += 10) {

      const end = Math.min(start + 10, count);

      const btn = document.createElement("button");

      btn.textContent = `○ [${start + 1}~${end}]줄 복사하기`;

      btn.style.display = "block";
      btn.style.width = "100%";
      btn.style.textAlign = "left";
      btn.style.padding = "10px";
      btn.style.border = "none";
      btn.style.borderBottom = "1px solid #ddd";
      btn.style.background = "white";
      btn.style.cursor = "pointer";

      btn.onclick = () => {

        let txt = [];

        for (let i = start; i < end; i++) {
          txt.push(rows[i].textContent);
        }

        navigator.clipboard.writeText(txt.join("\n"));

        popup.style.display = "none";
      };

      popup.appendChild(btn);
    }

    popup.style.display = "block";
  }

  // =========================
  // Switching 목표시간 복사
  // =========================

  const copySwitchBtn = document.getElementById("copyswitchingTime");

  if (copySwitchBtn) {

    copySwitchBtn.onclick = () => {

      const input = document.getElementById("switchingTime");

      navigator.clipboard.writeText(input.value);
    };
  }

  // =========================
  // 복사 버튼 연결
  // =========================

  // 쉬운 주유
  const btn1 = document.getElementById("btnCopyExplain");

  if (btn1) {
    btn1.onclick = () => copyExplain("explain", 7, "explainStart1");
  }

  // 지정 주유
  const btn2 = document.getElementById("btnCopyExplain2");

  if (btn2) {
    btn2.onclick = () => smartCopy("explain2Container");
  }

  // 쉬운 스위칭
  const btn3 = document.getElementById("btnCopyExplain3");

  if (btn3) {
    btn3.onclick = () => copyExplain("explain3", 7, "explainStart31");
  }

  // 지정 스위칭
  const btn4 = document.getElementById("btnCopyExplain4");

  if (btn4) {
    btn4.onclick = () => smartCopy("explain4Container");
  }

  // 연집
  const btn5 = document.getElementById("btnCopyExplain5");

  if (btn5) {
    btn5.onclick = () => smartCopy("explain5Container");
  }

  // =========================
  // Bulk 저장
  // =========================

  const bulk = document.getElementById("marchBulkInput");

  if (bulk) {

    bulk.value = localStorage.getItem("marchBulk") || "";

    bulk.addEventListener("input", () => {
      localStorage.setItem("marchBulk", bulk.value);
    });
  }

  const bulk2 = document.getElementById("marchBulkInput2");

  if (bulk2) {

    bulk2.value = localStorage.getItem("marchBulk2") || "";

    bulk2.addEventListener("input", () => {
      localStorage.setItem("marchBulk2", bulk2.value);
    });
  }

  // =========================
  // Timer 보정 시간 조절
  // =========================

  // -10초
  const minusBtn2 = document.getElementById("minus10ss");

  if (minusBtn2) {

    minusBtn2.onclick = () => {

      const input = document.getElementById("EditTargetTime");

      if (!input.value) {
        alert("스위칭 목표시간 입력 필요");
        return;
      }

      const sec = parseTime(input.value);

      if (sec === null) {
        alert("시간 형식 HH:mm:ss");
        return;
      }

      input.value = secToHHMMSS(sec - 10);
    };
  }

  // +10초
  const plusBtn2 = document.getElementById("plus10ss");

  if (plusBtn2) {

    plusBtn2.onclick = () => {

      const input = document.getElementById("EditTargetTime");

      if (!input.value) {
        alert("스위칭 목표시간 입력 필요");
        return;
      }

      const sec = parseTime(input.value);

      if (sec === null) {
        alert("시간 형식 HH:mm:ss");
        return;
      }

      input.value = secToHHMMSS(sec + 10);
    };
  }

  // +1분
  const plusBtn5m = document.getElementById("plus5m");

  if (plusBtn5m) {

    plusBtn5m.onclick = () => {

      const input = document.getElementById("EditTargetTime");

      if (!input.value) {
        alert("스위칭 목표시간 입력 필요");
        return;
      }

      const sec = parseTime(input.value);

      if (sec === null) {
        alert("시간 형식 HH:mm:ss");
        return;
      }

      input.value = secToHHMMSS(sec + 60);
    };
  }

  // +5분
  const plusBtn6m = document.getElementById("plus6m");

  if (plusBtn6m) {

    plusBtn6m.onclick = () => {

      const input = document.getElementById("EditTargetTime");

      if (!input.value) {
        alert("스위칭 목표시간 입력 필요");
        return;
      }

      const sec = parseTime(input.value);

      if (sec === null) {
        alert("시간 형식 HH:mm:ss");
        return;
      }

      input.value = secToHHMMSS(sec + 300);
    };
  }

  // -1분
  const minusBtn5m = document.getElementById("minus5m");

  if (minusBtn5m) {

    minusBtn5m.onclick = () => {

      const input = document.getElementById("EditTargetTime");

      if (!input.value) {
        alert("스위칭 목표시간 입력 필요");
        return;
      }

      const sec = parseTime(input.value);

      if (sec === null) {
        alert("시간 형식 HH:mm:ss");
        return;
      }

      input.value = secToHHMMSS(sec - 60);
    };
  }

  // =========================
  // 쉬운 스위칭 계산
  // =========================

  const btnCalc3 = document.getElementById("btnCalcExplain3");

  if (btnCalc3) {

    btnCalc3.onclick = () => {

      const base = parseTime(document.getElementById("switchingTime").value);

      if (base === null) {
        alert("스위칭 목표시간 입력 필요");
        return;
      }

      document.getElementById("explainStart31").textContent = "<스위칭> | 출발시간";

      const offsets = [60, 55, 50, 45, 40, 35, 30];

      offsets.forEach((o, i) => {

        const sec = base - o;

        document.getElementById("explain3" + (i + 1)).textContent =
          `*${o}초* | ${secToMinSec(sec)}`;

      });
    }
  }

  // =========================
  // 지정 스위칭 계산
  // =========================

  const btnCalc4 = document.getElementById("btnCalcExplain4");

  if (btnCalc4) {

    btnCalc4.onclick = () => {

      const base = parseTime(document.getElementById("switchingTime").value);

      if (base === null) {
        alert("스위칭 목표시간 입력 필요");
        return;
      }

      const marches = parseMarchBulk();

      const container = document.getElementById("explain4Container");

      container.innerHTML = "";

      marches.forEach(m => {

        const sec = base - m.sec;

        const el = document.createElement("div");

        el.textContent = `${m.id}(${m.sec}) - ${secToMinSec(sec)}`;

        container.appendChild(el);
      });
    };
  }

// =========================
// Timer 자동 시작
// =========================

function updateClock() {

  const now = new Date();

  // 현재 UTC
  document.getElementById("NowUTCTime").value =
    formatUTC(now);

  // 보정 목표시간
  const targetInput =
    document.getElementById("EditTargetTime").value;

  const offsetSec = parseTime(targetInput);

  if (offsetSec !== null) {

    const targetDate =
      new Date(now.getTime() + offsetSec * 1000);

    document.getElementById("TargetUTCTime").value =
      formatUTC(targetDate);

  } else {

    document.getElementById("TargetUTCTime").value = "";
  }
}

// 페이지 로딩 즉시 실행
updateClock();

// 이후 1초마다 갱신
utcTimer = setInterval(updateClock, 1000);
 

  // =========================
  // Adjusted Time 클릭 복사
  // =========================

  function copyTimerDisplay(value, element) {

    if (!/^\d{2}:\d{2}:\d{2}$/.test(value)) return;

    const [, mm, ss] = value.split(":");

    const copyText = `${mm} ${ss}`;

    navigator.clipboard.writeText(copyText);

    const rect = element.getBoundingClientRect();

    showCopyMessage(
      copyText,
      rect.left + rect.width / 2,
      rect.top
    );
  }

  const targetUtcInput = document.getElementById("TargetUTCTime");

  if (targetUtcInput) {

    targetUtcInput.style.cursor = "pointer";

    targetUtcInput.addEventListener("click", () => {
      copyTimerDisplay(targetUtcInput.value, targetUtcInput);
    });
  }


// Set Time
const setTimeBox = document.getElementById("setTimeBox");
const adjustTimeBox = document.getElementById("TargetUTCTime");

if (setTimeBox && adjustTimeBox) {
  setTimeBox.addEventListener("click", async () => {
   const timeText = adjustTimeBox.value.trim();
    const match = timeText.match(/(\d{2}):(\d{2}):(\d{2})/);

    if (!match) return;

    let hours = Number(match[1]);
    let minutes = Number(match[2]);
    let seconds = Number(match[3]);

    // 다음 5초 단위로 올림
    seconds = Math.ceil(seconds / 5) * 5;

    // 분 / 시간 넘어가는 경우 처리
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }

    if (minutes >= 60) {
      minutes = 0;
      hours = (hours + 1) % 24;
    }

    const setTime =
      `${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`;

    const copyTime = setTime.substring(3);

    setTimeBox.value = `Set - ${setTime}`;

// Set - 검정색, 시간 파란색
setTimeBox.classList.remove("text-gray-400");
setTimeBox.classList.add("text-gray-900");

    try {
  await navigator.clipboard.writeText(copyTime);

  const rect = setTimeBox.getBoundingClientRect();

  showCopyMessage(
    copyTime,
    rect.left + rect.width / 2,
    rect.top
  );

} catch (error) {
  console.error("Copy failed:", error);
}
  });
}

  // =========================
  // 연집 계산
  // =========================

  const btnCalc5 = document.getElementById("btnCalcExplain5");

  if (btnCalc5) {

    btnCalc5.onclick = () => {

      const base = parseTime(document.getElementById("attackrallyStartTime").value);

      if (base === null) {
        alert("집결 오픈 시간 입력 필요");
        return;
      }

      const txt = document.getElementById("marchBulkInput2").value.trim();

      if (!txt) {
        alert("행군시간 입력 필요");
        return;
      }

      const tokens = txt.replace(/\n/g, " ").split(/\s+/);

      let marches = [];

      tokens.forEach(t => {

        const m = t.match(/^(.+?)(\d+)$/);

        if (!m) return;

        marches.push({
          id: m[1],
          sec: Number(m[2])
        });
      });

      if (marches.length === 0) {
        alert("행군 데이터 없음");
        return;
      }

      // 최소 행군시간 찾기
      const minSec = Math.min(...marches.map(m => m.sec));

      const container = document.getElementById("explain5Container");

      container.innerHTML = "";

      marches.forEach(m => {

        const sec = base - (m.sec - minSec);

        const el = document.createElement("div");

        el.textContent = `${m.id}(${m.sec}) - ${secToMinSec(sec)}`;

        container.appendChild(el);
      });
    };
  }

});