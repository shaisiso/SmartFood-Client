class ItemInOrderService {
    getItemsInOrderFromChosenItems=(chosenItemsToDisplay)=>{
        let itemsInOrder = []
        chosenItemsToDisplay.forEach(item => {
            let itemsForApi = [...item.itemsInOrder].map(iio=>{
                if (iio.order)
                    delete iio.order
                return iio
            })
            
            itemsInOrder.push(...itemsForApi)
        })
        return itemsInOrder
    }
    buildChosenItems = (itemsInOrder) => {
        if (!itemsInOrder)
            return null
        let chosens = []
        itemsInOrder.forEach(itemInOrder => {
            let chosenItemIndex = chosens.findIndex(chosenItem => chosenItem.itemId === itemInOrder.item.itemId)
            if (chosenItemIndex !== -1) {
                chosens[chosenItemIndex].quantity += 1
                chosens[chosenItemIndex].price += itemInOrder.price
                chosens[chosenItemIndex].itemsInOrder.push(itemInOrder)
            }
            else {
                let item = { ...itemInOrder.item }
                chosens.push({ ...item, price: itemInOrder.price, itemsInOrder: [itemInOrder], quantity: 1 })
            }
        })
        return chosens
    }
} export default new ItemInOrderService()