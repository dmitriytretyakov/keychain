export type KeychainRecord = {
  id: string,
  payload: KeychainRecordPayload,
}

export type KeychainRecordPayload = {
  name: string,
  login?: string,
  password: string,
  comment?: string
}
