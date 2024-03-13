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
        priceRange: 1,
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
        priceRange: 1,
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
        priceRange: 2,
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
        priceRange: 2,
        genre: 'Italian',
        photo: '/recipe/spaghetti&meatballs.png',
        source: 'https://www.campbells.com/prego/recipes/quick-spaghetti-meatballs/',
        ingredients_list: ["Spaghetti", "Prego® Traditional Italian Sauce", "Frozen fully-cooked beef meatballs", "Grated parmesan cheese"]
    },
    {
        name: 'Burrito Bowl',
        instructions:[
        "1. In a large pan, heat the olive oil over medium heat. Sauté the onions and red peppers. Add in hamburger and cook until browned. Drain grease. Salt and pepper to taste.",
        "2. Stir in salsa, black beans, corn, tomatoes, green chiles, jasmine rice, taco seasoning and chili powder. Pour in chicken stock and then bring to a light boil. Cover the pan and reduce heat to low. Cook for an additional 15 minutes, or until the rice is all the way cooked.",
        "3. Stir and season to taste. Add cheese if desired. Cover pot with lid and let rest for 5 minutes for the cheese to melt.",
        "4. Spoon into bowls and top with your favorite toppings. We like to serve over lettuce in a salad bowl and eat with tortilla chips."
        ],
        cookTime:35,
        priceRange: 3,
        genre: 'Mexican',
        photo:'/recipe/burrito-bowl.png',
        source:'https://www.iheartnaptime.net/burrito-bowls/' ,
        ingredients_list:["Olive Oil", "Bell Pepper", "Sweet Onion","Ground Beef","Salsa","Black Beans","Corn","Tomatoes","Green Chiles","Jasmine Rice","Taco Seasoning","Chili Powder","Chicken Stock","Shredded Cheese"]

    },
    {
        name: 'Baked Salmon',
        instructions:[
            "1. Preheat the oven to 400 degrees and grease a large baking pan. Arrange the salmon fillets on the baking sheet and season generously with salt and pepper.",
            "2. Stir together the olive oil, garlic, herbs, and juice of 1/2 of the lemon. Spoon this sauce over salmon fillets, being sure to rub all over the tops and sides of the salmon so it has no dry spots. Thinly slice the remaining 1/2 of the lemon and top each piece of salmon with a slice of lemon.",
            "3. Bake the salmon in the oven for 12-15 minutes or until the salmon is opaque and flaky when pulled apart with a fork. You can broil the last 1-2 minutes if desired.",
            "4. Garnish with fresh thyme or parsley if desired and serve."
        ],
        cookTime:25,
        priceRange: 2,
        genre:'None',
        photo:'/recipe/salmon.png',
        source:'https://www.lecremedelacrumb.com/best-easy-healthy-baked-salmon/',
        ingredients_list:["Salmon Fillets", "Olive Oil", "Salt", "Black Pepper", "Minced Garlic", "Italian Herb Seasoning Blend", "Lemon"]

    },
    {
        name: 'Chicken Quesadillas',
        instructions:[
         "1. In a large bowl, combine the diced tomatoes, black beans, corn, and taco seasoning. Set aside.",
         "2. Heat a large skillet to med-high heat and add ½ teaspoon oil and a tortilla. Top tortilla with a handful of shredded cheese, about 1/3 cup of the vegetable mixture, and a serving of shredded chicken.",
         "3. Fold the tortilla and cook on both sides until crispy and golden. Remove from the pan and repeat with remaining tortillas."
        ],
        cookTime: 20,
        priceRange: 2 ,
        genre:'Mexican',
        photo:'/recipe/quesadilla.png',
        source: 'https://beautifuleatsandthings.com/2021/08/03/quick-easy-5-day-dinner-meal-plan/',
        ingredients_list:["Roasted Chicken","Tortillas","Tomatoes","Black Beans", "Corn", "Taco Seasoning", "Cheddar Cheese", "Oil"]

    },
    {
        name: 'Sourdough BLT Sandwiches',
        instructions:[
         "1. Cook bacon per package instructions and set aside.",
         "2. Spread about 1 tablespoon of mayonnaise on both pieces of toasted bread. Stack the lettuce on one piece of bread and then top with the tomato slices, and about 3-4 slices of bacon.",
         "3. Sprinkle with salt and pepper before topping with the remaining slice of bread."
        ],
        cookTime: 15,
        priceRange: 2,
        genre: 'None',
        photo:'/recipe/Sourdough-BLT-Sandwiches.png',
        source:'https://beautifuleatsandthings.com/2021/08/03/quick-easy-5-day-dinner-meal-plan/',
        ingredients_list:["Sourdough Bread", "Bacon", "Romaine Lettuce", "Tomatoes", "Mayonnaise", "Salt", "Black Pepper"]

    },
    {
        name: 'Pasta with Olive Oil and Garlic',
        instructions:[
          "1. Bring a large pot of water to a rolling boil. Toss in the spaghetti and cook until al dente.",
          "2. While the pasta is cooking, warm the olive oil over medium low heat. Add in the garlic and let it cook until soft and golden (you may need to lower the heat to keep it from browning too fast).",
          "3. Once the spaghetti is cooked drain it while reserving about 1 tablespoons of the starchy pasta water. Add the spaghetti to the pan with the oil and garlic. Toss the pasta around until it’s coated (this is where you can add in the starchy pasta water to keep the pasta moist if it looks too dry).",
          "4. Add in the parsley and grated cheese, toss to combine and serve."
        ],
        cookTime: 15,
        priceRange: 2 ,
        genre: 'Italian',
        photo:'/recipe/pasta-oil.png',
        source:'https://www.girlgonegourmet.com/dinner-for-one-easy-pasta-with-olive-oil-garlic/#tasty-recipes-6994-jump-target' ,
        ingredients_list:["Spaghetti", "Olive Oil", "Minced Garlic", "Parsley", "Parmesan", "Black Pepper"]

    }
]

module.exports = {
    recipes
}