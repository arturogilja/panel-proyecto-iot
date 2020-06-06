import axios from 'axios'

export const getItems = async () => {
  return axios.get('https://arturogil.com.mx/iot-api/items')
}
