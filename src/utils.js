// check if email is valid

export const checkUsername = (username) => {
  const regex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/
  const hasSpecialCharacters = /[^a-zA-Z0-9]/.test(username)
  const startsWithNonAlphabeticalCharacter = /^[^a-zA-Z]/.test(username.charAt(0))
  const hasSpaces = /\s/.test(username)
  const length = username.length
  return {
    status: regex.test(username),
    hasSpecialCharacters,
    startsWithNonAlphabeticalCharacter,
    hasSpaces,
    length,
  }
}

export const createFailMessage = (data) => {
  let message = 'Username cannot:<br>'
  if (data.hasSpecialCharacters) message += '- Contain special characters.<br>'
  if (data.startsWithNonAlphabeticalCharacter) message += '- Start with a non alphabetical character.<br>'
  if (data.hasSpaces) message += '- Have spaces.<br>'
  if (data.length < 3 || data.length > 18) message += '- Be shorter shorter 3 or larger than 18 characters.<br>'
  const cleanLastBr = message.replace(/<br>$/, '')
  return cleanLastBr
}

export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

