CREATE TABLE IF NOT EXISTS words (
  mode TEXT NOT NULL,
  date TEXT NOT NULL,          -- ISO date string, 'YYYY-MM-DD'
  word TEXT NOT NULL,
  meaning TEXT,
  usage_html TEXT,
  PRIMARY KEY (mode, date)
);
