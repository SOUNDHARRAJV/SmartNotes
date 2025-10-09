import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zoqopdzntwrynjemundo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcW9wZHpudHdyeW5qZW11bmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTIyNjksImV4cCI6MjA3NTE2ODI2OX0.igCJMs8ZRjn-BCQquHho0S8Omk76os8asgHLsEQ_lDA'

export const supabase = createClient(supabaseUrl, supabaseKey)
