const recipes = [
    {
        name: 'Scrambled Eggs',
        instructions: [
            "1. Lightly beat the eggs, 3/4 teaspoon salt and a few grinds of black pepper in a medium bowl.",
            "2. Melt 1 tablespoon of the butter in a medium nonstick skillet over low heat; swirl to coat the bottom and sides.",
            "3. Add the eggs, and cook slowly, scraping them up with a rubber spatula occasionally, until most of the liquid has thickened and the eggs are soft, about 10 minutes. ",
            "4. Remove them from the heat, and gently fold in the remaining 1 tablespoon of butter.",
            "5. Serve Hot"
        ],
        cookTime: 15,
        priceRange: '$',
        genre: 'Breakfast',
        photo: '/recipe/scrambledeggs.png',
        source: 'https://www.foodnetwork.com/recipes/food-network-kitchen/simple-scrambled-eggs-3363098',
        ingredients_list: ["Eggs", "Butter", "Black Pepper", "Salt"]
    },
    {
        name: 'Rice',
        instructions: [
            "1. Measure out 1 cup of rice.",
            "2. Rinse and clean rice in cold water.",
            "3. Add enough water to cover an inch over the top of the rice.",
            "4. Put rice in rice cooker and cook.",
            "5. Stir rice once rice cooker is finished.",
            "6. Serve hot."
        ],
        cookTime: 10,
        priceRange: '$',
        genre: 'Asian',
        photo: '/recipe/rice.png',
        source: 'Experience',
        ingredients_list: ["White Rice"]
    },
    {
        name: 'Eggs with Rice',
        instructions: [
            "1. Measure out 1 cup of rice.",
            "2. Rinse and clean rice in cold water.",
            "3. Add enough water to cover an inch over the top of the rice.",
            "4. Put rice in rice cooker and let cook.",
            "5. Lightly beat the eggs, 3/4 teaspoon salt and a few grinds of black pepper in a medium bowl.",
            "6. Melt 1 tablespoon of the butter in a medium nonstick skillet over low heat; swirl to coat the bottom and sides.",
            "7. Add the eggs, and cook slowly, scraping them up with a rubber spatula occasionally, until most of the liquid has thickened and the eggs are soft, about 10 minutes. ",
            "8. Remove them from the heat, and gently fold in the remaining 1 tablespoon of butter.",
            "9. Stir rice once rice cooker is finished.",
            "10. Mix rice and eggs in a bowl and enjoy while hot."
        ],
        cookTime: 10,
        priceRange: '$',
        genre: 'Asian',
        photo: '/recipe/eggswithrice.png',
        source: 'Experience',
        ingredients_list: ["Eggs", "Butter", "Black Pepper", "Salt", "White Rice"]
    },
    {
        name: 'Quick Spaghetti & Meatballs',
        instructions: [
            "1. Cook and drain the spaghetti according to the package directions.",
            "2. While the spaghetti is cooking, heat the sauce and meatballs in a 3-quart saucepan over medium heat to a boil. ",
            "3. Reduce the heat to low. Cover and cook for 20 minutes or until the meatballs are heated through, stirring occasionally.",
            "4. Serve the sauce and meatballs over the spaghetti. Sprinkle with the cheese, if desired."
        ],
        cookTime: 35,
        priceRange: '$$',
        genre: 'Italian',
        photo: '/recipe/spaghetti&meatballs.png',
        source: 'https://www.campbells.com/prego/recipes/quick-spaghetti-meatballs/',
        ingredients_list: ["Spaghetti", "Prego® Traditional Italian Sauce", "Frozen fully-cooked beef meatballs", "Grated parmesan cheese"]
    }
]

module.exports = {
    recipes
}