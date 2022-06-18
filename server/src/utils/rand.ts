/* eslint-disable space-before-function-paren */
export function randomString(length: number): string {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

export function randomizeArray(array: any[]): any[] {
  return array.sort(() => Math.random() - 0.5)
}

export function generateNumber(length: number): number {
  const nums: number[] = []

  for (let i = 0; i < length; i++) {
    nums.push(randomNumber(0, 9))
  }

  return parseInt(nums.join(''))
}

export function generate(): string {
  const str1 = randomString(randomNumber(2, 3))
  const str2 = randomString(randomNumber(2, 3))

  const num1 = randomNumber(0, 9)
  const num2 = randomNumber(0, 9)

  const random = randomizeArray([str1, str2, num1, num2])

  return random.join('')
}
