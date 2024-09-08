import room01 from "./room01.js";
import room02 from "./room02.js";


// 랜덤으로 jw:room01() , sm:room02() 실행
function executeRandomRoom() {
    const dynamicCss = document.getElementById('dynamic-css');
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
        dynamicCss.href = "./room.css";
        room01();
    } else {
        updateHtmlForRoom02();
        dynamicCss.href = "./room02.css"
        room02();
    }
}

// 랜덤 함수 호출
executeRandomRoom();

// room02 실행 시 HTML 수정
function updateHtmlForRoom02() {
    const loadingScreen = document.getElementById("loading-screen");

    if (loadingScreen) {
        loadingScreen.innerHTML = `
          <div class="loading-spinner">
            <div id="loading-image-wrapper">
              <img id="loading-image" src="./images/santa2.gif" alt="로딩 중...">
            </div>
            <div class="loading-text">Loading...</div>
          </div>
        `;
    }
}

//room01();