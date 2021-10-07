

const checkFeed = document.querySelector('#check-feed')
const btnCreateNewItem = document.querySelector('#creation-new-item')
const playerTeste = document.querySelector('#side-bar-player')
const close = document.querySelector('.close')
const mainFlex = document.querySelector('.main-flex') 
const podcastList = document.querySelector('#podcast-list')

const btnPageBack = document.querySelector('#pgn-back')

const btnPageActual = document.querySelector('#pgn-actual')
const btnPageNext = document.querySelector('#pgn-next')
const btnPageTotal = document.querySelector('#pgn-total')

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

let podSelect = ''
let selectedPage = 1

const updatePodcastsFeed = async () => {
    await fetch('/AgregadorDePodcasts/laravel/public/atualizarFeed')
    podcastHomeList()
}

const podcastsFeed = async () => {
    let listarPodcasts = await fetch('/AgregadorDePodcasts/laravel/public/listarPodcasts')
    return await listarPodcasts.json()    
}

const podcastHomeList = async () => {
    let listarPodcasts = await podcastsFeed()
    listarPodcasts.forEach(podcast => {
        createNewElement('div', {id:podcast.podcastName, class:'main-item'}, element => {
            const mainItem = mainFlex.appendChild(element)
            mainItem.style.cursor = 'pointer'

            createNewElement('img',{src: podcast.image, width:"100%", height:"100%" }, element => {
                const imgPodcast = mainItem.appendChild(element)
                imgPodcast.onclick = () => {
                    console.log(modal)
                    modal.style.display = "block"
                    let selectedPodcast = document.querySelector(`#${podcast.podcastName}`)
                    openSelectedPodcast(selectedPodcast)
                }
            })
        })  
    })
}

const openSelectedPodcast = async (selectedPodcast) => {
    podSelect = selectedPodcast.id
    console.log('clic',podSelect)
    let podcastData = await fetch(`/AgregadorDePodcasts/laravel/public/selecionarPodcast/${selectedPodcast.id}`)
    podcastData = await podcastData.json()
    podcastModalControl(podcastData, selectedPage, 10)
}


checkFeed.addEventListener('click', async () => await updatePodcastsFeed())
btnCreateNewItem.addEventListener('click', () => {
    createMultiplesElement(['div'], {class:'main-item'}, newElement => {
        const mainContent = document.querySelector('.main-flex')
        newElement.addEventListener('click', () => {
            alert('teste')
        })
        let content = mainContent.insertAdjacentElement("beforeend", newElement)
        content.innerHTML = "TESTE"
    })
})

podcastHomeList()