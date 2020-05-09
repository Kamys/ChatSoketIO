import { format, isValid } from 'date-fns'

export const formatChatDate = (dateText: string) => {
  const date = new Date(dateText)
  if (!isValid(date)) {
    console.error('Date is not valid:', date)
    return '---'
  }
  return format(date, 'kk:mm')
}
