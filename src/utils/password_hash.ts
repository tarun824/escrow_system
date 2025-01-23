import bcrypt from 'bcrypt';




async function HashPassword({ pass }: { pass: string }) {
    const rounts = parseInt(process.env.SALT_ROUNDS as string, 10)
    const hash = bcrypt.hash(pass, rounts)
    return hash;
}
async function ComparePassword({ pass, hash }: { pass: string, hash: string }) {
    const rounts = parseInt(process.env.SALT_ROUNDS as string, 10)
    const isValid = bcrypt.compare(pass, hash)
    // returns true or false
    return isValid;
}
export { HashPassword, ComparePassword }