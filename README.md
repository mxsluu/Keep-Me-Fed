Keep Me Fed is a platform where people can find ways of obtaining meals; either through low-budget recipes or restaurants that fit within their preferences. People can then find places where they can purchase the ingredients to these recipes or the actual restaurants themselves. The meal options that users will see will be prioritized in accordance with their daily schedule and their budget.

## Getting Started
First, clone the repository.

```bash
git clone git@github.com:CSC307Winter2024/KeepMeFed.git
```
Then, enter the root directory.

```bash
cd KeepMeFed
```

Then, get a database running. You will need Docker installed on your machine. 

```bash
docker-compose up
```

Then, make sure all your node modules are installed.

```bash
npm install
```

Next, make a .env file in the root directory with the following:

```
DATABASE_URL="postgresql://admin:password@localhost:5432/mydb?schema=public"
NEXTAUTH_SECRET="<some secret here>"
```
Start prisma client and name the migration "initial". The seed command will automatically run and populate the database. If prompted to reset the public schema, enter "y" and continue.

```bash
npx prisma migrate dev
```

If there is any errors in seeding or populating the database, try resetting the database (the seed command will automatically rerun as well).

```bash
npx prisma migrate reset
```
Or try seeding the database.

```bash
npx prisma db seed
```

Start the application with the following command.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch Keep Me Fed.


## Look at the database in Prisma studio.

```bash
npx prisma studio
```
## Known issues/bugs
* Attempting to enter strings into budget input can cause unexpected results/issues and may not save correctly
* Attempting to use "," for large budgets may lead to issues (untested/uknown for things like 1,000 or 10,000 but if this is your weekly budget do you really need this app?)
* User location input has to be in the form lat,long at the moment (anything other form can cause issues)
* Location input has to be in coordinates for this version

