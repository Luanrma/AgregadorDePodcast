const sideBarOpened = document.querySelector('.side-bar-opened')
const sideBarClosed = document.querySelector('.side-bar-closed')
const btnCloseSideBar = document.querySelector('.btn-close-side-bar')
const btnOpenSideBar = document.querySelector('.side-bar-closed')

btnCloseSideBar.addEventListener('click', () => openOrCloseSideBar({widthValue: '0', displayValue: 'flex'}))
btnOpenSideBar.addEventListener('click', () => openOrCloseSideBar({widthValue: '20rem', displayValue: 'none'}))

const openOrCloseSideBar = props => {
    sideBarOpened.style.width = props.widthValue
    sideBarClosed.style.display = props.displayValue
}