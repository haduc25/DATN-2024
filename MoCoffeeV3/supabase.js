import {createClient} from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://klkbsgrcrnwkdwbwhidl.supabase.co';

const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa2JzZ3Jjcm53a2R3YndoaWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgzMjc4NjUsImV4cCI6MjAyMzkwMzg2NX0.lgBJIvBqHEo7lHYvfFQ8ePE2AsQXKTiknlwBPyu9lEQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
