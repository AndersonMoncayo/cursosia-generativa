import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zksnydnjumdesdftajns.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function getSchema() {
  const tables = ['profiles', 'courses', 'enrollments', 'posts', 'purchases']
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.log(`Error reading ${table}:`, error)
    } else if (data && data.length > 0) {
      console.log(`Table ${table} columns:`, Object.keys(data[0]).join(', '))
    } else {
      console.log(`Table ${table} is empty. Trying to query id at least.`)
      // If empty, we can't easily know the schema this way using JS client unless we do a REST API OPTIONS or GET to `/rest/v1/?apikey=...`
    }
  }
}

getSchema()
