import pg from 'pg'

const host = 'unckzrleeaywriuitwko.db.ap-southeast-1.nhost.run'
const port = 5432
const user = 'postgres'
const password = 'b5bGAHbz4Mf7S5m'
const database = 'unckzrleeaywriuitwko'

const pool = new pg.Pool({
    user,
    password,
    host,
    port,
    database,
})

export async function query(text: string, params: any[]) {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
}
