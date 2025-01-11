const svg = document.getElementById('svgCanvas');
const customCursor = document.getElementById('customCursor');
//내부 svg 벡터 스페이스 내에 (0,0)을 focusing center로 해서 원형 노드 제작
const centerX = 211;
const centerY = 400;
const nodeRadius = 20;
const radiusStep = 150;

let isDragging = false;
let dragStart = { x: 0, y: 0 };
//이전에는 그냥 window.innerWidth, window.innerHeight를 사용했음. 그러나, html에서 전체 svg 크기 비율에 맞도록 작동하게 하기 -> 깨지는 거 없음
const viewBoxValue = svg.getAttribute('viewBox');
const [view_x, view_y, full_width, full_height] = viewBoxValue.split(' ').map(Number);
let translateX_bias = -0.5;
let translateY_bias = -0.5;
let translateX = translateX_bias;
let translateY = translateY_bias;
//세부사항 페이지를 위한 변수
let modifiedX = 0;
let modifiedY = 0;
let scale = 1;

// SVG 클릭 감지 처리
document.getElementById('svgCanvas').addEventListener('click', (event) => {
    const clickedElement = event.target; // 클릭한 요소 가져오기
    console.log('클릭디버깅');
    console.log(clickedElement);
    let targetText = null;

    if (clickedElement.tagName === 'rect' || clickedElement.tagName === 'ellipse') {
        // rect 또는 ellipse 클릭 시 상위 g 형제 탐색
        const parentGroup = clickedElement.closest('g');
        const siblingGroup = parentGroup?.nextElementSibling; // 다음 형제 g 요소
        if (siblingGroup) {
            const textElement = siblingGroup.querySelector('switch foreignObject div div div'); // 형제 g -> switch -> foreignObject -> div -> div -> div
            if (textElement) {
                targetText = textElement.textContent.trim(); // 텍스트 가져오기
            }
        }

        //애니메이션(각 도형에 따라서)
        if (clickedElement.tagName === 'rect') {
            animateRectToCircle(clickedElement);
            focusOnNode(targetText, Number(clickedElement.getAttribute('x')) + Number(clickedElement.getAttribute('width'))/2,
            Number(clickedElement.getAttribute('y')) + Number(clickedElement.getAttribute('height'))/2);
        }
        else if (clickedElement.tagName === 'ellipse') {
            hideElement(clickedElement);
            //노드 focus
            focusOnNode(targetText, Number(clickedElement.getAttribute('cx')) + Number(clickedElement.getAttribute('width'))/2,
            Number(clickedElement.getAttribute('cy')) + Number(clickedElement.getAttribute('height'))/2);
        }


    } else if (clickedElement.tagName === 'DIV') {
        // div 클릭 시 바로 텍스트 가져오기
        targetText = clickedElement.textContent.trim();

        const parentGroup = clickedElement.closest('g')?.parentElement;
        const siblingGroup = parentGroup?.previousElementSibling; // 이전 형제 g 요소
        if (siblingGroup) {
            const diagramElement = siblingGroup.firstElementChild;
            if (diagramElement) {
                if (diagramElement.tagName === 'rect') {
                    animateRectToCircle(diagramElement);

                    focusOnNode(targetText, Number(diagramElement.getAttribute('x')) + Number(diagramElement.getAttribute('width'))/2,
                    Number(diagramElement.getAttribute('y')) + Number(diagramElement.getAttribute('height'))/2);
                }
                else if (diagramElement.tagName === 'ellipse') {
                    hideElement(diagramElement);
                    focusOnNode(targetText, Number(diagramElement.getAttribute('cx')) + Number(diagramElement.getAttribute('width'))/2,
                    Number(diagramElement.getAttribute('cy')) + Number(diagramElement.getAttribute('height'))/2);
                }
            }
        }
    }
});

//카메라 확대하면서 팝업 창 띄우기 vs 그냥 svg 안보이게 하고 동시에 내가 만든 요소 복사 생성한 다음 이게 움직이기(이거 낫배드인듯)
//팝업 창으로 내가 만든 페이지 띄우도록 하기(첫번째 경우는 모바일 버전으로 띄우는 게 나을 듯)

// rect -> circle 애니메이션
function animateRectToCircle(rect) {
    const originalWidth = +rect.getAttribute('width');
    const originalHeight = +rect.getAttribute('height');
    const radius = 40; //반지름 정의하기
    // CSS 애니메이션 효과
    rect.style.transition = 'all 1s ease-in-out';

    // 점진적으로 둥글게 변형
    rect.setAttribute('rx', 40);
    rect.setAttribute('ry', 40);
    rect.setAttribute('width', 80);
    rect.setAttribute('height', 80);
    rect.setAttribute('x', +rect.getAttribute('x') + (originalWidth-2*radius)/2); //+붙여서 숫자로 만들기 (120-80)/2
    rect.setAttribute('y', +rect.getAttribute('y') + (originalHeight-2*radius)/2); //(60-80)/2
}

// ellipse 숨기기
function hideElement(ellipse) {
    ellipse.style.transition = 'opacity 0.5s ease';
    ellipse.style.opacity = 0;

    setTimeout(() => {
        ellipse.remove(); // DOM에서 완전히 삭제
    }, 500);
}

// 노드 세부 사항 표시 및 화면 이동
function focusOnNode(node_name, x, y) {
    
    //스벨트 테스트용
    const targetNode = document.getElementById('watchedElement');
    targetNode.textContent = node_name;

    // 애니메이션을 적용해 노드가 특정 위치에 오도록 확대 이동
    // 내가 위치하고 싶은 스크린 좌표계가, 현재 svg 좌표계로 어디에 위치있는지 확인한 후, 원하는 노드 위치와의 차이만큼 viewbox를 이동시키기
    
    const targetScale = 4; // 확대 비율 설정
    svg.setAttribute('viewBox', `${-translateX} ${-translateY} ${window.innerWidth / targetScale} ${window.innerHeight / targetScale}`);
    
    const now_screen_point = svg.createSVGPoint();
    now_screen_point.x = window.innerWidth * 0.6;
    now_screen_point.y = window.innerHeight * 0.5;
    const nowPoint = now_screen_point.matrixTransform(svg.getScreenCTM().inverse());
    targetX = translateX + (nowPoint.x - x);
    targetY = translateY + (nowPoint.y - y);
    //전역변수 업데이트 for 원래대로 돌아오기 위한
    modifiedX = targetX;
    modifiedY = targetY;

    const duration = 500; // 애니메이션 지속 시간 (밀리초)
    const startTime = performance.now();
    const startX = translateX;
    const startY = translateY;
    const startScale = scale;

    console.log('x,y:', x, ',', y);
    console.log('target:', targetX, ',', targetY);
    function animate() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1); // 0에서 1 사이의 값으로 애니메이션 진행도 계산

        let animateX = startX + (targetX - startX) * t;
        let animateY = startY + (targetY - startY) * t;
        let animate_scale = startScale + (targetScale - startScale) * t;
        svg.setAttribute('viewBox', `${-animateX} ${-animateY} ${window.innerWidth / animate_scale} ${window.innerHeight / animate_scale}`);
        if (t < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

// 배경 클릭 시 원래 위치로 되돌리기 및 팝업 숨기기
svg.addEventListener('click', (e) => {

    const targetNode = document.getElementById('watchedElement');
    
    if (e.target === svg && targetNode.textContent) {
        console.log('배경 클릭 시 돌리기');
        targetNode.textContent = null;

        const duration = 500; // 애니메이션 지속 시간 (밀리초)
        const startTime = performance.now();
        //이전에 저장해 놓은 전역변수 값 가져오기
        const startX = modifiedX;
        const startY = modifiedY;
        const startScale = 4;
        const targetX = translateX;
        const targetY = translateY;
        const targetScale = scale;

        function animate() {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const t = Math.min(elapsed / duration, 1);

            let animateX = startX + (targetX - startX) * t;
            let animateY = startY + (targetY - startY) * t;
            let animate_scale = startScale + (targetScale - startScale) * t;

            // svg.setAttribute('viewBox', `${-animateX} ${-animateY} ${window.innerWidth / animate_scale} ${window.innerHeight / animate_scale}`);
            svg.setAttribute('viewBox', `${-animateX} ${-animateY} ${full_width / animate_scale} ${full_height / animate_scale}`);
            if (t < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }
});

// 드래그 기능 추가
svg.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStart.x = e.clientX - translateX;
    dragStart.y = e.clientY - translateY;
});

svg.addEventListener('mousemove', (e) => {
    if (isDragging) {
        translateX = e.clientX - dragStart.x;
        translateY = e.clientY - dragStart.y;
        updateTransform();
        console.log("updateTransform(); for mousemove with Dragging");
    }
});

svg.addEventListener('mouseup', () => {
    isDragging = false;
});

svg.addEventListener('mouseleave', () => {
    isDragging = false;
});

// 확대/축소 기능 추가
svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // 현재 마우스 위치를 SVG 좌표로 변환
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const startPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    // 확대/축소 정도 설정
    const zoomIntensity = 0.1;
    const wheelDelta = e.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheelDelta * zoomIntensity);
    scale *= zoom;

    // 확대/축소의 한계 설정
    if (scale < 0.33) scale = 0.33; // 최소 화면 축소 수준 제한
    if (scale > 3) scale = 3; // 최대 화면 확대 수준 제한

    // scale 변화로 인한 트랜스폼 업데이트
    updateTransform();

    const endPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    // 확대/축소 후 마우스 포인터의 좌표를 기준으로 translate 값 조정
    translateX -= (startPoint.x - endPoint.x);
    translateY -= (startPoint.y - endPoint.y);

    // 위치 조정 트랜스폼 업데이트
    //console.log("updateTransform(); for wheel");
    updateTransform()

    // console.log(`e.clientX = ${e.clientX}, e.clientY = ${e.clientY}, point.x : ${point.x}, point.y : ${point.y} \n 
    //     startPoint.x = ${startPoint.x}, startPoint.y = ${startPoint.y} \n
    //     endPoint.x = ${endPoint.x}, endPoint.y = ${endPoint.y} \n
    //     translateX_before = ${translateX}, translateY_before = ${translateY} \n`);
    // console.log(`translateX = ${translateX}, translateY = ${translateY} \n
    //     x = ${(startPoint.x - endPoint.x) * scale}, y = ${(startPoint.y - endPoint.y) * scale} \n`)

    // 현재 마우스 위치를 SVG 좌표로 변환
    // const last_point = svg.createSVGPoint();
    // last_point.x = e.clientX;
    // last_point.y = e.clientY;
    // const lastPoint = last_point.matrixTransform(svg.getScreenCTM().inverse());
    // console.log(`lastPoint.x = ${lastPoint.x}, lastPoint.y = ${lastPoint.y} \n`);

    //문제 해결을 위한 핵심 질문
    //궁금한 게, translate는 단위가 픽셀이야? 아니면 svg 좌표계 내부의 1단위야? 그리고, svg와 스크린의 좌표 단위는 달라?
    //하...시바...뷰포트 1 움직이는 건, 픽셀이 아니라, svg 내부 1만큼이고 이건 픽셀이랑은 다른 개념이었음 슈발
});

// 트랜스폼 업데이트 함수
function updateTransform() {
    // svg.setAttribute('viewBox', `${-translateX} ${-translateY} ${window.innerWidth / scale} ${window.innerHeight / scale}`);
    svg.setAttribute('viewBox', `${-translateX} ${-translateY} ${full_width / scale} ${full_height / scale}`);
    //그러니까 그냥 어디서부터 보여줄 것인지 정하는 건, svg 내부 좌표로 선택함. 그리고 얼만큼 왼쪽 아래쪽 보여줄 것인지는 뒤에 있는 2개가 정함
    //이걸 알고 있었어야 했어...ㅠㅠ
}