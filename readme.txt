JsZip 폴더
1. 회사소개 (Company)
   - 회사 개요, 인사말, 연혁, CI, 기업문화, 인증및수상, 찾아오시는 길

2. 사업분야 (Business)
   - SI분야, 솔루션 분야, R&D분야

3. 사업실적 (Performance)
   - 사업실적, 고객레퍼런스, 파트너사

4. 인재 및 채용 (Careers)
   - 인재상, 인사제도, 채용절차

5. 홍보센터 (PR Center)
   - 뉴스, 홍보영상, 자료실

----------------------------------------------------
작업 가이드
1. JsZip 폴더에 본인이 작성한 js파일을 적절한 이름으로 변경하여 넣는다.
2. 아래와 같이 본인이 만든 js 파일에 대한 주석을 달고 적절한 Canvas명으로 function 명을 변경한다.

// 사업분야 - R&D분야
// 2024-01-10 백재원, 최초작성

export default function RndCanvas() {

** 여기 쿼리 셀렉터도 변경한다.
const canvas = document.querySelector('#three-canvas');
>> const canvas = document.querySelector('#RndCanvas');

3. main.js에 아래와 같이 본인이 작성한 function명을 정의해준다.

import RndCanvas from './JsZip/Business/Rnd';
RndCanvas();

4. index.html을 수정한다.
<b>* 이름 변경에 유의하세요!</b>
아래와 같이 만들어둔 메뉴를 선택해서 수정한다.
<a href="#" onclick="toggleSection('RnDArea')">R&D 분야</a>

각 섹션의 내용 주석 아래에 적절한 곳에 본인이 작성한 Canvas 명을 적절히 추가해준다.
<div class="content" id="RnDArea">
   <canvas class="RndCanvas" id="RndCanvas"></canvas>
</div>

toggleSection에 적절한 else if문 작성
// 여기에 본인 컨텐츠 관련 코드 추가 부분에 아래와 같이 작성
else if (sectionId === "RnDArea") {
   document.getElementById('RndCanvas').style.display = "block";
}

5. 여기까지 정확히 하신 후
main.css에서 
  #companyInfo,
  #companyGreetings,
  #businessSubMenu,
  #three-canvas,
  #RndCanvas,
  #CompanyGreetCanvas {
	display: none;
  }
  이 부분에 본인의 Canvas id를 추가한다. 이렇게 해야 컨텐츠들이 동시에 뜨는 일이 없는 듯 함

더 좋은 방법이 있다면 공유바랍니다..

----------------------------------------------------

1. 패키지 설치 >> clone 했을시 2번부터 해보세요, npm 설치부터하면 패키지 충돌날 수 있음
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
npm i -D @babel/cli @babel/core @babel/preset-env babel-loader clean-webpack-plugin copy-webpack-plugin core-js cross-env html-webpack-plugin source-map-loader terser-webpack-plugin webpack webpack-cli webpack-dev-server
----------
npm i three
----------

2. 개발용 서버 구동 << clone 했을시 이걸 먼저 해보세요, npm 설치부터하면 패키지 충돌날 수 있음
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
npm start
----------

3. 빌드(배포용 파일 생성)
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
npm run build
----------

(!)
npm start 또는 npm run build 실행 시 에러가 난다면 Node.js를 LTS 버전(장기 지원 버전)으로 설치 후 다시 시도해 보세요.
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르면 설치할 수 있어요.
----------
n lts
----------

(!)
ERROR in unable to locate '경로...'
위와 같은 에러가 발생한다면, webpack.config.js의 CopyWebpackPlugin에 설정된 파일이 있는지 확인해주세요.
CSS나 이미지 폴더 등이 필요하지 않다면 webpack.config.js에서 CopyWebpackPlugin 부분 전체를 주석 처리 해주세요.
