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

const paginator = (items, page, perPage) => {
    page = page || 1,
    perPage = perPage || 10,
    offset = (page - 1) * perPage,
  
    paginatedItems = items.slice(offset).slice(0, perPage),
    totalPages = Math.ceil(items.length / perPage);
    
    return {
        page: page,
        perPage: perPage,
        prePage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
        data: paginatedItems
    };
}
