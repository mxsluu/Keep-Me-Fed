const ingredients = [
    {
        name: 'Eggs',
        price: 4,
        locationName: "Ralph's",
        location: '201 Madonna Rd, San Luis Obispo, CA 93405'
    },
    {
        name: 'Butter',
        price: 2,
        locationName: "Ralph's",
        location: '201 Madonna Rd, San Luis Obispo, CA 93405'
    },
    {
        name: 'Salt',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Black Pepper',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'White Rice',
        price: 7,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Prego® Traditional Italian Sauce',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Spaghetti',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Frozen fully-cooked beef meatballs',
        price: 8,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Grated parmesan cheese',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Olive Oil',
        price: 5,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Bell Pepper',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Sweet Onion',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Ground Beef',
        price: 4,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Salsa',
        price: 2,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Black Beans',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Tomatoes',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Green Chiles',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Jasmine Rice',
        price: 4,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Taco Seasoning',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Chili Powder',
        price: 2,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Chicken Stock',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Shredded Cheese',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Salmon Fillets',
        price: 12,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Minced Garlic',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Italian Herb Seasoning Blend',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Roasted Chicken',
        price: 6,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Tortillas',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Lemon',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Corn',
        price: 1,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Cheddar Cheese',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Oil',
        price: 4,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Sourdough Bread',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Bacon',
        price: 4,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Romaine Lettuce',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Mayonnaise',
        price: 4,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Parsley',
        price: 2,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
    {
        name: 'Parmesan',
        price: 3,
        locationName: "Walmart",
        location: '1168 W Branch St, Arroyo Grande, CA 93420'
    },
]

module.exports = {
    ingredients
}