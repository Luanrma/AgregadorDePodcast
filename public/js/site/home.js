const createMultiplesElement = (tags, props = {}, callback = null) => {
    tags.forEach(tag => {
        createNewElement(tag, props, callback)
    })
}

const createNewElement = (tag, props = {}, callback = null) => {
    const element = document.createElement(tag)
    if(props){
        const attributes = Object.entries(props)
        attributes.forEach(([key, value]) => element.setAttribute(key, value))
    }
    if(callback){
        callback(element)
    }
    return element
}

const checkFeed = document.querySelector('#check-feed')
const btnCreateNewItem = document.querySelector('#creation-new-item')
const player = document.querySelector('#modal-player')

const playerTeste = document.querySelector('#side-bar-player')

const close = document.querySelector('.close')

checkFeed.addEventListener('click', async () => await updatePodcastsFeed())

const updatePodcastsFeed = async () => {
    await fetch('/AgregadorDePodcasts/laravel/public/atualizarFeed')
    podCastsFeed()
}

const podCastsFeed = async () => {
    const mainFlex = document.querySelector('.main-flex') 
    let listarPodcasts = await fetch('/AgregadorDePodcasts/laravel/public/listarPodcasts')
    listarPodcasts = await listarPodcasts.json()

    listarPodcasts.forEach(podcast => {
        createNewElement('div', {id:podcast.podcastName, class:'main-item'}, element => {
            const mainItem = mainFlex.appendChild(element)
            mainItem.style.cursor = 'pointer'

            createNewElement('img',{src: podcast.image, width:"100%", height:"100%" }, element => {
                const imgPodcast = mainItem.appendChild(element)
                imgPodcast.onclick = () => {
                    modal.style.display = "block"
                    let selectedPodcast = document.querySelector(`#${podcast.podcastName}`)
                    openSelectedPodcast(selectedPodcast)
                }
            })
        })  
    })
}

const openSelectedPodcast = async (selectedPodcast) => {
    console.log(selectedPodcast)

    let podcastData = await fetch(`/AgregadorDePodcasts/laravel/public/selecionarPodcast/${selectedPodcast.id}`)
    podcastData = await podcastData.json()
    console.log('b',podcastData)

    podcastDetails(podcastData)
}

const podcastDetails = (podcastData) => {
    const podcastList = document.querySelector('#podcast-list')
    while (podcastList.firstChild) {
        podcastList.removeChild(podcastList.firstChild)
    }

    let count = 0
    podcastData.item.forEach(item => {
        if (count <= 5) {
            createNewElement('div', {class: 'podcast-box'}, element => {
                const podcastBox = podcastList.appendChild(element)
                podcastBox.style.cursor = 'pointer'

                createNewElement('p', {class: 'podcast-item'}, element => {
                    const podcastItem = podcastBox.appendChild(element)
                    podcastItem.innerText = item.title
                
                    podcastItem.onclick = () => {
                        
                        if(player.firstChild != null && playerTeste.firstChild != null) {
                            player.removeChild(player.firstChild)
                        }
                    
                        createNewElement('audio', {}, element => {
                            element.controls = true
                            const audioControl = player.appendChild(element)
                    
                            createNewElement('source',{src:item.enclosure['@attributes'].url, type:item.enclosure['@attributes'].type}, element => {
                                audioControl.appendChild(element) 
                            }) 
                        })
                    }
                })  
            })
        }
        count ++
    })
}

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

podCastsFeed()