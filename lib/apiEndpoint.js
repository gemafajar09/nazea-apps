import Env from "./env"

export const SERVER_ENDPOINT    = Env.SERVER_ENDPOINT
export const API_URL            = SERVER_ENDPOINT + "/api"

export const API_LOGIN          = API_URL + "/login"
export const API_SIMPAN_BOOKING = API_URL + "/simpanbooking"
export const API_JADWAL_BOOKING = API_URL + "/jadwalbooking"
export const API_KELAS_USER     = API_URL + "/getkelasuser"
export const API_BANNER         = API_URL + "/banner"
export const API_ABSEN          = API_URL + "/absen"

export const API_USER          = API_URL + "/getuser"