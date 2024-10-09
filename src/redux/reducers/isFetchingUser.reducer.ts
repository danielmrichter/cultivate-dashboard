const isFetchingUser = (state=true, action) => {
    switch (action.type) {
        case 'USER_IS_FETCHED':
            return false    
        default:
            return state
    }
}

export default isFetchingUser