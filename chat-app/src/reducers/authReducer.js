const authReducerDefaultState = {
    loggedIn:localStorage.getItem('token') ? true : false,
    email:localStorage.getItem('email'),
}

export default (state = authReducerDefaultState,action) => {
    switch(action.type){
        case 'LOGGED_IN':
            return {
                ...state,
                loggedIn:true,
                email:action.email
            }
        case 'LOGGED_OUT':
            return {
                ...state,
                loggedIn:false,
                email:undefined
            }
        default:
            return state
    }
}