INSERT INTO states (id, code, name) VALUES
  (1,'GJ','Gujarat'),(2,'KA','Karnataka'),(3,'MH','Maharashtra'),
  (4,'TG','Telangana'),(5,'DL','Delhi'),(6,'RJ','Rajasthan')
ON CONFLICT (code) DO NOTHING;
