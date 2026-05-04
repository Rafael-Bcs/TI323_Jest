const app = require("../src/app")

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`)
    console.log(`Teste em`)
    console.log(`http://localhost:${PORT}/health`)
})