import { readFile, writeFile } from 'node:fs/promises'

const registerController = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.statusCode = 400
    res.json({ error: "input is not valid" })
    // throw new Error(JSON.stringify({ error: "input is not valid" }))
  }

  const fileDataStr = await readFile("./db.json", {
    encoding: 'utf-8'
  })
  const fileData = JSON.parse(fileDataStr)
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }
  fileData.users.push(userData)
  await writeFile("./db.json", JSON.stringify(fileData))
  res.json({ message: "register successful" })
}

const loginController = (req, res, next) => {
  res.json({ message: "login not implemented" })
}

export { registerController, loginController }