
const closeModal = document.querySelector("#close-modal")
const podcastList = document.querySelector('#podcast-list')
const btnPageBack = document.querySelector('#pgn-back')
const btnPageActual = document.querySelector('#pgn-actual')
const btnPageNext = document.querySelector('#pgn-next')
const btnPageTotal = document.querySelector('#pgn-total')
const btnPageStart = document.querySelector('#pgn-start')
const podcastPlayerModal = document.querySelector('#podcast-player-modal')

let selectedPage = 1

closeModal.onclick = function() {
  modalPodcast.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modalPodcast) {
    modalPodcast.style.display = "flex";
  }
}

const podcastModalControl = async (podcastData = null, actualPg, perPage) => {
    //dragElement(modalPodcast);

    podcastData = podcastData

    if(podcastData == null) {
        podcastData = await fetch(`/AgregadorDePodcasts/laravel/public/selecionarPodcast/${podSelect}`)
        podcastData = await podcastData.json()
    }

    if(podcastList.querySelector('.podcast-box')) {
        podcastList.querySelectorAll('.podcast-box').forEach(item => {
            item.remove()
        })
    }
    
    let itens = paginator(podcastData.item, actualPg, perPage)
    podcastListModal(itens)
}

const podcastListModal = (itens) => {
    itens.data.forEach(item => {
        createNewElement('div', {class: 'podcast-box'}, element => {
            const podcastBox = podcastList.appendChild(element)
            podcastBox.style.cursor = 'pointer'
            podcastBox.onclick = () => playerControlModal(item)

            createNewElement('div', {class: 'podcast-item-img'}, element => {
                const podcastItemImg = podcastBox.appendChild(element)

                createNewElement('img', {src: item.itunes.image}, element => {
                    podcastItemImg.appendChild(element)
                })
            })

            createNewElement('div', {class: 'podcast-item-info'}, element => {
                const podcastItem = podcastBox.appendChild(element)
                
                createNewElement('p', {}, element => {
                    podcastItem.innerText = item.title
                })  
            })  
        })
    })
    paginateControlModal(itens)
}

const paginateControlModal = (itens) => {
    btnPageStart.innerText = "Início"
    btnPageBack.innerText = "<<"
    btnPageActual.innerText = itens.page
    btnPageActual.style.backgroundColor = '#72299c'
    btnPageNext.innerText = ">>"

    if(btnPageTotal.innerText != "Acabou") {
        btnPageTotal.innerText = itens.page == btnPageTotal.innerText ? "Acabou" : itens.totalPages
    }
    
    btnPageStart.onclick = () => {
        selectedPage = 1
        podcastModalControl(null, selectedPage)
    }

    btnPageBack.onclick = () => {
        if (btnPageTotal.innerText == "Acabou") {
            btnPageTotal.innerText =  itens.totalPages
        }
        selectedPage = selectedPage - 1 <= 1 ? 1 : selectedPage - 1
        podcastModalControl(null, selectedPage)
    }

    btnPageNext.onclick = () => {
        selectedPage = selectedPage + 1 >= itens.totalPages ? itens.totalPages : selectedPage + 1
        podcastModalControl(null, selectedPage)
    }

    btnPageTotal.onclick = () => {
        selectedPage = btnPageActual.innerText == itens.totalPages ? "Acabou" : btnPageTotal.innerText
        if(selectedPage == "Acabou") {
            selectedPage =  itens.totalPages
        }
        podcastModalControl(null, selectedPage)
    }
}

const playerControlModal = (item) => {
    const modalPlayer = document.querySelector('#modal-player')

    if(modalPlayer.firstChild != null) {
        modalPlayer.removeChild(modalPlayer.firstChild)
    }

    createNewElement('div', {id: 'modal-player-control'}, element => {
        const modalPlayerControl = modalPlayer.appendChild(element)

        let divImgControl = createNewElement('div', {class: 'modal-player-img'}, element => {
            const modalPlayerImg = modalPlayerControl.appendChild(element)
        
            createNewElement('img', {src: item.itunes.image}, element => {
                modalPlayerImg.appendChild(element)
            })
        })
        
        let divAudioControl = createNewElement('div', {class: 'modal-audio-control'}, element => {
            let verifyModalAudioExists = document.querySelector('.modal-audio-control')
            
            if(verifyModalAudioExists != null) {
                verifyModalAudioExists.remove()
            }
            const modalAudioControl = podcastPlayerModal.appendChild(element)
            createNewElement('audio', {id:'audioController', controls: true, hidden:true}, element => {
                const audioControl = modalAudioControl.appendChild(element)
                createNewElement('source', {src:item.enclosure['@attributes'].url, type:item.enclosure['@attributes'].type}, element => {
                    audioControl.appendChild(element) 
                })
            })
        })

        let play = false
        const pressPlay = divAudioControl.querySelector('#audioController')

        const btnPauseOrPlay = createNewElement('img', {id: "btn-pause-play", src: "assets/icons/btn-play.png"}, element => {
            divAudioControl.appendChild(element)
            element.onclick = () => {
                if (play == false) {
                    play = true
                    pressPlay.play()
                    btnPauseOrPlay.src = "assets/icons/btn-pause.png"
                } else {
                    play = false
                    pressPlay.pause()
                    btnPauseOrPlay.src = "assets/icons/btn-play.png"
                }
            }
        })
    })
}

// function dragElement(elmnt) {
//   let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   if (document.getElementById("modal-content")) {
//     /* if present, the header is where you move the DIV from:*/
//     document.getElementById("modal-content").onmousedown = dragMouseDown;
//   } else {
//     /* otherwise, move the DIV from anywhere inside the DIV:*/
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//   }

//   function closeDragElement() {
//     /* stop moving when mouse button is released:*/
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }