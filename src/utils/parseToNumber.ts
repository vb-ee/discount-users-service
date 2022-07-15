export const parseToNumber = (stringNumbers: { [key: string]: string }) => {
    const parsedNumbers: { [key: string]: number } = {}
    for (let num in stringNumbers) {
        parsedNumbers[num] = parseInt(num)
    }

    return parsedNumbers
}
