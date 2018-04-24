// eslint-disable-next-line
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default emails => {
  const invalidEmails = emails
    .split(',')
    // trimming off whitespace from every individual email
    .map(email => email.trim())
    // validate email address off of regex, from email regex.com
    .filter(email => re.test(email) === false);

  if (invalidEmails.length) {
    if (invalidEmails.includes('')) {
      return 'Remove the comma or add another email';
    }
    return `These emails are invalid: ${invalidEmails}`;
  }
  return;
};
