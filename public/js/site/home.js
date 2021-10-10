const checkFeed = document.querySelector('#check-feed')
const btnCreateNewItem = document.querySelector('#creation-new-item')
const sideBarPlayer = document.querySelector('#side-bar-player')
const mainFlex = document.querySelector('.main-flex') 
const loading = document.querySelector('#loading-home')
const modalPodcast = document.getElementById("modal-podcast")

let podSelect = ''

const updatePodcastsFeed = async () => {
    loading.style.display = 'block'
    await fetch('/AgregadorDePodcasts/laravel/public/atualizarFeed')
    podcastHomeList()
}

const podcastsFeed = async () => {
    
    loading.style.display = 'block'
    let listarPodcasts = await fetch('/AgregadorDePodcasts/laravel/public/listarPodcasts')
    
    loading.style.display = 'none'
    return await listarPodcasts.json()    
}

const podcastHomeList = async () => {
    let listarPodcasts = await podcastsFeed()

    listarPodcasts.forEach(podcast => {
        createNewElement('div', {id:podcast.podcastName, class:'main-item'}, element => {
            const mainItem = mainFlex.appendChild(element)
            mainItem.style.cursor = 'pointer'
            
            createNewElement('div', {class:'main-item-tumb'}, element => {
                const mainItemTumb = mainItem.appendChild(element)
                
                createNewElement('img', {src: podcast.image, width:"100%", height:"100%" }, element => {
                    const imgPodcast = mainItemTumb.appendChild(element)
                    imgPodcast.onclick = () => {
                        modalPodcast.style.display = "block"
                        let selectedPodcast = document.querySelector(`#${podcast.podcastName}`)
                        openSelectedPodcast(selectedPodcast)
                    }
                })
            })

            createNewElement('div', {class:'main-item-info'}, element => {
                const mainItemInfo = mainItem.appendChild(element)
                mainItemInfo.innerHTML = `<h1>${ podcast.title }</h1>`
            })

        })  
    })
}

const openSelectedPodcast = async (selectedPodcast) => {
    if(podSelect != selectedPodcast.id) {
        selectedPage = 1
    }
    podSelect = selectedPodcast.id
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