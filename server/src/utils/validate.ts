const emailRegex = new RegExp(
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
)
const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
)
const usernameRegex = new RegExp(/^[a-zA-Z0-9_]{3,20}$/)
const urlRegex = new RegExp(
  /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/
)

export const validate = {
  email: (email: string) => {
    if (!emailRegex.test(email)) {
      throw new Error('Email is invalid')
    }

    if (email.length > 254) {
      throw new Error('Email is too long')
    }
  },
  username: (username: string) => {
    if (!usernameRegex.test(username)) {
      throw new Error('Username is invalid')
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters')
    }

    if (username.length > 20) {
      throw new Error('Username must be less than 20 characters')
    }

    if (username.includes(' ')) {
      throw new Error('Username cannot contain spaces')
    }
  },
  password: (password: string) => {
    if (!passwordRegex.test(password)) {
      throw new Error('Password is invalid')
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
  },
  link: (link: string) => {
    if (!urlRegex.test(link)) {
      throw new Error('Link is invalid')
    }
  }
}
