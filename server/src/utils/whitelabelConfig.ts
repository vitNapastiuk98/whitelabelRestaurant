export const whitelabelConfig = {
    restaurant1: {
        name: 'Restaurant 1',
        theForkId: '12345', // Required only if theFork is true
        options: {
            reservations: true,
            menu: true,
            events: true,
            about: true,
            contact: true,
            theFork: true // Enable The Fork integration
        },
        contactInfo: {
            email: 'info@restaurant1.com',
            phone: '+1234567890',
            address: '123 Main St, City, Country'
        }
    },
    restaurant2: {
        name: 'Restaurant 2',
        options: {
            reservations: true,
            menu: true,
            events: false,
            about: true,
            contact: true,
            theFork: false // Disable The Fork integration
        },
        contactInfo: {
            email: 'info@restaurant2.com',
            phone: '+0987654321',
            address: '456 Elm St, City, Country'
        }
    }
}