// TODO: Add hour/minute/second time customizers like Slack

const MESSAGE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

export const formatMessageDate = (date: Date) => {
  return MESSAGE_TIME_FORMATTER.format(date);
}
