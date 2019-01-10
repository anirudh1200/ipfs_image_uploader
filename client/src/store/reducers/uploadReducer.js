// Here the password needs to be a 32byte and iv needs to be 16byte only
// Have currently kept a default generic password which is useless but rather
// only for demonstration purposes which currently cannot be changed
const initState = {
  web3: '',
  contract: '',
  account: '',
  password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  iv: 'aaaaaaaaaaaaaaaa',
  selectedHash: '',
  selectedHashDesc: ''
}

const uploadReducer = (state = initState, action) => {
  switch(action.type){
    case 'SET_ACCOUNT_CONTRACT':
      return{
        ...state,
        web3: action.web3,
        account: action.account,
        contract: action.contract
      }
    case 'CHANGE_SELECTED_HASH':
      return{
        ...state,
        selectedHash: action.hashValue,
        selectedHashValue: action.hashDesc
      }
    default:
      console.log("Default reducer");
      return state;
  }
}

export default uploadReducer;
