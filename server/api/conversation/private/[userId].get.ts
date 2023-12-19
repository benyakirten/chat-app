export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  const res = await sendAuthedRequest(event, 'get', `api/conversation/private/${userId}`)

  setResponseStatus(event, res.status)
  return res.data
})
