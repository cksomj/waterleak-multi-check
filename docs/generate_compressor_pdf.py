from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import textwrap

OUT = Path(__file__).with_name("compressor-control-guide.pdf")
W, H = 1240, 1754
M = 70

FONT = Path("C:/Windows/Fonts/malgun.ttf")
FONT_B = Path("C:/Windows/Fonts/malgunbd.ttf")


def font(size, bold=False):
    return ImageFont.truetype(str(FONT_B if bold else FONT), size)


F = {
    "title": font(50, True),
    "h1": font(34, True),
    "h2": font(24, True),
    "body": font(22),
    "small": font(17),
    "tiny": font(14),
    "b": font(22, True),
    "table": font(16),
    "table_b": font(16, True),
}


def page(bg="white"):
    im = Image.new("RGB", (W, H), bg)
    return im, ImageDraw.Draw(im)


def text(draw, xy, s, fnt=None, fill="#17242b", spacing=8):
    fnt = fnt or F["body"]
    draw.multiline_text(xy, s, font=fnt, fill=fill, spacing=spacing)


def wrap(s, width=34):
    out = []
    for para in s.split("\n"):
        if not para.strip():
            out.append("")
        else:
            out.extend(textwrap.wrap(para, width=width, break_long_words=False, replace_whitespace=False))
    return "\n".join(out)


def rounded(draw, box, fill, outline="#cdd9dd", radius=18, width=3):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(draw, start, end, fill="#174a54", width=6):
    draw.line([start, end], fill=fill, width=width)
    x1, y1 = start
    x2, y2 = end
    if x2 >= x1:
        pts = [(x2, y2), (x2 - 24, y2 - 12), (x2 - 24, y2 + 12)]
    else:
        pts = [(x2, y2), (x2 + 24, y2 - 12), (x2 + 24, y2 + 12)]
    draw.polygon(pts, fill=fill)


def header(draw, title, n):
    text(draw, (M, 42), title, F["h1"], "#174a54")
    draw.line((M, 92, W - M, 92), fill="#174a54", width=4)
    text(draw, (W - M - 70, 48), f"{n}", F["small"], "#66757c")


def box_label(draw, xy, size, title, sub="", fill="#ffffff", outline="#174a54"):
    x, y = xy
    w, h = size
    rounded(draw, (x, y, x + w, y + h), fill, outline)
    tw = draw.textbbox((0, 0), title, font=F["h2"])[2]
    draw.text((x + w / 2 - tw / 2, y + h / 2 - 25), title, font=F["h2"], fill="#17242b")
    if sub:
        lines = wrap(sub, 14)
        bbox = draw.multiline_textbbox((0, 0), lines, font=F["small"], spacing=4)
        draw.multiline_text((x + w / 2 - (bbox[2] - bbox[0]) / 2, y + h / 2 + 10), lines, font=F["small"], fill="#52646c", spacing=4)


def draw_table(draw, x, y, widths, rows, row_h=58, header_fill="#eaf4f2"):
    for ri, row in enumerate(rows):
        xx = x
        max_h = row_h
        for ci, cell in enumerate(row):
            cell_text = wrap(str(cell), max(8, widths[ci] // 16))
            bbox = draw.multiline_textbbox((0, 0), cell_text, font=F["table_b"] if ri == 0 else F["table"], spacing=3)
            max_h = max(max_h, bbox[3] - bbox[1] + 22)
        for ci, cell in enumerate(row):
            fill = header_fill if ri == 0 else "white"
            draw.rectangle((xx, y, xx + widths[ci], y + max_h), fill=fill, outline="#cdd9dd", width=2)
            cell_text = wrap(str(cell), max(8, widths[ci] // 16))
            draw.multiline_text((xx + 8, y + 10), cell_text, font=F["table_b"] if ri == 0 else F["table"], fill="#17242b", spacing=3)
            xx += widths[ci]
        y += max_h
    return y


pages = []

# Cover
im, d = page("#113f48")
text(d, (M, 190), "콤프레셔 전자식\n압력조절기 제작\n작업지시서", F["title"], "white", 12)
text(d, (M, 500), "누수진단 앱 연동용 · 초보자 납땜 가능 단계 기준 · 2026-05-14", F["body"], "#cdeae7")
rounded(d, (M, 650, W - M, 900), "#0f766e", "#b7f3e7", 22, 3)
text(d, (M + 35, 690), wrap("작업반장 판단: 지금 가진 리모컨은 아주 도움이 됩니다. 콤프레셔 내부 220V 전원을 뜯지 말고, 리모컨 버튼을 ESP32가 대신 눌러주는 방식으로 갑니다.", 42), F["h2"], "white")
text(d, (M + 35, 820), wrap("압력 조절은 산업용 전공 레귤레이터가 맡고, ESP32는 목표압 지시, 실제압 확인, 앱 통신, 기록만 담당합니다.", 42), F["body"], "#e7fffb")
rounded(d, (M, 990, W - M, 1190), "#ffffff", "#ffffff", 22, 2)
text(d, (M + 35, 1030), "완성 목표", F["h2"], "#113f48")
text(d, (M + 35, 1080), wrap("태블릿 앱에서 콤프레셔 ON/OFF, 목표압 입력, 실시간 압력 표시, 누수검사용 압력 하락 그래프 저장.", 48), F["body"], "#17242b")
pages.append(im)

# Page 2 overall structure
im, d = page()
header(d, "1. 전체 구조", 2)
rounded(d, (M, 125, W - M, 230), "#fff4ed", "#f97316", 14, 3)
text(d, (M + 24, 148), wrap("초보자가 직접 만질 구간은 리모컨 버튼 접점, ESP32, 센서, 24V DC 저전압 배선까지입니다. 콤프레셔 모터 전원, 220V 배선, 탱크 안전밸브, 압력스위치는 건드리지 않습니다.", 56), F["b"], "#7c2d12")
y = 320
box_label(d, (70, y), (175, 115), "태블릿 앱", "목표압/ON/OFF")
arrow(d, (245, y + 58), (330, y + 58))
box_label(d, (330, y), (205, 115), "ESP32", "Wi-Fi · 센서 · 명령", "#e8f7f3", "#0f766e")
arrow(d, (535, y + 58), (630, y + 58))
box_label(d, (630, y), (220, 115), "전공 레귤레이터", "0-10V 압력 조절", "#e8f7f3", "#0f766e")
arrow(d, (850, y + 58), (945, y + 58))
box_label(d, (945, y), (180, 115), "검사 호스", "배관 연결")
box_label(d, (150, 650), (210, 115), "기존 리모컨", "버튼 접점만 납땜", "#fff0e7", "#e47c24")
box_label(d, (485, 650), (205, 115), "콤프레셔", "기존 안전차단 유지")
box_label(d, (805, 650), (200, 115), "압력센서", "실제 bar 피드백", "#e8f7f3", "#0f766e")
arrow(d, (432, 435), (270, 650))
arrow(d, (360, 708), (485, 708))
arrow(d, (905, 650), (740, 435))
text(d, (M, 900), wrap("역할 분담: 리모컨은 콤프레셔를 켜고 끄는 용도, 전공 레귤레이터는 검사 호스로 나가는 압력을 조절하는 용도입니다. 두 기능을 섞지 않으면 제작과 고장 대처가 쉬워집니다.", 58), F["body"])
pages.append(im)

# Page 3 pneumatic
im, d = page()
header(d, "2. 공압 배관 흐름", 3)
labels = [
    ("콤프레셔", "기존 안전장치 유지", "#fff0e7", "#e47c24"),
    ("수분필터", "물/오일 제거", "#ffffff", "#0f766e"),
    ("수동 감압밸브", "최대압 1차 제한", "#fff0e7", "#e47c24"),
    ("전공 레귤레이터", "앱 목표압 반영", "#e8f7f3", "#0f766e"),
    ("검사 호스", "배관 연결", "#ffffff", "#0f766e"),
]
x = 60
for i, (a, b, fill, out) in enumerate(labels):
    box_label(d, (x, 240), (190, 115), a, b, fill, out)
    if i < len(labels) - 1:
        arrow(d, (x + 190, 297), (x + 245, 297), "#0f766e")
    x += 245
box_label(d, (720, 470), (230, 110), "압력센서", "전공 레귤레이터 뒤쪽", "#e8f7f3", "#0f766e")
arrow(d, (835, 470), (835, 355), "#0f766e")
text(d, (M, 690), wrap("작업반장 지시: 콤프레셔 탱크 압력은 기존 콤프레셔가 관리합니다. 우리가 만드는 장치는 검사에 보내는 출력압만 조절합니다. 그래서 콤프레셔 안전스위치와 안전밸브는 그대로 둡니다.", 56), F["body"])
rounded(d, (M, 850, W - M, 1110), "#ecfdf5", "#86efac", 14, 2)
text(d, (M + 25, 880), "추천 압력 테스트 순서", F["h2"], "#14532d")
steps = "1) 전공 레귤레이터 출력 호스를 대기 개방 상태로 둔다.\n2) 목표압 0.5bar부터 시작한다.\n3) 게이지와 앱 표시가 비슷한지 확인한다.\n4) 1bar, 2bar, 3bar 순서로 천천히 올린다.\n5) 처음부터 배관에 물리거나 높은 압력으로 테스트하지 않는다."
text(d, (M + 25, 935), steps, F["body"], "#14532d")
pages.append(im)

# Page 4 parts
im, d = page()
header(d, "3. 구매 부품표 - 핵심 부품", 4)
rows = [
    ["부품", "정확한 명칭", "권장 사양", "대략 금액"],
    ["제어보드", "ESP32 WROOM-32E 개발보드", "Wi-Fi, USB-C, 핀헤더 납땜형", "약 18,700원"],
    ["압력조절", "전공 레귤레이터", "SMC ITV1030/2030 또는 Festo VPPE/VPPM, 24V DC, 0-10V 입력", "신품 30~80만원대, 중고 10~40만원대"],
    ["아날로그 출력", "1채널 0-10V I2C DAC 모듈", "MCP4725 기반 0-10V 출력형", "약 18,000~35,000원"],
    ["압력센서", "0-10bar 압력 트랜스듀서", "0.5-4.5V 또는 4-20mA, G1/4", "31,443원부터"],
    ["센서입력", "ADS1115 16비트 ADC 모듈", "I2C, 3.3V 사용 가능", "약 5,000~15,000원"],
    ["리모컨 접점", "2채널 릴레이/포토커플러 모듈", "버튼 접점 쇼트용", "1채널 약 3,960원"],
]
draw_table(d, M, 135, [155, 315, 410, 205], rows, 64)
rounded(d, (M, 1060, W - M, 1230), "#fff4ed", "#f97316", 14, 3)
text(d, (M + 25, 1090), wrap("전공 레귤레이터 모델명에서 꼭 확인할 것: 입력신호 0-10V, 전원 24V DC, 출력압 범위 0-5bar 또는 0-9bar, 포트 규격 G1/4 또는 Rc/NPT 여부.", 55), F["b"], "#7c2d12")
pages.append(im)

# Page 5 tools
im, d = page()
header(d, "4. 부속·도구·소모품", 5)
rows = [
    ["분류", "정확한 명칭", "수량", "대략 금액", "메모"],
    ["전원", "24V DC SMPS", "1", "1~10만원대", "전공 레귤레이터용. 220V 입력 배선은 전문가 검수."],
    ["전원변환", "DC-DC Buck Converter 24V→5V", "1", "2천~8천원", "ESP32, 센서 전원."],
    ["안전", "비상정지 스위치 NC 접점", "1", "5천~2만원", "누르면 제어전원 차단."],
    ["공압", "수분필터/수동 감압밸브/게이지", "1식", "2만~8만원", "전공 레귤레이터 앞단 보호."],
    ["공압", "안전밸브/릴리프 밸브", "1", "1만~5만원", "전자제어 고장 시 과압 방지."],
    ["공구", "인두기, 납, 플럭스, 열수축튜브", "1식", "2만~5만원", "리모컨 납땜."],
    ["측정", "디지털 멀티미터", "1", "1만~5만원", "도통/전압 확인 필수."],
    ["케이스", "방수 전기박스, 단자대, 케이블 글랜드", "1식", "2만~6만원", "현장용 마감."],
]
draw_table(d, M, 135, [130, 300, 65, 125, 465], rows, 54)
text(d, (M, 1180), wrap("초보자 구매 팁: 처음부터 비싼 케이스에 넣지 말고 책상 위에서 ESP32, 릴레이, 센서, DAC가 따로 정상 동작하는지 확인한 뒤 케이스 작업을 합니다.", 56), F["body"])
pages.append(im)

# Page 6 remote soldering
im, d = page()
header(d, "5. 리모컨 납땜 포인트", 6)
rounded(d, (100, 180, 520, 520), "#d1fae5", "#15803d", 25, 4)
text(d, (230, 220), "기존 리모컨 기판", F["h2"], "#17242b")
d.ellipse((190, 310, 290, 410), fill="#f8fafc", outline="#334155", width=4)
d.ellipse((340, 310, 440, 410), fill="#f8fafc", outline="#334155", width=4)
text(d, (218, 340), "ON", F["h2"])
text(d, (363, 340), "OFF", F["h2"])
for cx in [210, 270, 360, 420]:
    d.ellipse((cx - 12, 455 - 12, cx + 12, 455 + 12), fill="#f97316", outline="#9a3412", width=3)
rounded(d, (715, 220, 1000, 405), "#ffffff", "#174a54", 18, 4)
text(d, (750, 255), "2채널 릴레이\n또는 포토커플러", F["h2"])
rounded(d, (1030, 245, 1165, 380), "#e0f2fe", "#2563eb", 18, 4)
text(d, (1060, 292), "ESP32", F["h2"])
for p1, p2, color in [((210,455),(750,360),"#2563eb"),((270,455),(800,360),"#dc2626"),((360,455),(850,360),"#2563eb"),((420,455),(900,360),"#dc2626")]:
    d.line([p1, p2], fill=color, width=6)
text(d, (M, 650), "작업 순서", F["h1"], "#174a54")
steps = "1) 리모컨 배터리를 뺍니다.\n2) ON 버튼 양쪽 패드를 찾습니다. 멀티미터 도통 모드로 버튼을 누를 때만 삐 소리가 나는 두 점이 정답입니다.\n3) 그 두 점에 얇은 선 2가닥을 납땜합니다.\n4) 선 끝을 릴레이 CH1의 COM/NO에 연결합니다.\n5) OFF 버튼도 같은 방식으로 CH2에 연결합니다.\n6) 선이 흔들리지 않게 글루건 또는 열수축튜브로 고정합니다."
text(d, (M, 710), steps, F["body"])
rounded(d, (M, 1120, W - M, 1260), "#ecfdf5", "#86efac", 14, 2)
text(d, (M + 25, 1150), wrap("성공 확인: 릴레이 COM/NO 대신 선 두 가닥을 0.5초만 서로 대보면 리모컨 버튼을 누른 것처럼 동작해야 합니다.", 55), F["b"], "#14532d")
pages.append(im)

# Page 7 wiring
im, d = page()
header(d, "6. ESP32 배선표", 7)
rows = [
    ["ESP32 핀", "연결 대상", "선 색", "설명"],
    ["GPIO 21", "I2C SDA, DAC + ADS1115", "노랑", "데이터선"],
    ["GPIO 22", "I2C SCL, DAC + ADS1115", "흰색", "클럭선"],
    ["GPIO 26", "릴레이 CH1 IN", "파랑", "리모컨 ON 0.5초"],
    ["GPIO 27", "릴레이 CH2 IN", "보라", "리모컨 OFF 0.5초"],
    ["5V", "릴레이 VCC, 압력센서 VCC", "빨강", "DC-DC 5V 출력"],
    ["3.3V", "I2C 모듈 로직전원", "주황", "모듈 사양 확인"],
    ["GND", "모든 저전압 GND 공통", "검정", "기준점"],
]
draw_table(d, M, 130, [170, 380, 120, 415], rows, 56)
text(d, (M, 790), "압력센서 연결 그림", F["h1"], "#174a54")
box_label(d, (80, 900), (190, 110), "압력센서", "0.5-4.5V")
arrow(d, (270, 955), (365, 955))
box_label(d, (365, 900), (210, 110), "전압분배", "10k 위 · 20k 아래", "#fff0e7", "#e47c24")
arrow(d, (575, 955), (680, 955))
box_label(d, (680, 900), (180, 110), "ADS1115", "압력값 안정화", "#e8f7f3", "#0f766e")
arrow(d, (860, 955), (965, 955))
box_label(d, (965, 900), (160, 110), "ESP32", "I2C")
rounded(d, (M, 1160, W - M, 1340), "#fff4ed", "#f97316", 14, 3)
text(d, (M + 25, 1190), wrap("주의: 0.5-4.5V 센서를 ESP32 아날로그핀에 바로 넣지 않습니다. ESP32는 3.3V 기준이라 과전압 위험이 있습니다.", 55), F["b"], "#7c2d12")
pages.append(im)

# Page 8 execution
im, d = page()
header(d, "7. 실행 순서", 8)
steps = [
    ("1일차", "리모컨 자동 누름부터 성공", "리모컨 ON/OFF 버튼 접점을 찾아 릴레이에 연결합니다. 앱 없이 수동 테스트로 버튼 동작을 확인합니다."),
    ("2일차", "ESP32가 리모컨을 누르게 만들기", "GPIO 26, 27로 릴레이를 0.5초 켰다 끄는 코드 업로드. 콤프레셔 ON/OFF 확인."),
    ("3일차", "압력센서 읽기", "압력센서를 공압 라인에 연결하고 앱 화면에 bar 표시. 실제 게이지와 비교해서 보정합니다."),
    ("4일차", "전공 레귤레이터 수동 제어", "0V, 2V, 5V, 8V를 넣어 출력압이 단계적으로 바뀌는지 확인합니다."),
    ("5일차", "앱 연동", "목표압 입력 → ESP32 → 0-10V 출력 → 실제압 표시 흐름을 연결합니다."),
    ("6일차", "안전 테스트", "통신 끊김, 센서선 분리, 비상정지, 과압 조건에서 무조건 OFF 또는 배기되는지 확인합니다."),
    ("7일차", "현장용 케이스 작업", "배선 라벨, 케이블 글랜드, 방수케이스, 퓨즈, 단자대, 예비수동 리모컨을 정리합니다."),
]
y = 130
for day, title, body in steps:
    rounded(d, (M, y, W - M, y + 150), "#f8fbfc", "#cdd9dd", 14, 2)
    text(d, (M + 25, y + 25), day, F["h2"], "#0f766e")
    text(d, (M + 140, y + 20), title, F["h2"], "#17242b")
    text(d, (M + 140, y + 60), wrap(body, 49), F["body"], "#52646c")
    y += 165
pages.append(im)

# Page 9 safety and sources
im, d = page()
header(d, "8. 절대 규칙과 구매처", 9)
rules = "· 콤프레셔의 기존 맥시멈 압력중단 기능은 유지합니다.\n· 탱크 안전밸브를 제거하지 않습니다.\n· 리모컨은 원래대로도 쓸 수 있게 버튼 기능을 망가뜨리지 않습니다.\n· 앱이 멈추면 압력 유지가 아니라 안전 정지로 가게 만듭니다.\n· 처음 현장 투입 전에는 물배관에 연결하지 말고 공기만 빼는 상태에서 30회 이상 반복 테스트합니다."
rounded(d, (M, 130, W - M, 360), "#fff4ed", "#f97316", 14, 3)
text(d, (M + 25, 160), rules, F["b"], "#7c2d12")
rows = [
    ["항목", "확인 내용", "링크"],
    ["ESP32", "디바이스마트 ESP32 WROOM-32E C타입 보드 VAT 포함 18,700원", "devicemart.co.kr/goods/view?no=15028279"],
    ["릴레이", "디바이스마트 1채널 릴레이 VAT 포함 3,960원", "devicemart.co.kr/goods/view?no=1313262"],
    ["DAC", "SparkFun MCP4725 DAC VAT 포함 18,370원. 전공 레귤레이터용은 0-10V 출력형 선택", "devicemart.co.kr/goods/view?no=1232518"],
    ["압력센서", "element14 DFRobot SEN0257 0.5~4.5V, 0~1.6MPa, G1/4, 31,443원", "kr.element14.com/.../dp/4308257"],
    ["전공 레귤레이터", "SMC ITV, Festo 비례 압력 레귤레이터. 24V DC, 0-10V 입력 모델 확인", "smcusa.com / festo.com"],
]
draw_table(d, M, 430, [140, 560, 385], rows, 64)
text(d, (M, 1280), wrap("작업반장 마지막 말: 이 장치는 콤프레셔를 더 강하게 만드는 장치가 아니라, 검사압을 일정하고 기록 가능하게 만드는 장치입니다. 현장 투입 전에는 반드시 낮은 압력부터 천천히 확인합니다.", 55), F["body"])
pages.append(im)

pages[0].save(OUT, "PDF", resolution=150.0, save_all=True, append_images=pages[1:])
print(OUT)
