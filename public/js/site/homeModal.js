

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "flex";
  }
}


const podcastModalControl = async (podcastData = null, actualPg, perPage) => {
  podcastData = podcastData
  if(podcastData == null) {
      console.log(podSelect)
      console.log(`/AgregadorDePodcasts/laravel/public/selecionarPodcast/${podSelect}`)
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

          createNewElement('p', {class: 'podcast-item'}, element => {
              const podcastItem = podcastBox.appendChild(element)
              podcastItem.innerText = item.title
          })  
      })
  })
  paginateControlModal(itens)
}

const paginateControlModal = (itens) => {
  const btnPagination = document.querySelector('.pagination-button')
  btnPageBack.innerText = "<<"
  btnPageActual.innerText = itens.page
  btnPageActual.style.backgroundColor = '#72299c'
  btnPageNext.innerText = ">>"

  if(btnPageTotal.innerText != "Acabou") {
      btnPageTotal.innerText = itens.page == btnPageTotal.innerText ? "Acabou" : itens.totalPages
  }
  
  btnPageBack.onclick = () => {
      if (btnPageTotal.innerText == "Acabou") {
          btnPageTotal.innerText =  itens.totalPages
      }
      selectedPage = selectedPage - 1 <= 1 ? 1 : selectedPage - 1
      console.log('btnPageBack',selectedPage)
      podcastModalControl(null, selectedPage)
  }

  btnPageNext.onclick = () => {
      selectedPage = selectedPage + 1 >= itens.totalPages ? itens.totalPages : selectedPage + 1
      console.log('btnPageNext',selectedPage)
      podcastModalControl(null, selectedPage)
  }

  btnPageTotal.onclick = () => {
      selectedPage = btnPageActual.innerText == itens.totalPages ? "Acabou" : btnPageTotal.innerText
      if(selectedPage == "Acabou") {
          selectedPage =  itens.totalPages
      }
      console.log('btnPageTotal',selectedPage)
      podcastModalControl(null, selectedPage)
  }
}


const playerControlModal = (item) => {
  const player = document.querySelector('#modal-player')

  if(player.firstChild != null && playerTeste.firstChild != null) {
      player.removeChild(player.firstChild)
  }

  createNewElement('audio', {controls: true}, element => {
      const audioControl = player.appendChild(element)
      createNewElement('source', {src:item.enclosure['@attributes'].url, type:item.enclosure['@attributes'].type}, element => {
          audioControl.appendChild(element) 
      }) 
  })
}

dragElement(document.getElementById("myModal"));

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById("modal-content")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById("modal-content").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}