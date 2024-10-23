# only1 Test

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```


some notes:
- I should have used environment variable for security, but to make it convenient for you to run the project, I have put the database connection string in the code.
- I have used some shadcn and tailwindcss because I don't have enough time to make the detailed design. I think the shadcd also has enough aria support.
- The auth part is insane in tanstack router + tanstack start. everything is on server side, it's really hard to use localstorage or cookies to store it, so currently everytime you refresh the page, the user will be logged out. I think it's a good practice to use server side auth, but it's really hard to implement in this task.
- Not to use useEffect is a tough task because it make it difficult to handle mount event. But I managed to finish the main features.
- Tanstack Router has some difficulty in vite's HMR. I had a quick fix and might submit a pr after this.