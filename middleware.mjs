const globalMiddleware = (req, res, next) => {
  req.name = "apple"
  console.log("global middleware apple")
  next();
}

const authMiddleware = (req, res, next) => {
  console.log("check here for login")
  res.json({ error: "you are not logged in" })
  // next()
}

export { globalMiddleware, authMiddleware }