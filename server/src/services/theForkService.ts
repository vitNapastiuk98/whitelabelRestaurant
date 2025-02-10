import axios from 'axios'

export class TheForkService {
    private THE_FORK_API_KEY = 'your-api-key' // Replace with your actual API key
    private THE_FORK_BASE_URL = 'https://api.thefork.com/api'
//TODO check params
    private theForkClient = axios.create({
        baseURL: this.THE_FORK_BASE_URL,
        headers: {
            Authorization: `Bearer ${this.THE_FORK_API_KEY}`,
            Accept: 'application/json'
        }
    } as any)

    async getRestaurantDetails(restaurantId: string) {
        const response = await this.theForkClient.get(`/restaurants/${restaurantId}`)
        return response.data
    }

    async getRestaurantReservations(restaurantId: string) {
        const response = await this.theForkClient.get(`/restaurants/${restaurantId}/reservations`)
        return response.data
    }

    async getRestaurantAvailability(restaurantId: string, date: string, partySize: number) {
        const response = await this.theForkClient.get(`/restaurants/${restaurantId}/availability`, {
            params: { date, partySize }
        } as any)
        return response.data
    }
}