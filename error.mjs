const errorController = (err, req, res, next) => {
  console.log(err)
  res.json({ error: "something is not ok" })
}

const undefinedRouteHandler = (req, res) => {
  res.json({ message: 'wrong route' });
}

export { errorController, undefinedRouteHandler }