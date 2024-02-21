const { PrismaClient } = require('@prisma/client')
const { restaurants } = require('./restaurants.js')
const { recipes } = require('./recipes.js')
const { ingredients } = require('./ingredients.js')
const prisma = new PrismaClient()

async function main() {
    for (let restaurant of restaurants) {
        await prisma.Restaurant.create({
            data: restaurant
        })
    }
    for (let ingredient of ingredients) {
        await prisma.Ingredient.create({
            data: ingredient
        })
    }
    for (let recipe of recipes) {
        const ingredient_ids = await prisma.Ingredient.findMany({
            where: {
                name: {in: recipe.ingredients_list}
            },
            select: {
                id: true
            }
        })
        await prisma.Recipe.create({
            data: {
                name: recipe.name,
                instructions: recipe.instructions,
                cookTime: recipe.cookTime,
                priceRange: recipe.priceRange,
                genre: recipe.genre,
                photo: recipe.photo,
                source: recipe.source,
                ingredients: {
                    connect: ingredient_ids
                }
            }
        })
    }
}

main().catch(e => {
    console.log(e)
    process.exit(1)
}).finally(() => {
    prisma.$disconnect();
})