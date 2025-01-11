<script>
    import { toggleMenu } from '$lib/nav_actions.js';

	let { children } = $props();
    let isMenuOpen = $state(false);

    let src = '/logo.svg'; //아하!! 그냥 정적인 경로 이런식으로 사용하는 건 무조건 절대구나! 내가 생각하는 상대경로를 import할 때 쓰는 것
</script>

<!-- 네비게이션 -->
<nav class="navigation">
    <!-- 모바일 화면 -->
    <!-- Hamburger menu icon -->
    <button class="hamburger-sm-menu" aria-label="Open Menu" onclick={() => isMenuOpen = !isMenuOpen}>
        <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="black" stroke-width="2" fill="none" stroke-linecap="round" />
        </svg>
    </button>

    <div class="nav-sm-center">
        <!-- Logo -->
        <a class="logo-link" href="/" rel="noopener noreferrer" aria-label="Visit Example Company">
            <img {src} alt="Example Company Logo" class="logo">
        </a>
    </div>

    <div class="nav-sm-right">
        <!-- User icon -->
        <a href="/user" aria-label="User Settings">
            <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M15 13h-.4c1.9-1.2 3.3-3.3 3.4-5.8c.1-3.8-3.1-7.2-6.9-7.2C7.1 0 4 3.1 4 7c0 2.6 1.3 4.8 3.4 6H7c-3.9 0-7 3.1-7 7v1c0 1.7 1.3 3 3 3h16c1.7 0 3-1.3 3-3v-1c0-3.9-3.1-7-7-7zM6 7c0-2.8 2.2-5 5-5s5 2.2 5 5s-2.2 5-5 5s-5-2.2-5-5zm13 15H3c-.6 0-1-.4-1-1v-1c0-2.8 2.2-5 5-5h8c2.8 0 5 2.2 5 5v1c0 .6-.4 1-1 1z" />
            </svg>
        </a>
    </div>
    <!-- Off-canvas menu -->
    <div class="off-canvas-menu" class:open={isMenuOpen}>
        <ul>
            <li><a href="/skillmap">Skills</a></li>
            <li><a href="/status">Status</a></li>
            <li><a href="/day_management">Management</a></li>
            <li><a href="/ideas">Ideas</a></li>
            <li><a href="/life">Life</a></li>
        </ul>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events (오버레이 역할은 버튼으로 적절하지 않지만, 동시에 클릭 역할을 해야 하기 때문)-->
    <div class="overlay" class:active={isMenuOpen} onclick={() => isMenuOpen = false} role="button" tabindex="-1"></div> <!-- 메뉴오버레이 -->

    
    <!-- 데스크톱 화면 -->
    <div class="nav-left">
        <a class="logo-link" href="/" rel="noopener noreferrer" aria-label="Visit Example Company">
            <img {src} alt="Example Company Logo" class="logo">
        </a>
        <ul class="nav-list">
            <li>
                <a href="/skillmap" aria-label="스킬맵" class="">
                    <span>Skills</span>
                </a>
            </li>
            <li>
                <a href="/status" aria-label="스테이터스" class="">
                    <span>Status</span>
                </a>
            </li>
            <li>
                <a href="/day_management" aria-label="할일관리" class="">
                    <span>Management</span>
                </a>
            </li>
            <li>
                <a href="/ideas" aria-label="아이디어스" class="">
                    <span>Ideas</span>
                </a>
            </li>
            <li>
                <a href="/life" aria-label="인생" class="">
                    <span>Life</span>
                </a>
            </li>
        </ul>
    </div>
    <div class="nav-right">
        <ul>
            <li>
                <a href="https://fluoridated-fin-cb6.notion.site/11e07a267eda80bdb3d2c63813cba01e?pvs=74" aria-label="사용가이드" target="_blank" rel="noopener noreferrer">
                    <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" version="1.1" id="svg237" xml:space="preserve" viewBox="0 0 682.66669 682.66669">
                        <defs id="defs241"><clipPath clipPathUnits="userSpaceOnUse" id="clipPath251"><path d="M 0,512 H 512 V 0 H 0 Z" id="path249"/></clipPath></defs><g id="g243" transform="matrix(1.3333333,0,0,-1.3333333,0,682.66667)"><g id="g245"><g id="g247" clip-path="url(#clipPath251)"><g id="g253" transform="translate(61,452.0005)"><path d="m 0,0 v -414.5 m 360.001,-30 H 390 v 497 H 15 C 6.751,52.5 0,45.746 0,37.5 V 15 m 330,-459.5 h 15 m 45,59.999 H 29.999 c -16.5,0 -29.999,-13.5 -29.999,-29.999 0,-16.5 13.501,-30 29.999,-30 H 315" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:22.926;stroke-dasharray:none;stroke-opacity:1" id="path255"/></g><g id="g257" transform="translate(90.999,37.5)"><path d="M 0,0 H 360.001" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:2.613;stroke-dasharray:none;stroke-opacity:1" id="path259"/></g><g id="g261" transform="translate(421.001,437)"><path d="M 0,0 V 15 M 0,30 V 45" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:2.613;stroke-dasharray:none;stroke-opacity:1" id="path263"/></g><g id="g265" transform="translate(250.2773,355.5679)"><path d="m 0,0 c 0,0 -10.308,8.664 -22.462,5.002 -11.16,-3.361 -12.721,-16.23 -4.646,-21.494 0,0 7.922,-3.534 16.71,-6.776 21.153,-7.802 12.041,-28.267 -4.988,-28.267 -8.527,0 -15.684,3.735 -20.016,8.514" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path267"/></g><g id="g269" transform="translate(144.0898,361.4727)"><path d="m 0,0 v -39.524 c 0.001,-10.394 9.707,-17.902 19.599,-17.915 10.088,-0.014 20.314,7.16 20.314,17.957 V 0" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path271"/></g><g id="g273" transform="translate(306.8652,361.2104)"><path d="M 0,0 H -23.981 V -56.915 H 0" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path275"/></g><g id="g277" transform="translate(305.0977,332.7529)"><path d="M 0,0 H -22.214" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path279"/></g><g id="g281" transform="translate(347.8311,326.9712)"><path d="M 0,0 18.598,-21.719" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path283"/></g><g id="g285" transform="translate(336.8555,303.771)"><path d="m 0,0 0.01,57.44 h 15.273 c 8.543,0 15.773,-6.684 15.773,-14.928 0,-8.245 -7.23,-14.928 -15.773,-14.928 L 0.125,27.518" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path287"/></g><g id="g289" transform="translate(163.002,263.2217)"><path d="m 0,0 c -4.584,3.097 -10.11,4.905 -16.059,4.905 -15.861,0 -28.718,-12.858 -28.718,-28.719 0,-15.863 12.857,-28.721 28.718,-28.721 15.863,0 24.793,12.858 24.793,28.721 H -8.448" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path291"/></g><g id="g293" transform="translate(201.7354,268.127)"><path d="m 0,0 v -39.525 c 0.001,-10.394 9.707,-17.901 19.6,-17.914 10.087,-0.015 20.313,7.16 20.313,17.956 V 0" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path295"/></g><g id="g297" transform="translate(271.6475,268.127)"><path d="M 0,0 V -57.439" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path299"/></g><g id="g301" transform="translate(339.7939,238.9834)"><path d="m 0,0 c 0,-15.358 -8.523,-27.511 -22.048,-27.748 l -16.136,-0.122 -0.112,55.74 h 15.787 C -7.676,27.87 0,15.358 0,0 Z" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path303"/></g><g id="g305" transform="translate(393.7754,267.4414)"><path d="M 0,0 H -23.981 V -56.916 H 0" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path307"/></g><g id="g309" transform="translate(392.0078,238.9834)"><path d="M 0,0 H -22.214" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" id="path311"/></g><g id="g313" transform="translate(181,164.6025)"><path d="M 0,0 H 150" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:22.926;stroke-dasharray:none;stroke-opacity:1" id="path315"/></g><g id="g317" transform="translate(218.5,127.103)"><path d="M 0,0 H 75" style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:22.926;stroke-dasharray:none;stroke-opacity:1" id="path319"/>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://habitica.com/" aria-label="해비티카" target="_blank" rel="noopener noreferrer">
                    <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M31.62 28.86c-.32-.706-1.057-1.048-1.538-.706-.48.341-1.147.393-1.78.24-.633-.153-.753-1.604-.616-3.278.136-1.673.363-2.318.506-2.925.162-.61.877-.562.962-.084.086.479.582.479 1.307-.391.724-.87.617-3.409-.218-5.474-.836-2.065.326-1.865.664-1.66.337.205.544-.102.462-1.28-.082-1.178-1.166-2.098-2.039-2.663-.873-.564-1.936-1.186-1.911-2.697.025-1.511 2.08-1.464 2.358-1.439.279.025.815-.093.506-1.663-.31-1.57-1.43-1.869-2.133-1.826-.703.042-1.177.428-2.17.053-.995-.376-1.655-.23-2.58-.023-.926.206-2.138.776-3.646 1.183-.795.219-1.064.274-1.93.288-.532.008-.755.653-.043 1.444.563.643 1.839.814 2.606.707.494-.07.608.258.563.74a8.013 8.013 0 0 0-.01 1.795c.08.6.18 1.62-.103 2.286-.14.326-.545.677-.98.653-.565-.034-1.022-.7-1.414-1.49-.825-1.662-1.793-2.014-5.404-3.535-3.248-1.367-5.007-3.5-6.096-4.874-.969-1.217-1.939-.756-1.85.342.07.852.592 3.604 1.912 5.257 1.623 2.525 4.128 3.67 7.013 3.895.755.06 1.226.208 1.29.553.095.735-.622 1.244-1.959 1.09-1.336-.157-1.907.087-1.641.848.85 1.79 2.809 1.869 3.623 1.942.275.05 1.246 0 1.764.143.605.166.735 1.005-.14 1.459-1.558.76-2.237 1.391-3.025 2.83-.595 1.13-1.108 3.022-.574 5.745.513 2.648-3.337 2.733-5 2.357-.716-.151-1.47-1.512.287-2.65 1.421-.922 1.708-1.49 1.645-2.657-.074-1.36-.824-1.458-.822-2.64v-2.82a.435.435 0 0 0-.435-.435H7.698a.435.435 0 0 1-.435-.434v-1.7a.435.435 0 0 0-.435-.435H5.501a.435.435 0 0 1-.435-.435v-1.524a.435.435 0 0 0-.435-.435H3.015a.435.435 0 0 1-.435-.435v-1.603a.435.435 0 0 0-.435-.434H.435a.435.435 0 0 0-.435.434v1.705c0 .24.195.435.435.435h1.62c.24 0 .435.195.435.435v6.076c0 .241.195.435.435.435h1.71c.241 0 .436.196.436.435v1.988c0 .24.195.434.435.434h2.402c.734-.052.862.934.854 1.286-.016.803-.923 1.06-1.352 1.395-1.145.884-2.031 1.783-1.513 3.512l.013.036c.945 2.007 3.542 1.8 5.183 1.8h10.326c.584 0 1.184.135 1.046-.545-.136-.68-.425-1.61-1.265-1.61-.84 0-.703.467-1.524.228-.821-.238-.822-1.348.411-3.279 1.276-1.649 3.46-1.524 4.781-.358 1.32 1.166.93 3.191.653 4.354-.158.82.218 1.224.669 1.213h5.242c.806-.014.647-.556.185-1.614h.003z"></path>
                    </svg>
                </a>
            </li>
            <li>
                <a href="/user" aria-label="유저설정">
                    <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M15 13h-.4c1.9-1.2 3.3-3.3 3.4-5.8.1-3.8-3.1-7.2-6.9-7.2C7.1 0 4 3.1 4 7c0 2.6 1.3 4.8 3.4 6H7c-3.9 0-7 3.1-7 7v1c0 1.7 1.3 3 3 3h16c1.7 0 3-1.3 3-3v-1c0-3.9-3.1-7-7-7zM6 7c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm13 15H3c-.6 0-1-.4-1-1v-1c0-2.8 2.2-5 5-5h8c2.8 0 5 2.2 5 5v1c0 .6-.4 1-1 1z"></path>
                    </svg>
                </a>
            </li>
        </ul>
    </div>
</nav>

{@render children()}

<style>
/* Navigation */
.navigation {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    margin: 0;
    padding: 0px 20px;
    background: #fff;
    color: #333;
    position: relative;
    z-index: 10;
}

.hamburger-sm-menu,
.nav-sm-center,
.nav-sm-right,
.off-canvas-menu,
.overlay {
    display: none;
}
/* 모바일일 경우에 대한 디자인 -> 반응형 파트에 작성함 */


.nav-left {
    display: flex; /* Flexbox를 사용해 LOGO와 리스트를 한 줄로 배치 */
    align-items: stretch;
    gap: 20px;
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 1em;
    color: black;
    border-radius: 5px;
    background-color: white;
    margin: 0px 0px;
}

.logo {
    width: 60px;
    height: 60px;
    transition: transform 0.3s ease;
}


.logo:hover {
    transform: scale(1.1);
}

.navigation ul {
    list-style: none;
    font-weight: bold;
    display: flex; /* 리스트 항목들을 한 줄로 배치 */
    padding: 0;
    margin: 0;
}

.navigation a {
    list-style: none;
    text-decoration-line: none;
    display: flex; /* 리스트 항목들을 한 줄로 배치 */
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 5px;
    display: flex;
    align-items: center;
    text-align: center;
}

.navigation a:hover {
    background-color: #b7b7b7;
}

.navigation button:hover {
    background-color: #b7b7b7;
}

.navigation span{
    color: #000;
    margin: 10px 10px;
}
.navigation svg{
    color: #000;
    margin: 10px 10px;
}


.nav-right {
    display: flex; /* Profile과 Log Out을 한 줄로 배치 */
    align-items: center;
}

.nav-right a {
    box-sizing: border-box;
    padding: 0 7px;
}


/* 모바일 스타일 */
@media (max-width: 768px) {

    /* 네비게이션 조정 */
    .navigation {
        padding: 0 10px;
    }

    .nav-left, .nav-right {
        display: none; /* 모바일에서 숨김 */
    }

    .hamburger-sm-menu, .nav-sm-center, .nav-sm-right {
        display: block; /* 모바일에서만 표시 */
        justify-content: center;
    }

    .hamburger-sm-menu {
        border: none;
        background: none;
    }

    .navigation a {
        display: flex;
        justify-content: center;
        margin: 0;
    }

    .off-canvas-menu {
        display: block;
        position: fixed;
        box-sizing: border-box; /* 패딩과 테두리가 width 안에 포함 */
        top: 0;
        left: -250px; /* 기본적으로 화면 밖에 위치 */
        width: 250px;
        height: 100vh;
        background-color: #ffffff;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        flex-direction: column;
        padding: 1rem;
        transition: transform 0.3s ease;
        z-index: 100;
    }

    .off-canvas-menu ul {
        display: flex;
        flex-direction: column;
        list-style: none;
        padding: 0;
        
    }

    .off-canvas-menu ul li {
        margin: 1rem 0;
    }

    .off-canvas-menu ul li a {
        text-decoration: none;
        color: #333;
        font-size: 1.2rem;
    }

    /* Off-canvas 메뉴 열릴 때 */
    .off-canvas-menu.open {
        transform: translateX(250px);
    }

        /* 오버레이 */
    .overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0); /* 투명 상태 */
        transition: background-color 0.3s ease;
        z-index: 50;
        pointer-events: none; /* 클릭 불가 기본 상태 */
    }

    .overlay.active {
        background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경 */
        pointer-events: auto; /* 클릭 가능 */
    }

}


</style>