const verifyEmailTemplate = ({ name, url }) => {
  return `
    <p>Dear ${name},</p>
    <p>Thank you for registering with Fatafat.</p>
    <a href=${url} style="color: white; background: #071263; margin-top: 10px; padding: 10px 20px; text-decoration: none; display: inline-block;">
      Verify Email
    </a>
  `;
};

export default verifyEmailTemplate;
