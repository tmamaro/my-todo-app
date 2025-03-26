import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldwfccbfvebjozvkpbkf.supabase.co';//'https://your-project-url.supabase.co'; // replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkd2ZjY2JmdmViam96dmtwYmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzYxNjIsImV4cCI6MjA1NjYxMjE2Mn0.RxXW9oJb39_polK4tdcm_yHgEPUTW7uGRXm6kJ7ah3g';//'your-anon-key'; // replace with your Supabase anon key
export const supabase = createClient(supabaseUrl, supabaseKey, {
    realtime: {
      params: {
        eventsPerSecond: 10, // Adjust as needed
      },
    },
  });