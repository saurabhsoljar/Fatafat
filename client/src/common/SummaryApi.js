import Register from "../pages/Register"

export const baseURL = "http://localhost:8080"

const SummaryApi = {
  Register : {
    url : '/api/user/register',
    method : 'post'
  }
}

export default SummaryApi