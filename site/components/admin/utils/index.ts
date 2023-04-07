export function humanCase(str: string) {
  if (str === 'SaaS') return str
  return str.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1')
}

export function isEmail(email: string) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
  return regex.test(email)
}

export function isUrl(url: string) {
  var regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  return regex.test(url)
}

export function isDate(date: string) {
  var d = new Date(date)
  return !isNaN(d.valueOf())
}
