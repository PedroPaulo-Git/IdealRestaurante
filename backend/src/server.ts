import app from './app';

// const PORT = Number(process.env.PORT) || 3000; 
const PORT = 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
