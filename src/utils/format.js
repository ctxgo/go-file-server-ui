
export function formatBytesAsObject(bytes, decimals = 2) {
  if (bytes === 0) return '0Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return {
    value: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i]
  }
}

export function formatBytes(bytes, decimals = 2) {
  const { value, unit } = formatBytesAsObject(bytes, decimals)
  return `${value}${unit}`
}

export function convertToBytes(sizeWithUnit) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const regex = /^([\d\.]+)\s*([a-zA-Z]+)$/
  const match = sizeWithUnit.match(regex)
  if (!match) return NaN

  const value = parseFloat(match[1])
  const unit = match[2]

  const unitIndex = units.indexOf(unit)
  if (unitIndex === -1) return NaN

  return value * Math.pow(1024, unitIndex)
}
