const verifyEmailTemplate = ({name,url}) =>{
  return `
  <p>Dear ${name}</p>
    <p>Thank you for registering Fatafat.</p>
    < a href=${url} style="color:white;background : blue; margin-top : 10px">
    Verify Email
    </>
  `
}

export default verifyEmailTemplate