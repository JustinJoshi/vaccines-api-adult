# Vaccines API - Adult Edition

A full-stack application that helps adults stay on top of their immunization schedule. Enter your age and get personalized vaccine recommendations based on CDC guidelines.

**Link to project:** https://github.com/JustinJoshi/vaccines-api-adult

[Vaccines API Adult](https://vaccines-api-adult.onrender.com)

## How It's Made:

**Tech used:** Node.js, Express, MongoDB, EJS, JavaScript

I built this as a RESTful API to solve a real problem: helping adults track which vaccines they need based on age. The backend uses Express.js and Node.js to handle API endpoints. I researched CDC's adult immunization schedules and created a MongoDB database to store vaccine info including age ranges, names, dosage schedules, and recommendations.

The main endpoint accepts an age parameter and queries MongoDB to return relevant vaccines for that age group. I structured the data to handle different age brackets (19-26, 27-49, 50-64, 65+) and special conditions requiring additional vaccines. The front end uses EJS templates with a clean, healthcare-themed interface where users can search for suggested vaccines.

I implemented input validation to prevent invalid ages, error handling middleware for database issues, and clear JSON responses. The app also includes user authentication so people can save their information and track their vaccine history over time.

## Optimizations

I could implement caching using Node-cache to reduce response times for repeated queries. Since vaccine schedules don't change daily, caching data for 24 hours would significantly improve performance without serving stale information.

The database query logic could be refactored to use MongoDB's aggregation pipeline instead of multiple separate queries. This would reduce database calls from 3-4 per request down to a single aggregated query, especially helpful for complex age-based filtering.

Adding index fields in MongoDB on the age range columns would speed up lookups considerably. I could also implement rate limiting on the API endpoints to prevent abuse and ensure fair usage across all users.

For the front end, I could add client-side form validation before hitting the server, and implement loading states so users get visual feedback while waiting for results. Adding a vaccine history timeline view would also improve the user experience by showing past, current, and upcoming vaccines in a visual format.

## Lessons Learned:

This project taught me how important data modeling is before writing code. I started with a simple structure but quickly realized I needed to account for overlapping age ranges, multiple doses, and conditional recommendations. Redesigning the schema early saved major headaches later.

Working with healthcare data taught me about responsibility in software development. Vaccine information impacts health decisions, so I added disclaimers and always recommend consulting healthcare providers. It reminded me that developers build tools with real impacts on people's lives.

I also gained deeper understanding of API design principles. Clear endpoint naming, consistent response formats, and thorough documentation aren't just nice-to-haves, they're essential for a usable API.

## Examples:

Take a look at these other projects in my portfolio:

**Vaccines API - Birth Edition:** https://github.com/JustinJoshi/vaccines-api-birth
