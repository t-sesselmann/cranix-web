
export interface Customer {
    id: number,
    uuid: string,
    address1: string,
    address2: string,
    category: string,
    locality: string,
    contact: string,
    country: string,
    description: string,
    name: string,
    name2: string,
    postalCode: string,
    recDate: number,
    state: string,
    telephone: string
}

export interface Institute {
    id: number,
    uuid: string,
    adminPW: string,
    anonDhcpNetwork: string,
    cephalixPW: string,
    domain: string,
    firstRoom: string,
    gwTrNet: string,
    ipAdmin: string,
    ipBackup: string,
    ipGateway: string,
    ipMail: string,
    ipPrint: string,
    ipProxy: string,
    ipTrNet: string,
    ipVPN: string,
    locality: string,
    name: string,
    network: string,
    serverNetwork: string,
    nmTrNet: string,
    type: string,
    deleted: string,
    recDate: number,
    validity: number,
    ayTemplate: string,
    customerId: number,
    regCode: string
}

export interface DynDns {
    id: number,
    cephalixinstituteId: number,
    hostname: string,
    domain: string,
    ip: string,
    port: string,
    ro: boolean
}


export interface CopyFile {
    instituteIds: number [],
    directory: string, 
    mode: string,
    execute: boolean,
    file: File
}

export interface Object {
    id: number,
    cephalixId: number,
    objectType: string,
    objectName: number,
    ossId: number,
    instituteId: number,
    lastSync: number
}

export interface Note{
  tite: string, 
  type: string, 
  text: string
}

export interface Ticket{
  id: number,
  cephalixinstituteId: number,
  ossuserId: number,
  ownerId: number,
  type: string,
  firstname: string,
  lastname: string,
  email: string,
  title: string,
  priority: number,
  created: number,
  done: boolean
}

export interface Article{
  id: number,
  cephalixinstituteId: number,
  sender: string,
  recipient: string,
  title: string,
  type: string,
  seen: boolean,
  text: string,
  created: number,
  reminder: number,
  workTime: number
}
export interface Repository{
  id: number,
  name: string,
  type: string,
  description: string,
  repository: string
}

export interface OssCare{
  id: number,
  cephalixinstituteId: number,
  description: string,
  access: string,
  contact: string,
  recDate: number,
  validity: number
}

export interface OssCareMessage{
  id: number,
  cephalixosscareId: number,
  recDate: number,
  type: string,
  description: string,
  text: string
}
