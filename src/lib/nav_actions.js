// nav_actions.js
// actions.js
export function toggleMenu(node) {
    const offCanvasMenu = document.querySelector('.off-canvas-menu');
    const overlay = document.querySelector('.overlay');

    function handleClick() {
        offCanvasMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    function closeMenu() {
        offCanvasMenu.classList.remove('open');
        overlay.classList.remove('active');
    }

    node.addEventListener('click', handleClick); // 버튼 클릭 시 동작
    overlay.addEventListener('click', closeMenu); // 배경 클릭 시 닫힘

    return {
        destroy() {
            // DOM 제거 시 리스너도 제거
            node.removeEventListener('click', handleClick);
            overlay.removeEventListener('click', closeMenu);
        }
    };
}
